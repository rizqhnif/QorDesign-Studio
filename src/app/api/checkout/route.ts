import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { snap } from "@/lib/midtrans";
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

    // Create Midtrans Snap transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: buyerName,
        email: buyerEmail,
        phone: buyerPhone || "",
      },
      item_details: items.map((item: { title: string; price: number }) => ({
        id: uuidv4().slice(0, 8),
        price: item.price,
        quantity: 1,
        name: item.title,
      })),
      callbacks: {
        finish: `${baseUrl}/order/success?order_id=${orderId}`,
        error: `${baseUrl}/order/failed?order_id=${orderId}`,
        pending: `${baseUrl}/order/success?order_id=${orderId}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

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
      midtrans_snap_token: transaction.token,
      midtrans_redirect_url: transaction.redirect_url,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    return NextResponse.json({
      orderId,
      snapToken: transaction.token,
      invoiceUrl: transaction.redirect_url,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
