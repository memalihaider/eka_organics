import { NextResponse } from "next/server";
import { checkPin } from "@/lib/pincode";
import { computeTotals, sanitizeCart, type PayMethod } from "@/lib/pricing";

/* POST /api/orders
   Validates the customer + cart and re-prices everything server-side
   (never trust totals from the browser).

   ⚠ PREVIEW: nothing is persisted and no payment is taken.
   To go live:
     1. Save the order to a database (status: "pending").
     2. For prepaid methods, create a Razorpay/Cashfree order for `totals.total * 100`
        paise and return its id to the client to open the payment sheet.
     3. Confirm payment in a webhook route, then mark the order "paid" and
        trigger WhatsApp/SMS/email notifications. */

const PAY: PayMethod[] = ["upi", "card", "nb", "cod"];

interface Body {
  cart?: unknown;
  coupon?: string | null;
  pay?: string;
  customer?: Record<string, string>;
}

export async function POST(req: Request) {
  let body: Body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const cart = sanitizeCart(body.cart);
  if (!cart.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  const pay = PAY.includes(body.pay as PayMethod) ? (body.pay as PayMethod) : null;
  if (!pay) return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });

  const c = body.customer ?? {};
  const errors: Record<string, string> = {};
  if (!/^[6-9]\d{9}$/.test(c.phone ?? "")) errors.phone = "Enter a valid 10-digit mobile number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email ?? "")) errors.email = "Enter a valid email";
  if ((c.name ?? "").trim().length < 2) errors.name = "Please enter your name";
  if ((c.addr1 ?? "").trim().length < 4) errors.addr1 = "Please enter your address";
  if ((c.city ?? "").trim().length < 2) errors.city = "Please enter your city";
  if (!c.state) errors.state = "Please select your state";
  const pin = checkPin(c.pin ?? "");
  if (!pin.ok) errors.pin = "Enter a valid 6-digit PIN code";
  else if (pay === "cod" && !pin.cod) errors.pin = "Cash on Delivery isn't available for this PIN code";
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please check your details.", errors }, { status: 422 });

  const coupon = body.coupon ? String(body.coupon).toUpperCase() : null;
  const totals = computeTotals(cart, coupon, pay);
  if (totals.couponErr) return NextResponse.json({ error: totals.couponErr }, { status: 422 });

  const orderId = "EKA" + Date.now().toString().slice(-7);

  return NextResponse.json({
    orderId,
    total: totals.total,
    items: totals.count,
    pay,
    deliveryBy: pin.ok ? pin.by : null,
    preview: true,
  });
}
