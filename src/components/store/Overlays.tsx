"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_MAP, STAGES, isPurchasable, variantLabel } from "@/lib/data";
import { inr } from "@/lib/format";
import ProductArt from "../ProductArt";
import ProductThumb from "../ProductThumb";
import { Close } from "../Icons";
import { storage, useStore } from "./StoreProvider";

/* ---------------------------------------------------------------- Quiz */
type Opt = [key: string, title: string, sub: string];
const STAGE_OPTS: Opt[] = [
  ["mid", "40 and beyond", "A calming ritual for mature skin"],
  ["preg1", "Expecting · First trimester", "Weeks 1–12"], ["preg2", "Expecting · 2nd or 3rd trimester", "Weeks 13–40"],
  ["post", "Newly postpartum", "The first 3 months"], ["baby", "Caring for my little one", "Newborn to 3 years"],
];
const NEEDS: Record<string, Opt[]> = {
  mid: [["winddown", "Winding down at night", "A deliberate pause before sleep"], ["dryabd", "Dry abdominal skin", "Gentle, non-sticky nourishment"], ["sensitive", "A low-fragrance routine", "Soft aroma, no added camphor"], ["hairmid", "Scalp & hair care", "A nourishing weekly oiling"]],
  preg1: [["prevent", "Preparing skin early", "Gentle, daily nourishment"], ["dry", "Dry, tight-feeling skin", "Comfort for changing skin"]],
  preg2: [["marks", "Soft, supple skin", "As your belly grows"], ["dry", "Tight-feeling belly skin", "Deep overnight nourishment"]],
  post: [["recovery", "The forty-day ritual", "Warming Sutika massage"], ["hair", "Scalp & hair care", "A nourishing scalp oiling"], ["nursing", "Nursing comfort", "Dry, delicate skin"], ["marks", "Continued belly care", "Soft, nourished skin"]],
  baby: [["malish", "Daily malish", "Massage & bonding"], ["nappy", "Nappy area & dry patches", "Calm, protected skin"], ["bath", "Gentle, soap-free bath", "For 6 months+"]],
};
const GIFT_OPTS: Opt[] = [["me", "For me", "Building my own ritual"], ["gift", "A gift", "Baby shower or new-mother gift"]];
const REC: Record<string, string[]> = {
  winddown: ["nabhi-ritual-oil"], dryabd: ["nabhi-ritual-oil", "velvet-belly-butter"], sensitive: ["nabhi-ritual-oil"], hairmid: ["nabhi-ritual-oil", "mama-hair-elixir"],
  prevent: ["bloom-belly-oil"], dry: ["velvet-belly-butter", "bloom-belly-oil"], marks: ["bloom-belly-oil", "velvet-belly-butter"],
  recovery: ["sutika-postpartum-oil", "nurture-nursing-balm"], hair: ["mama-hair-elixir", "sutika-postpartum-oil"], nursing: ["nurture-nursing-balm", "sutika-postpartum-oil"],
  malish: ["malish-baby-oil", "soothe-baby-balm"], nappy: ["soothe-baby-balm", "malish-baby-oil"], bath: ["baby-ubtan", "malish-baby-oil"],
};
const GIFT_SET: Record<string, string> = { mid: "nabhi-ritual-oil", preg1: "nine-month-ritual", preg2: "nine-month-ritual", post: "welcome-home-hamper", baby: "first-malish-kit" };

function Quiz() {
  const { add, openModal } = useStore();
  const [ans, setAns] = useState<string[]>([]);
  const steps = [
    { q: "Where are you in your journey?", opts: STAGE_OPTS },
    { q: "What would you most like support with?", opts: NEEDS[ans[0]] ?? [] },
    { q: "Is this for you, or a gift?", opts: GIFT_OPTS },
  ];
  const step = ans.length;

  if (step >= steps.length) {
    const [stage, need, gift] = ans;
    let ids = REC[need] ?? ["bloom-belly-oil"];
    if (gift === "gift") ids = [...new Set([GIFT_SET[stage], ids[0]])];
    const ps = ids.map((i) => PRODUCT_MAP[i]);
    const total = ps.reduce((s, p) => s + p.variants[0].price, 0);
    return (
      <div className="quiz">
        <p className="eyebrow">— Your Eka ritual —</p>
        <h3>Curated <em style={{ color: "var(--taupe)" }}>for you</em></h3>
        <div className="quiz__result">
          {ps.map((p) => (
            <div className="card" key={p.id}>
              <Link className="card__media" href={`/products/${p.id}`} onClick={() => openModal(null)}><ProductArt p={p} /></Link>
              <div className="card__body"><span className="card__name">{p.name}</span><span className="card__sub">{p.sub}</span><span className="price">{inr(p.variants[0].price)}</span></div>
            </div>
          ))}
        </div>
        <button className="btn" onClick={() => ids.forEach((id, n) => add(id, 0, 1, { open: n === ids.length - 1 }))}>Add ritual to bag · {inr(total)}</button>
        <button className="quiz__back" onClick={() => setAns([])}>↺ Start again</button>
      </div>
    );
  }

  const s = steps[step];
  return (
    <div className="quiz">
      <div className="quiz__top"><span className="kicker">Step {step + 1} of {steps.length}</span><span className="quiz__bar"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></span></div>
      <p className="eyebrow">— Find your ritual —</p>
      <h3>{s.q}</h3>
      <div className="quiz__opts">
        {s.opts.map(([k, a, b]) => <button key={k} className="quiz__opt" onClick={() => setAns([...ans, k])}><b>{a}</b><span>{b}</span></button>)}
      </div>
      {step > 0 && <button className="quiz__back" onClick={() => setAns(ans.slice(0, -1))}>← Back</button>}
    </div>
  );
}

/* ---------------------------------------------------------------- Quick view */
function QuickView({ id }: { id: string }) {
  const { add, openModal } = useStore();
  const [sel, setSel] = useState(0);
  const p = PRODUCT_MAP[id]; if (!p) return null;
  const v = p.variants[sel];
  const canBuy = isPurchasable(v);
  return (
    <div className="qv">
      <div className="qv__media"><ProductThumb p={p} sizes="420px" /></div>
      <div className="qv__info">
        <span className="card__stage">{STAGES[p.stage].name}</span>
        <h3>{p.name}</h3>
        <p style={{ color: "var(--muted)" }}>{p.sub}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", margin: "18px 0" }}>
          <b style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500 }}>{v.price > 0 ? inr(v.price) : "Price soon"}</b>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>{variantLabel(v)}{v.sku ? ` · ${v.sku}` : ""}{v.price > 0 ? " · MRP incl. of all taxes" : ""}</span>
        </div>
        <ul style={{ paddingLeft: 18, color: "var(--muted)", fontSize: 14, margin: "0 0 24px" }}>{p.benefits.slice(0, 3).map((b) => <li key={b}>{b}</li>)}</ul>
        {p.variants.length > 1 && (
          <div className="sizes sizes--packs" style={{ marginBottom: 16 }}>
            {p.variants.map((x, i) => (
              <button key={x.sku ?? x.size} className={`size${i === sel ? " on" : ""}`} onClick={() => setSel(i)} disabled={x.stock === 0}>
                {x.name ?? x.size}<small>{x.price > 0 ? inr(x.price) : x.size}</small>
              </button>
            ))}
          </div>
        )}
        {canBuy
          ? <button className="btn btn--block" onClick={() => add(id, sel)}>Add to bag</button>
          : <Link className="btn btn--block" href={`/products/${p.id}`} onClick={() => openModal(null)}>View full details</Link>}
        <Link className="link-u" href={`/products/${p.id}`} onClick={() => openModal(null)}>View full details</Link>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Welcome offer */
function Welcome() {
  const { applyCoupon, openModal } = useStore();
  const [done, setDone] = useState(false);
  return (
    <div className="pop">
      <div className="pop__media" />
      <div className="pop__copy">
        <p className="eyebrow">— Welcome to Eka —</p>
        <h3 className="h-md">Join <b>the Eka Circle</b></h3>
        <p style={{ color: "var(--muted)" }}>Receive our Ritual Guide — gentle Ayurvedic practices for every chapter — and complimentary shipping on your first order.</p>
        {done ? (
          <><div className="code-box">WELCOME</div><p style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>Complimentary shipping is applied to your bag. Your guide is on its way.</p></>
        ) : (
          // TODO: POST the email to your ESP (Klaviyo / Mailchimp) here
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); applyCoupon("WELCOME"); }}>
            <input type="email" required placeholder="Your email address" aria-label="Email" />
            <button className="btn">Send me the guide</button>
          </form>
        )}
        <button className="no" onClick={() => openModal(null)}>{done ? "Continue shopping" : "No thanks"}</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Modal root */
export function ModalRoot() {
  const { modal, openModal } = useStore();
  return (
    <div className={`modal${modal ? " on" : ""}`} aria-hidden={!modal} role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) openModal(null); }}>
      <div className="modal__panel">
        {modal && <button className="icon-btn modal__close" aria-label="Close" onClick={() => openModal(null)}><Close /></button>}
        {modal?.kind === "quiz" && <Quiz />}
        {modal?.kind === "quickview" && <QuickView key={modal.id} id={modal.id} />}
        {modal?.kind === "welcome" && <Welcome />}
      </div>
    </div>
  );
}

/** Opens the welcome offer once, 14s into the first visit (never on checkout). */
export function WelcomeTrigger() {
  const { openModal, modal, drawer } = useStore();
  const pathname = usePathname();
  const busy = useRef(false);
  useEffect(() => { busy.current = !!modal || !!drawer || pathname.startsWith("/checkout"); }, [modal, drawer, pathname]);
  useEffect(() => {
    if (storage.get("popSeen", false)) return;
    const t = setTimeout(() => {
      if (busy.current) return;
      storage.set("popSeen", true);
      openModal({ kind: "welcome" });
    }, 14000);
    return () => clearTimeout(t);
  }, [openModal]);
  return null;
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast${toast ? " on" : ""}`} role="status" aria-live="polite">
      {toast && <><span>{toast.msg}</span>{toast.action && <button onClick={toast.action.fn}>{toast.action.label}</button>}</>}
    </div>
  );
}

/** Fades in `.rv` elements as they scroll into view; re-runs on navigation. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    // Content is visible by default (no-JS, crawlers, link previews). The fade-in
    // only activates once JS runs; anything already on screen is marked visible
    // first so nothing flickers.
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    const scan = () => document.querySelectorAll<HTMLElement>(".rv:not(.in)").forEach((el, i) => {
      if (el.getBoundingClientRect().top < innerHeight) { el.classList.add("in"); return; }
      el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el);
    });
    scan();
    document.documentElement.classList.add("reveal-ready");
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);
  return null;
}
