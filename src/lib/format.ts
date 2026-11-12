export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const stars = (r: number) => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
