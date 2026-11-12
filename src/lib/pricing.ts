import { CONFIG, PRODUCT_MAP } from "./data";

export interface CartLine { id: string; v: number; q: number }
export type PayMethod = "upi" | "card" | "nb" | "cod";

export interface Totals {
  sub: number;        // selling price total
  mrp: number;        // MRP total
  count: number;
  disc: number;       // coupon discount
  couponErr: string;
  after: number;      // sub - disc
  ship: number;
  cod: number;
  total: number;
  gift: boolean;      // free miniatures unlocked
}

export const MAX_QTY = 10;

/** Drops unknown products / variants and clamps quantities. */
export function sanitizeCart(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter((l): l is CartLine => !!l && typeof l === "object" && typeof (l as CartLine).id === "string")
    .filter((l) => PRODUCT_MAP[l.id] && Number.isInteger(l.v) && PRODUCT_MAP[l.id].variants[l.v])
    .map((l) => ({ id: l.id, v: l.v, q: Math.max(1, Math.min(MAX_QTY, Math.floor(Number(l.q) || 1))) }));
}

/** Single source of truth for pricing — runs in the browser and in /api/orders. */
export function computeTotals(cart: CartLine[], coupon: string | null, pay: PayMethod = "upi"): Totals {
  let sub = 0, mrp = 0, count = 0;
  for (const l of cart) {
    const v = PRODUCT_MAP[l.id]?.variants[l.v];
    if (!v) continue;
    sub += v.price * l.q; mrp += v.mrp * l.q; count += l.q;
  }
  let disc = 0, couponErr = "", freeShip = false;
  if (coupon) {
    const c = CONFIG.coupons[coupon];
    if (!c) couponErr = "This code isn't valid.";
    else if (c.min && sub < c.min) couponErr = `Add ₹${(c.min - sub).toLocaleString("en-IN")} more to use ${coupon}.`;
    else if (c.type === "freeship") freeShip = true;
    else disc = c.type === "pct" ? Math.round((sub * c.value) / 100) : c.value;
  }
  const after = sub - disc;
  const ship = count === 0 || freeShip || after >= CONFIG.freeShippingAt ? 0 : CONFIG.shippingFee;
  const cod = pay === "cod" && count > 0 ? CONFIG.codFee : 0;
  return { sub, mrp, count, disc, couponErr, after, ship, cod, total: after + ship + cod, gift: after >= CONFIG.giftAt };
}
