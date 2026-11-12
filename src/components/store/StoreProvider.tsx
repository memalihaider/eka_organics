"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PRODUCT_MAP } from "@/lib/data";
import { computeTotals, MAX_QTY, sanitizeCart, type CartLine, type PayMethod, type Totals } from "@/lib/pricing";

export type ModalState = { kind: "quiz" } | { kind: "quickview"; id: string } | { kind: "welcome" } | null;
type Drawer = "cart" | "menu" | null;
type Toast = { id: number; msg: string; action?: { label: string; fn: () => void } } | null;

interface Store {
  ready: boolean;
  cart: CartLine[];
  coupon: string | null;
  totals: (pay?: PayMethod) => Totals;
  add: (id: string, v?: number, q?: number, opts?: { open?: boolean }) => void;
  setQty: (index: number, q: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
  drawer: Drawer;
  openDrawer: (d: Drawer) => void;
  modal: ModalState;
  openModal: (m: ModalState) => void;
  toast: Toast;
  showToast: (msg: string, action?: { label: string; fn: () => void }) => void;
  bump: number; // increments when the bag badge should animate
}

const Ctx = createContext<Store | null>(null);

export const storage = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem("eka_" + k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem("eka_" + k, JSON.stringify(v)); } catch { /* private mode */ } },
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [bump, setBump] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setCart(sanitizeCart(storage.get("cart", [])));
    setCoupon(storage.get<string | null>("coupon", null));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { storage.set("cart", cart); storage.set("coupon", coupon); } }, [cart, coupon, ready]);

  // Lock page scroll behind drawers / modals; close on Escape
  useEffect(() => {
    document.body.style.overflow = drawer || modal ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrawer(null); setModal(null); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [drawer, modal]);

  const showToast = useCallback((msg: string, action?: { label: string; fn: () => void }) => {
    setToast({ id: Date.now(), msg, action });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const add = useCallback((id: string, v = 0, q = 1, opts: { open?: boolean } = {}) => {
    if (!PRODUCT_MAP[id]?.variants[v]) return;
    setCart((c) => {
      const i = c.findIndex((l) => l.id === id && l.v === v);
      if (i === -1) return [...c, { id, v, q: Math.min(MAX_QTY, q) }];
      const next = [...c]; next[i] = { ...next[i], q: Math.min(MAX_QTY, next[i].q + q) }; return next;
    });
    setBump((b) => b + 1);
    if (opts.open === false) showToast(`${PRODUCT_MAP[id].name} added to your bag`, { label: "View bag", fn: () => setDrawer("cart") });
    else { setModal(null); setDrawer("cart"); }
  }, [showToast]);

  const value = useMemo<Store>(() => ({
    ready, cart, coupon, drawer, modal, toast, bump,
    totals: (pay) => computeTotals(cart, coupon, pay),
    add,
    setQty: (i, q) => setCart((c) => (q <= 0 ? c.filter((_, j) => j !== i) : c.map((l, j) => (j === i ? { ...l, q: Math.min(MAX_QTY, q) } : l)))),
    remove: (i) => setCart((c) => c.filter((_, j) => j !== i)),
    clear: () => { setCart([]); setCoupon(null); },
    applyCoupon: (code) => setCoupon(code ? code.trim().toUpperCase() : null),
    openDrawer: setDrawer,
    openModal: (m) => { setDrawer(null); setModal(m); },
    showToast,
  }), [ready, cart, coupon, drawer, modal, toast, bump, add, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
}
