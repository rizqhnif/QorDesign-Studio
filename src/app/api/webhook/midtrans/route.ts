import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendDownloadEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = payload;

    // Validate Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Invalid Midtrans signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine if payment is successful
    const isSuccess =
      transaction_status === "capture"
        ? fraud_status === "accept"
        : transaction_status === "settlement";

    if (!isSuccess) {
      // Handle failed/cancelled/expired
      if (
        transaction_status === "cancel" ||
        transaction_status === "deny" ||
        transaction_status === "expire"
      ) {
        await supabaseAdmin
          .from("orders")
          .update({ status: transaction_status })
          .eq("id", order_id);
      }
      return NextResponse.json({ received: true });
    }

    // Get order from Supabase
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      console.error("Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      // Already processed
      return NextResponse.json({ received: true });
    }

    // Update order status
    await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_type: payment_type || null,
      })
      .eq("id", order_id);

    // For product orders: generate download links
    if (order.type === "product") {
      const downloadLinks: { title: string; url: string; token: string }[] = [];

      for (const item of order.items) {
        const dlToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabaseAdmin.from("download_links").insert({
          token: dlToken,
          order_id: order_id,
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
        orderId: order_id,
      });
    }

    // For service orders: just log
    if (order.type === "service") {
      console.log(`Service order paid: ${order_id} by ${order.buyer_name}`);
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
