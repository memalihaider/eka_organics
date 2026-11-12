"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONFIG, type Product } from "@/lib/data";
import { inr, pctOff } from "@/lib/format";
import { checkPin, type PinResult } from "@/lib/pincode";
import { MAX_QTY } from "@/lib/pricing";
import ProductArt from "@/components/ProductArt";
import { Cash, Return, Shield, Tag, Truck } from "@/components/Icons";
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

export default function BuyBox({ p, pair }: { p: Product; pair?: Product }) {
  const { add } = useStore();
  const router = useRouter();
  const [v, setV] = useState(0);
  const [q, setQ] = useState(1);
  const [sticky, setSticky] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);
  const x = p.variants[v];

  useEffect(() => {
    const el = atcRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => { io.disconnect(); document.body.classList.remove("has-sticky"); };
  }, []);
  useEffect(() => { document.body.classList.toggle("has-sticky", sticky); }, [sticky]);

  const sizeNote = p.variants.length > 1 ? (v > 0 ? `Best value — ${inr((x.price / parseFloat(x.size)) * 100)} per 100` : x.size) : "";

  return (
    <>
      <div className="price-row" style={{ marginTop: 22 }}>
        <b>{inr(x.price)}</b>
        {x.mrp > x.price && <><s>MRP {inr(x.mrp)}</s><span className="off">{pctOff(x)}% off</span></>}
        <small>Inclusive of all taxes</small>
      </div>

      {p.variants.length > 1 && <>
        <div className="opt-label">Size <span>{sizeNote}</span></div>
        <div className="sizes">
          {p.variants.map((o, i) => <button key={o.size} className={`size${i === v ? " on" : ""}`} onClick={() => setV(i)}>{o.size}<small>{inr(o.price)}</small></button>)}
        </div>
      </>}

      <div className="buy-row">
        <span className="qty">
          <button onClick={() => setQ(Math.max(1, q - 1))} aria-label="Decrease">−</button><span>{q}</span>
          <button onClick={() => setQ(Math.min(MAX_QTY, q + 1))} aria-label="Increase">+</button>
        </span>
        <button className="btn" ref={atcRef} onClick={() => add(p.id, v, q)}>Add to bag · {inr(x.price * q)}</button>
      </div>
      <button className="btn btn--ghost btn--block buy-now" onClick={() => { add(p.id, v, q, { open: false }); router.push("/checkout"); }}>Buy it now</button>

      <div className="offers">
        <div><Tag /><span>Use <b>EKAFIRST10</b> for 10% off your first order</span></div>
        <div><Tag /><span>Free express shipping above ₹{CONFIG.freeShippingAt} · <b>2 free miniatures</b> above {inr(CONFIG.giftAt)}</span></div>
      </div>

      <PinChecker />

      <div className="mini-trust">
        <div><Truck />Free shipping<br />above ₹{CONFIG.freeShippingAt}</div>
        <div><Cash />Cash on<br />Delivery</div>
        <div><Return />Easy 7-day<br />returns</div>
        <div><Shield />Pregnancy &amp;<br />baby-safe</div>
      </div>

      {pair && (
        <div className="fbt"><h5>Pairs beautifully with</h5>
          <div className="fbt__row">
            <span className="thumb"><ProductArt p={p} /></span><span className="plus">+</span>
            <Link className="thumb" href={`/products/${pair.id}`}><ProductArt p={pair} /></Link>
            <div className="fbt__info"><b>{pair.name}</b>{inr(pair.variants[0].price)} · {pair.variants[0].size}</div>
            <button className="btn btn--sm" onClick={() => add(pair.id, 0, 1, { open: false })}>Add</button>
          </div>
        </div>
      )}

      <div className={`sticky-atc${sticky ? " on" : ""}`} aria-hidden={!sticky}>
        <span className="thumb"><ProductArt p={p} /></span>
        <div><b>{p.name}</b><small>{x.size} · {inr(x.price)}</small></div>
        <button className="btn" tabIndex={sticky ? 0 : -1} onClick={() => add(p.id, v, q)}>Add to bag</button>
      </div>
    </>
  );
}
