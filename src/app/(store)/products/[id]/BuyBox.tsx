"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CLAIMS, CONFIG, isPurchasable, productBrand, variantLabel, type Product } from "@/lib/data";
import { inr } from "@/lib/format";
import { checkPin, type PinResult } from "@/lib/pincode";
import { MAX_QTY } from "@/lib/pricing";
import ProductThumb from "@/components/ProductThumb";
import { Cash, Gift, List, Moon, Return, Shield, Truck } from "@/components/Icons";
import { storage, useStore } from "@/components/store/StoreProvider";

function PinChecker() {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<PinResult | null>(null);
  const run = (v: string) => { const r = checkPin(v); setRes(r); if (r.ok) storage.set("pin", v); };
  useEffect(() => { const saved = storage.get("pin", ""); if (saved) { setPin(saved); run(saved); } }, []);
  return (
    <div className="pin">
      <div className="opt-label" style={{ marginTop: 0 }}>Check delivery</div>
      <form onSubmit={(e) => { e.preventDefault(); run(pin); }}>
        <input inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" aria-label="PIN code" value={pin}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setPin(v); if (v.length === 6) run(v); }} />
        <button>Check</button>
      </form>
      {res && (
        <div className="pin__out">
          {!res.ok ? <span className="err">Please enter a valid 6-digit PIN code.</span> : <>
            <span className="ok">✓ Delivery to {pin}{res.place && ` (${res.place})`} by <b>{res.by}</b></span>
            <span>{res.cod ? "✓ Cash on Delivery available" : "Prepaid orders only for this PIN code"} · Free shipping above ₹{CONFIG.freeShippingAt}</span>
          </>}
        </div>
      )}
    </div>
  );
}

function stockCopy(stock: number | undefined) {
  if (stock === undefined) return null;
  if (stock <= 0) return <span className="stock stock--out">Out of stock</span>;
  if (stock <= 5) return <span className="stock stock--low">Only {stock} left</span>;
  return <span className="stock stock--ok">In stock</span>;
}

export default function BuyBox({
  p, pair, variant = 0, onVariantChange,
}: {
  p: Product;
  pair?: Product;
  variant?: number;
  onVariantChange?: (i: number) => void;
}) {
  const { add } = useStore();
  const router = useRouter();
  const [v, setV] = useState(variant);
  const [q, setQ] = useState(1);
  const [sticky, setSticky] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);
  const x = p.variants[v] ?? p.variants[0];
  const canBuy = isPurchasable(x);
  const maxQ = x.stock !== undefined ? Math.min(MAX_QTY, x.stock) : MAX_QTY;
  const brand = productBrand(p);

  useEffect(() => { setV(variant); }, [variant]);
  useEffect(() => { setQ((n) => Math.min(n, Math.max(1, maxQ || 1))); }, [maxQ, v]);

  const select = (i: number) => { setV(i); onVariantChange?.(i); };

  useEffect(() => {
    const el = atcRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => { io.disconnect(); document.body.classList.remove("has-sticky"); };
  }, []);
  useEffect(() => { document.body.classList.toggle("has-sticky", sticky); }, [sticky]);

  const showCompare = x.mrp > x.price && x.price > 0;
  const packMode = p.variants.some((o) => o.name);

  return (
    <>
      {p.brand && <p className="pdp-brand">{brand}{p.sub ? ` · ${p.sub}` : ""}</p>}
      <div className="price-row" style={{ marginTop: p.brand ? 10 : 22 }}>
        {x.price > 0 ? (
          <>
            <b>{inr(x.price)}</b>
            {showCompare && <s className="price-compare">{inr(x.mrp)}</s>}
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{variantLabel(x)}</span>
            <small>MRP · inclusive of all taxes</small>
          </>
        ) : (
          <>
            <b className="price-pending">Price coming soon</b>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{variantLabel(x)}</span>
            <small>Final MRP will appear here once confirmed</small>
          </>
        )}
      </div>
      {x.sku && <div className="sku-line">SKU: {x.sku}</div>}
      {stockCopy(x.stock)}
      {p.forWhom && <div className="for-whom"><Moon /><span>{p.forWhom}</span></div>}

      {p.variants.length > 1 && <>
        <div className="opt-label">{packMode ? "Pack" : "Size"}</div>
        <div className={`sizes${packMode ? " sizes--packs" : ""}`}>
          {p.variants.map((o, i) => (
            <button
              key={o.sku ?? o.size}
              type="button"
              className={`size${i === v ? " on" : ""}${!isPurchasable(o) && o.stock === 0 ? " size--disabled" : ""}`}
              onClick={() => select(i)}
              disabled={o.stock === 0}
            >
              {o.name ?? o.size}
              <small>{o.name ? o.size : null}{o.price > 0 ? `${o.name ? " · " : ""}${inr(o.price)}` : (o.name ? "" : "TBA")}</small>
            </button>
          ))}
        </div>
      </>}

      <div className="buy-row">
        <span className="qty">
          <button type="button" onClick={() => setQ(Math.max(1, q - 1))} aria-label="Decrease" disabled={!canBuy}>−</button>
          <span>{q}</span>
          <button type="button" onClick={() => setQ(Math.min(maxQ, q + 1))} aria-label="Increase" disabled={!canBuy}>+</button>
        </span>
        <button
          className="btn"
          ref={atcRef}
          disabled={!canBuy}
          onClick={() => canBuy && add(p.id, v, q)}
        >
          {canBuy ? `Add to bag · ${inr(x.price * q)}` : (x.stock === 0 ? "Out of stock" : "Price coming soon")}
        </button>
      </div>
      <button
        className="btn btn--ghost btn--block buy-now"
        disabled={!canBuy}
        onClick={() => { if (!canBuy) return; add(p.id, v, q, { open: false }); router.push("/checkout"); }}
      >
        Buy it now
      </button>

      <div className="offers">
        <div><Truck /><span>Complimentary shipping above ₹{CONFIG.freeShippingAt} · Cash on Delivery available</span></div>
        <div><Gift /><span>Two ritual miniatures with orders above {inr(CONFIG.giftAt)} · gift note on request</span></div>
      </div>

      <PinChecker />

      <div className="mini-trust">
        <div><Truck />Free shipping<br />above ₹{CONFIG.freeShippingAt}</div>
        <div><Cash />Cash on<br />Delivery</div>
        <div><Return />Easy 7-day<br />returns</div>
        {CLAIMS.dermatologistTested ? <div><Shield />Dermatologist-<br />tested</div> : <div><List />Fully disclosed<br />ingredients</div>}
      </div>

      {pair && (
        <div className="fbt"><h5>Pairs beautifully with</h5>
          <div className="fbt__row">
            <span className="thumb"><ProductThumb p={p} sizes="72px" /></span><span className="plus">+</span>
            <Link className="thumb" href={`/products/${pair.id}`}><ProductThumb p={pair} sizes="72px" /></Link>
            <div className="fbt__info"><b>{pair.name}</b>{pair.variants[0].price > 0 ? `${inr(pair.variants[0].price)} · ` : ""}{variantLabel(pair.variants[0])}</div>
            {isPurchasable(pair.variants[0]) && (
              <button className="btn btn--sm" onClick={() => add(pair.id, 0, 1, { open: false })}>Add</button>
            )}
          </div>
        </div>
      )}

      <div className={`sticky-atc${sticky ? " on" : ""}`} aria-hidden={!sticky}>
        <span className="thumb"><ProductThumb p={p} sizes="56px" /></span>
        <div><b>{p.name}</b><small>{variantLabel(x)}{x.price > 0 ? ` · ${inr(x.price)}` : ""}</small></div>
        <button className="btn" tabIndex={sticky ? 0 : -1} disabled={!canBuy} onClick={() => canBuy && add(p.id, v, q)}>
          {canBuy ? "Add to bag" : "Soon"}
        </button>
      </div>
    </>
  );
}
