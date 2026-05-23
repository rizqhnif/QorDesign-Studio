import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  generateSignature,
  DOKU_BASE_URL,
  CHECKOUT_PATH,
  DOKU_CLIENT_ID,
} from "@/lib/doku";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, buyerName, buyerEmail, buyerPhone, type } = body;

    if (!items?.length || !buyerName || !buyerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const orderId = `QDS-${uuidv4().slice(0, 8).toUpperCase()}`;
    const total = items.reduce(
      (sum: number, item: { price: number }) => sum + item.price,
      0,
    );
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const requestId = uuidv4();
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

    const requestBody = {
      order: {
        amount: total,
        invoice_number: orderId,
        currency: "IDR",
        callback_url: `${baseUrl}/order/success?order_id=${orderId}`,
        callback_url_cancel: `${baseUrl}/order/failed?order_id=${orderId}`,
        callback_url_result: `${baseUrl}/order/success?order_id=${orderId}`,
        language: "ID",
        auto_redirect: true,
        line_items: items.map(
          (item: { id?: string; title: string; price: number }) => ({
            id: item.id || uuidv4().slice(0, 8),
            name: item.title,
            quantity: 1,
            price: item.price,
          }),
        ),
      },
      payment: {
        payment_due_date: 60,
      },
      customer: {
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone ? `62${buyerPhone.replace(/^0/, "")}` : undefined,
      },
    };

    const signature = generateSignature({
      requestId,
      timestamp,
      path: CHECKOUT_PATH,
      body: requestBody,
    });

    const dokuRes = await fetch(`${DOKU_BASE_URL}${CHECKOUT_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": DOKU_CLIENT_ID,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: signature,
      },
      body: JSON.stringify(requestBody),
    });

    if (!dokuRes.ok) {
      const err = await dokuRes.json();
      console.error("DOKU error:", err);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 },
      );
    }

    const dokuData = await dokuRes.json();
    const paymentUrl = dokuData?.response?.payment?.url;

    if (!paymentUrl) {
      console.error("DOKU no payment URL:", dokuData);
      return NextResponse.json(
        { error: "Failed to get payment URL" },
        { status: 500 },
      );
    }

    // Save order to Supabase
    const { error: dbError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone || null,
      items: items,
      total,
      type: type || "product",
      status: "pending",
      doku_session_id: dokuData?.response?.order?.session_id || null,
      doku_payment_url: paymentUrl,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    return NextResponse.json({
      orderId,
      invoiceUrl: paymentUrl,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
