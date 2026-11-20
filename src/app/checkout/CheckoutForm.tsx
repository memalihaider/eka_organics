"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONFIG, PRODUCT_MAP, variantLabel } from "@/lib/data";
import { inr } from "@/lib/format";
import { checkPin, stateFor, STATES } from "@/lib/pincode";
import type { PayMethod } from "@/lib/pricing";
import ProductThumb from "@/components/ProductThumb";
import { Gift, Leaf, Lock, Return, Truck } from "@/components/Icons";
import { CouponForm } from "@/components/store/CartDrawer";
import { storage, useStore } from "@/components/store/StoreProvider";

type Fields = Record<"phone" | "email" | "name" | "addr1" | "addr2" | "pin" | "city" | "state", string>;
const EMPTY: Fields = { phone: "", email: "", name: "", addr1: "", addr2: "", pin: "", city: "", state: "" };

const RULES: Partial<Record<keyof Fields, (v: string) => true | string>> = {
  phone: (v) => /^[6-9]\d{9}$/.test(v) || "Enter a valid 10-digit mobile number",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email",
  name: (v) => v.trim().length > 1 || "Please enter your name",
  addr1: (v) => v.trim().length > 3 || "Please enter your address",
  pin: (v) => checkPin(v).ok || "Enter a valid 6-digit PIN code",
  city: (v) => v.trim().length > 1 || "Please enter your city",
  state: (v) => !!v || "Please select your state",
};

const PAY_OPTS: { key: PayMethod; label: string; small: string; body: React.ReactNode }[] = [
  { key: "upi", label: "UPI", small: "GPay · PhonePe · Paytm · BHIM", body: <>Pay instantly with any UPI app — you&apos;ll approve the request on your phone.<div className="upi-apps"><span>Google Pay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div></> },
  { key: "card", label: "Credit / Debit card", small: "Visa · Mastercard · RuPay", body: "You'll enter card details on our secure payment partner's page. EMI available above ₹3,000." },
  { key: "nb", label: "NetBanking & Wallets", small: "All major banks", body: "Choose your bank on the next screen." },
  { key: "cod", label: "Cash on Delivery", small: `+${inr(CONFIG.codFee)}`, body: `Pay in cash or UPI when your parcel arrives. A ${inr(CONFIG.codFee)} handling fee applies.` },
];

function Field({ name, label, value, error, onChange, className = "", ref, ...rest }: {
  name: keyof Fields; label: string; value: string; error?: string; onChange: (v: string) => void; className?: string; ref?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "name">) {
  return (
    <div className={`field ${className}${error ? " err" : ""}`}>
      <input id={`f_${name}`} ref={ref} name={name} placeholder=" " value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      <label htmlFor={`f_${name}`}>{label}</label>
      <div className="hint">{error}</div>
    </div>
  );
}

export default function CheckoutForm() {
  const { ready, cart, coupon, totals, clear } = useStore();
  const router = useRouter();
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [pay, setPay] = useState<PayMethod>("upi");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setF({ ...EMPTY, ...storage.get<Partial<Fields>>("addr", {}) }); }, []);

  const pin = f.pin.length === 6 ? checkPin(f.pin) : null;
  const codOk = !pin || !pin.ok || pin.cod;
  useEffect(() => { if (!codOk && pay === "cod") setPay("upi"); }, [codOk, pay]);

  const set = (k: keyof Fields) => (v: string) => {
    if (k === "phone" || k === "pin") v = v.replace(/\D/g, "");
    setF((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "pin" && v.length === 6) {
        const r = checkPin(v);
        if (r.ok) { if (!prev.state) next.state = stateFor(v); if (!prev.city && r.metro) next.city = r.metro.replace(" NCR", ""); }
      }
      return next;
    });
    // Clear this field's error — and city/state too when a PIN may have autofilled them
    setErrors((e) => (k === "pin" ? { ...e, pin: undefined, city: undefined, state: undefined } : { ...e, [k]: undefined }));
  };

  if (!ready) return <div style={{ minHeight: "70vh" }} />;
  if (!cart.length) {
    return (
      <div className="empty" style={{ padding: "120px 20px" }}>
        <Image src="/img/monogram-dark.png" alt="" width={220} height={200} />
        <h4>Your bag is empty</h4><p>Add a ritual to begin checkout.</p>
        <Link className="btn" href="/shop">Continue shopping</Link>
      </div>
    );
  }

  const t = totals(pay);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setServerError("");
    const errs: typeof errors = {};
    (Object.keys(RULES) as (keyof Fields)[]).forEach((k) => { const r = RULES[k]!(f[k]); if (r !== true) errs[k] = r; });
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) { const el = document.getElementById(`f_${first}`); el?.focus(); el?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }

    storage.set("addr", f);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart, coupon, pay, customer: f }) });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error ?? "Something went wrong."); if (data.errors) setErrors(data.errors); setSubmitting(false); return; }
      // TODO (live): for prepaid methods, open the Razorpay/Cashfree checkout here using data.gatewayOrderId
      storage.set("lastOrder", { ...data, name: f.name, phone: f.phone, city: f.city });
      clear();
      router.push("/order-confirmed");
    } catch {
      setServerError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout">
      <div className="co-main">
        <div className="steps"><Link href="/shop">Bag</Link> › <span className="on">Details &amp; Payment</span> › <span>Confirmation</span></div>
        <p className="kicker" style={{ marginBottom: 12 }}>Express checkout</p>
        <div className="express">
          {["UPI", "GPay", "PhonePe"].map((x) => <button key={x} type="button" onClick={() => { setPay("upi"); phoneRef.current?.focus(); }}>{x}</button>)}
        </div>
        <div className="or">or pay below</div>

        <form onSubmit={submit} noValidate>
          <div className="fieldset"><h3>Contact</h3><div className="fields">
            <Field name="phone" label="Mobile number (10 digits)" value={f.phone} error={errors.phone} onChange={set("phone")} inputMode="numeric" maxLength={10} autoComplete="tel-national" ref={phoneRef} />
            <Field name="email" label="Email" value={f.email} error={errors.email} onChange={set("email")} type="email" autoComplete="email" />
          </div><label className="checkline"><input type="checkbox" defaultChecked /> Send order updates on WhatsApp</label></div>

          <div className="fieldset"><h3>Delivery address</h3><div className="fields">
            <Field name="name" label="Full name" className="full" value={f.name} error={errors.name} onChange={set("name")} autoComplete="name" />
            <Field name="addr1" label="Flat, house no., building" className="full" value={f.addr1} error={errors.addr1} onChange={set("addr1")} autoComplete="address-line1" />
            <Field name="addr2" label="Area, street, landmark" className="full" value={f.addr2} onChange={set("addr2")} autoComplete="address-line2" />
            <Field name="pin" label="PIN code" value={f.pin} error={errors.pin} onChange={set("pin")} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
            <Field name="city" label="City" value={f.city} error={errors.city} onChange={set("city")} autoComplete="address-level2" />
            <div className={`field full${errors.state ? " err" : ""}`}>
              <select id="f_state" name="state" value={f.state} onChange={(e) => set("state")(e.target.value)}>
                <option value="">Select</option>{STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <label htmlFor="f_state">State</label><div className="hint">{errors.state}</div>
            </div>
          </div>
          {pin?.ok && <p className="checkline" style={{ marginTop: 12 }}><Truck width={20} style={{ fill: "none", stroke: "var(--taupe)", strokeWidth: 1.4 }} /> Estimated delivery by <b style={{ color: "var(--ink)", marginLeft: 4 }}>{pin.by}</b></p>}
          </div>

          <div className="fieldset"><h3>Payment</h3>
            <div className="pay">
              {PAY_OPTS.map((o) => {
                const disabled = o.key === "cod" && !codOk;
                return (
                  <div key={o.key} className={`pay__opt${pay === o.key ? " on" : ""}`} style={disabled ? { opacity: 0.45 } : undefined}>
                    <label><input type="radio" name="pay" value={o.key} checked={pay === o.key} disabled={disabled} onChange={() => setPay(o.key)} /> {o.label} <small>{disabled ? "Not available for this PIN" : o.small}</small></label>
                    <div className="pay__body">{o.body}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {serverError && <p className="coupon-msg err" style={{ marginBottom: 12 }}>{serverError}</p>}
          <button className="btn btn--block" disabled={submitting} style={{ height: 58 }}>
            {submitting ? (pay === "cod" ? "Confirming your order…" : "Connecting to secure payment…") : `Place order · ${inr(t.total)}`}
          </button>
          <p className="secure"><Lock /> 256-bit SSL encrypted · Your details are never stored on our servers</p>
          <p className="placeholder-note">Preview mode — payments are simulated. Connect Razorpay / Cashfree before launch (see src/app/api/orders/route.ts).</p>
        </form>
      </div>

      <aside className="co-side"><div className="co-side__inner">
        <h3 style={{ fontSize: 28, marginBottom: 22 }}>Order summary</h3>
        <div className="co-items">
          {cart.map((l) => { const p = PRODUCT_MAP[l.id], v = p.variants[l.v]; return (
            <div className="co-item" key={`${l.id}-${l.v}`}><span className="thumb"><ProductThumb p={p} sizes="64px" /><i>{l.q}</i></span><span><b>{p.name}</b><small>{variantLabel(v)}{v.sku ? ` · ${v.sku}` : ""}</small></span><span className="p">{inr(v.price * l.q)}</span></div>
          ); })}
          {t.gift && <div className="co-item"><span className="thumb" style={{ display: "grid", placeItems: "center", background: "var(--cream)" }}><Gift width={28} style={{ fill: "none", stroke: "var(--taupe)", strokeWidth: 1.3 }} /></span><span><b>2 Ayurvedic miniatures</b><small>Complimentary gift</small></span><span className="p">Free</span></div>}
        </div>
        <CouponForm compact />
        <div className="totals">
          <div><span>Subtotal</span><span>{inr(t.sub)}</span></div>
          {t.disc > 0 && <div><span>Code ({coupon})</span><span>−{inr(t.disc)}</span></div>}
          <div><span>Shipping</span><span>{t.ship ? inr(t.ship) : "Complimentary"}</span></div>
          {t.cod > 0 && <div><span>COD handling</span><span>{inr(t.cod)}</span></div>}
          <div className="grand"><span>Total</span><span>{inr(t.total)}</span></div>
          <div style={{ justifyContent: "flex-end", fontSize: 12, color: "var(--muted)" }}>MRP, inclusive of all taxes</div>
        </div>
        {t.ship > 0 && <p className="coupon-msg" style={{ marginTop: 10, color: "var(--muted)" }}>Complimentary shipping on orders above ₹{CONFIG.freeShippingAt}.</p>}
        <div className="mini-trust" style={{ marginTop: 28 }}>
          <div><Truck />Dispatched<br />in 24 hrs</div><div><Return />Easy 7-day<br />returns</div><div><Leaf />Traceable<br />sourcing</div><div><Lock style={{ strokeWidth: 1 }} />Secure<br />payments</div>
        </div>
      </div></aside>
    </div>
  );
}
