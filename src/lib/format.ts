import type { Variant } from "./data";

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const pctOff = (v: Variant) => Math.round((1 - v.price / v.mrp) * 100);
export const stars = (r: number) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
