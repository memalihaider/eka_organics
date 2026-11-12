"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/data";
import { inr } from "@/lib/format";
import { storage } from "@/components/store/StoreProvider";

interface Order { orderId: string; total: number; items: number; pay: string; deliveryBy: string | null; name: string; phone: string; city: string }
const PAY_NAME: Record<string, string> = { upi: "UPI", card: "Card", nb: "NetBanking", cod: "Cash on Delivery" };

export default function OrderConfirmed() {
  const [o, setO] = useState<Order | null | undefined>(undefined);
  useEffect(() => { setO(storage.get<Order | null>("lastOrder", null)); }, []);

  if (o === undefined) return <div style={{ minHeight: "60vh" }} />;
  if (!o) return (
    <div className="empty" style={{ padding: "140px 20px" }}>
      <h4>No recent order found</h4><p>Let&apos;s get you back to something lovely.</p><Link className="btn" href="/shop">Shop all</Link>
    </div>
  );

  return (
    <div className="success">
      <Image src="/img/monogram-dark.png" alt="" width={220} height={200} />
      <p className="eyebrow">— Thank you, {o.name.split(" ")[0]} —</p>
      <h1 className="h-lg">Your ritual is <em>on its way</em></h1>
      <p className="lead" style={{ margin: "0 auto" }}>We&apos;ve sent your confirmation to WhatsApp (+91 {o.phone}). Your parcel will be hand-packed and dispatched within 24 hours.</p>
      <div className="card-o">
        <div><span>Order</span><b>#{o.orderId}</b></div>
        <div><span>Items</span><span>{o.items}</span></div>
        <div><span>Payment</span><span>{PAY_NAME[o.pay]}</span></div>
        <div><span>Delivering to</span><span>{o.city}</span></div>
        {o.deliveryBy && <div><span>Expected by</span><b>{o.deliveryBy}</b></div>}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}><span>Total</span><b>{inr(o.total)}</b></div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn" href="/shop">Continue shopping</Link>
        <a className="btn btn--ghost" href={whatsappUrl(`Hi, I'd like to track order #${o.orderId}`)} target="_blank" rel="noopener">Track on WhatsApp</a>
      </div>
      <p className="placeholder-note">Preview mode — no real order was placed or payment taken.</p>
    </div>
  );
}
