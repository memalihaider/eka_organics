"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CONFIG, PRODUCT_MAP } from "@/lib/data";
import { inr } from "@/lib/format";
import type { Totals } from "@/lib/pricing";
import ProductArt from "../ProductArt";
import { Close, Gift } from "../Icons";
import { useStore } from "./StoreProvider";

const UPSELLS = ["bloom-belly-oil", "malish-baby-oil", "nurture-nursing-balm", "soothe-baby-balm", "velvet-belly-butter", "baby-ubtan"];

export function ShippingMeter({ t }: { t: Totals }) {
  const max = CONFIG.giftAt * 1.08;
  const w = Math.min(100, (t.after / max) * 100);
  const a = (CONFIG.freeShippingAt / max) * 100, b = (CONFIG.giftAt / max) * 100;
  return (
    <div className="ship-meter">
      <p>
        {t.after < CONFIG.freeShippingAt ? <>You&apos;re <b>{inr(CONFIG.freeShippingAt - t.after)}</b> away from <b>free express shipping</b></>
          : t.after < CONFIG.giftAt ? <>Free shipping unlocked ✓ Add <b>{inr(CONFIG.giftAt - t.after)}</b> for <b>2 free miniatures</b></>
          : <><b>Free shipping + 2 complimentary miniatures</b> unlocked ✓</>}
      </p>
      <div className="meter">
        <div className="meter__fill" style={{ width: `${w}%` }} />
        <span className={`meter__tick${t.after >= CONFIG.freeShippingAt ? " hit" : ""}`} style={{ left: `${a}%` }} />
        <span className={`meter__tick${t.gift ? " hit" : ""}`} style={{ left: `${b}%` }} />
      </div>
      <div className="meter__labels"><span>Bag</span><span style={{ marginLeft: "auto", marginRight: "9%" }}>Free shipping ₹{CONFIG.freeShippingAt}</span><span>Gift {inr(CONFIG.giftAt)}</span></div>
    </div>
  );
}

export function CouponForm({ compact }: { compact?: boolean }) {
  const { coupon, applyCoupon, totals } = useStore();
  const t = totals();
  const [code, setCode] = useState(coupon && !t.couponErr ? coupon : "");
  return (
    <>
      <form className="coupon" onSubmit={(e) => { e.preventDefault(); applyCoupon(code || null); }}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
        <button className="btn btn--ghost btn--sm">Apply</button>
      </form>
      {coupon ? (
        <p className={`coupon-msg ${t.couponErr ? "err" : "ok"}`}>
          {t.couponErr || <>{coupon} applied{compact ? " ✓" : <> — {CONFIG.coupons[coupon].label}. </>}</>}
          {" "}<button type="button" onClick={() => { applyCoupon(null); setCode(""); }} style={{ textDecoration: "underline" }}>Remove</button>
        </p>
      ) : !compact && <p className="coupon-msg" style={{ color: "var(--muted)" }}>First order? Try <b>EKAFIRST10</b></p>}
    </>
  );
}

export default function CartDrawer() {
  const { cart, drawer, openDrawer, totals, setQty, remove, add } = useStore();
  const open = drawer === "cart";
  const t = totals();
  const inCart = new Set(cart.map((l) => l.id));
  const ups = UPSELLS.filter((id) => !inCart.has(id)).slice(0, 4);
  const close = () => openDrawer(null);

  return (
    <>
      <aside className={`drawer drawer--right${open ? " open" : ""}`} aria-hidden={!open} inert={!open} aria-label="Your bag">
        <div className="drawer__head">
          <h3 className="drawer__title">Your Bag {t.count > 0 && <span>({t.count})</span>}</h3>
          <button className="icon-btn" onClick={close} aria-label="Close bag"><Close /></button>
        </div>
        <div className="drawer__body">
          {!cart.length ? (
            <div className="empty">
              <Image src="/img/monogram-dark.png" alt="" width={220} height={200} />
              <h4>Your bag is empty</h4>
              <p>Begin with our signature Bloom Belly Oil — loved through every trimester.</p>
              <Link className="btn" href="/products/bloom-belly-oil" onClick={close}>Shop Bloom Belly Oil</Link>
            </div>
          ) : (
            <>
              <ShippingMeter t={t} />
              {cart.map((l, i) => {
                const p = PRODUCT_MAP[l.id], v = p.variants[l.v];
                return (
                  <div className="line-item" key={`${l.id}-${l.v}`}>
                    <Link className="thumb" href={`/products/${p.id}`} onClick={close}><ProductArt p={p} /></Link>
                    <div>
                      <h4>{p.name}</h4><div className="meta">{v.size}</div>
                      <div>
                        <span className="qty">
                          <button onClick={() => setQty(i, l.q - 1)} aria-label="Decrease">−</button><span>{l.q}</span>
                          <button onClick={() => setQty(i, l.q + 1)} aria-label="Increase">+</button>
                        </span>
                        <button className="remove" onClick={() => remove(i)}>Remove</button>
                      </div>
                    </div>
                    <div className="price">{inr(v.price * l.q)}{v.mrp > v.price && <s>{inr(v.mrp * l.q)}</s>}</div>
                  </div>
                );
              })}
              {t.gift && <div className="gift-line"><Gift /><span><b>2 Ayurvedic miniatures</b> will be tucked into your parcel — complimentary.</span></div>}
              {ups.length > 0 && (
                <div className="upsell">
                  <h5>Complete the ritual</h5>
                  <div className="upsell__row">
                    {ups.map((id) => { const p = PRODUCT_MAP[id]; return (
                      <div className="upsell__card" key={id}>
                        <Link className="thumb" href={`/products/${id}`} onClick={close}><ProductArt p={p} /></Link>
                        <b>{p.name}</b><small>{inr(p.variants[0].price)}</small><br />
                        <button onClick={() => add(id)}>+ Add</button>
                      </div>
                    ); })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer__foot">
            <CouponForm />
            <div className="totals">
              <div><span>Subtotal</span><span>{inr(t.sub)}</span></div>
              {t.mrp > t.sub && <div className="save"><span>You save on MRP</span><span>−{inr(t.mrp - t.sub)}</span></div>}
              {t.disc > 0 && <div className="save"><span>Coupon</span><span>−{inr(t.disc)}</span></div>}
              <div><span>Shipping</span><span>{t.ship ? inr(t.ship) : "Free"}</span></div>
              <div className="grand"><span>Total <small style={{ fontWeight: 300, color: "var(--muted)" }}>incl. GST</small></span><span>{inr(t.total)}</span></div>
            </div>
            <Link className="btn btn--block" href="/checkout" onClick={close}>Checkout securely · {inr(t.total)}</Link>
            <p className="foot-note">UPI · Cards · NetBanking · Cash on Delivery</p>
          </div>
        )}
      </aside>
      <div className={`scrim${open || drawer === "menu" ? " on" : ""}`} onClick={close} />
    </>
  );
}
