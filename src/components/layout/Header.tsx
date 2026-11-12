"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, STAGES, whatsappUrl } from "@/lib/data";
import { inr } from "@/lib/format";
import ProductArt from "../ProductArt";
import { Bag, Close, Menu, Search } from "../Icons";
import { useStore } from "../store/StoreProvider";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?stage=midlife", label: "Women 40+" },
  { href: "/shop?stage=pregnancy", label: "Pregnancy" },
  { href: "/shop?stage=postpartum", label: "Postpartum" },
  { href: "/shop?stage=baby", label: "Baby" },
  { href: "/shop?stage=sets", label: "Gift Sets" },
];

const MESSAGES = [
  <>Introducing <b>Nabhi Ritual Oil</b> — a quiet nightly ritual for women 40+</>,
  <>Complimentary Pan-India shipping on orders above ₹999</>,
  <>Cash on Delivery available · Easy 7-day returns</>,
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 4200); return () => clearInterval(t); }, []);
  return (
    <div className="announce" role="region" aria-label="Offers">
      <div className="announce__track">
        {MESSAGES.map((m, n) => <span key={n} className={n === i ? "on" : ""} aria-hidden={n !== i}><span>{m}</span></span>)}
      </div>
    </div>
  );
}

function SearchBar({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const term = q.trim().toLowerCase();
  const hits = term.length < 2 ? [] : PRODUCTS.filter((p) =>
    [p.name, p.sub, STAGES[p.stage].name, ...p.concerns, ...p.hero.map((h) => h.name)].join(" ").toLowerCase().includes(term)).slice(0, 5);
  return (
    <div className="search">
      <div className="search__inner">
        <input ref={ref} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search nabhi oil, belly oil, baby massage…" aria-label="Search products" />
        <button className="icon-btn" onClick={onClose} aria-label="Close search"><Close /></button>
      </div>
      {term.length >= 2 && (
        <div className="search__results">
          {hits.length ? hits.map((p) => (
            <Link key={p.id} className="sr-item" href={`/products/${p.id}`} onClick={onClose}>
              <span className="thumb"><ProductArt p={p} /></span>
              <span><b>{p.name}</b><small>{p.sub} · {inr(p.variants[0].price)}</small></span>
            </Link>
          )) : <p style={{ color: "var(--muted)", padding: 8 }}>No matches — try “belly”, “baby”, or “postpartum”.</p>}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { totals, ready, bump, drawer, openDrawer, openModal } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const count = ready ? totals().count : 0;
  const badge = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 30);
    on(); addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => setSearchOpen(false), [pathname]);
  useEffect(() => {
    const b = badge.current; if (!b || !bump) return;
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }, [bump]);

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="header__inner">
          <div className="header__left">
            <button className="icon-btn menu-toggle" onClick={() => openDrawer("menu")} aria-label="Open menu"><Menu /></button>
            <nav className="nav" aria-label="Primary">
              {NAV.slice(1).map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            </nav>
          </div>
          <Link href="/" className="logo" aria-label="Eka Organics home">
            <Image src="/img/wordmark-dark.png" alt="eka organics" width={591} height={387} priority />
          </Link>
          <div className="header__right">
            <Link className="nav-link hide-md" href="/story">Our Story</Link>
            <button className="nav-link hide-md quiz-link" onClick={() => openModal({ kind: "quiz" })}>Find Your Ritual</button>
            <button className="icon-btn" id="searchOpen" onClick={() => setSearchOpen((s) => !s)} aria-label="Search"><Search /></button>
            <button className="icon-btn" onClick={() => openDrawer("cart")} aria-label={`Open bag, ${count} items`}>
              <Bag />
              {count > 0 && <span className="badge" ref={badge}>{count}</span>}
            </button>
          </div>
        </div>
        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      </header>

      <aside className={`drawer drawer--left${drawer === "menu" ? " open" : ""}`} aria-hidden={drawer !== "menu"} inert={drawer !== "menu"}>
        <div className="drawer__head">
          <Image src="/img/wordmark-dark.png" alt="eka organics" width={591} height={387} className="drawer__logo" style={{ width: "auto" }} />
          <button className="icon-btn" onClick={() => openDrawer(null)} aria-label="Close menu"><Close /></button>
        </div>
        <nav className="mnav">
          {[...NAV.slice(0, 4), { href: "/shop?stage=baby", label: "Baby & Little Ones" }, NAV[5], { href: "/story", label: "Our Story" }].map((n) => (
            <Link key={n.label} href={n.href} onClick={() => openDrawer(null)}>{n.label}</Link>
          ))}
          <button onClick={() => openModal({ kind: "quiz" })}>Find Your Ritual →</button>
        </nav>
        <div className="mnav__foot">
          <p>Need help choosing?</p>
          <a className="btn btn--ghost btn--sm" href={whatsappUrl()} target="_blank" rel="noopener">Chat on WhatsApp</a>
        </div>
      </aside>
    </>
  );
}
