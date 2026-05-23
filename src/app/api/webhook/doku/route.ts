import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendDownloadEmail } from "@/lib/email";
import { verifyWebhookSignature } from "@/lib/doku";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const WEBHOOK_PATH = "/api/webhook/doku";

export async function POST(req: NextRequest) {
  try {
    const clientId = req.headers.get("Client-Id") || "";
    const requestId = req.headers.get("Request-Id") || "";
    const timestamp = req.headers.get("Request-Timestamp") || "";
    const incomingSignature = req.headers.get("Signature") || "";

    const payload = await req.json();

    // Verify DOKU webhook signature
    const isValid = verifyWebhookSignature({
      clientId,
      requestId,
      timestamp,
      path: WEBHOOK_PATH,
      body: payload,
      incomingSignature,
    });

    if (!isValid) {
      console.error("Invalid DOKU webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactionStatus = payload?.transaction?.status;
    const invoiceNumber = payload?.order?.invoice_number;

    // For CHECKOUT integration, ignore FAILED status (customer can retry)
    if (!transactionStatus || transactionStatus !== "SUCCESS") {
      return NextResponse.json({ received: true });
    }

    if (!invoiceNumber) {
      return NextResponse.json({ error: "Missing invoice number" }, { status: 400 });
    }

    // Get order from Supabase
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", invoiceNumber)
      .single();

    if (error || !order) {
      console.error("Order not found:", invoiceNumber);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      // Already processed — idempotent
      return NextResponse.json({ received: true });
    }

    // Update order status
    await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_type: payload?.channel?.id || null,
      })
      .eq("id", invoiceNumber);

    // For product orders: generate download links
    if (order.type === "product") {
      const downloadLinks: { title: string; url: string; token: string }[] = [];

      for (const item of order.items) {
        const dlToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabaseAdmin.from("download_links").insert({
          token: dlToken,
          order_id: invoiceNumber,
          product_title: item.title,
          product_id: item.id,
          expires_at: expiresAt.toISOString(),
          accessed: false,
        });

        downloadLinks.push({
          title: item.title,
          url: `${BASE_URL}/download/${dlToken}`,
          token: dlToken,
        });
      }

      // Send email with download links
      await sendDownloadEmail({
        to: order.buyer_email,
        buyerName: order.buyer_name,
        items: order.items,
        downloadLinks,
        orderId: invoiceNumber,
      });
    }

    // For service orders: just log
    if (order.type === "service") {
      console.log(`Service order paid: ${invoiceNumber} by ${order.buyer_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
