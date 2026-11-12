import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (vb: string, props: P) => ({ viewBox: vb, "aria-hidden": true, ...props });

export const Leaf = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M8 32C8 16 18 8 33 7c0 16-9 25-25 25Z" /><path d="M8 32 24 16" /></svg>;
export const Shield = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M20 5 32 9v10c0 8-5 13-12 16C13 32 8 27 8 19V9Z" /><path d="m15 20 4 4 7-8" /></svg>;
export const Drop = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M20 5s10 11 10 19a10 10 0 0 1-20 0C10 16 20 5 20 5Z" /><path d="M15 25a5 5 0 0 0 5 5" /></svg>;
export const Heart = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M20 33S6 25 6 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 18-14 18Z" /></svg>;
export const Truck = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M4 11h20v16H4zM24 17h7l5 5v5H24" /><circle cx="11" cy="29" r="3" /><circle cx="30" cy="29" r="3" /></svg>;
export const Cash = (p: P) => <svg {...base("0 0 40 40", p)}><rect x="5" y="11" width="30" height="18" rx="2" /><circle cx="20" cy="20" r="4" /><path d="M9 15h2M29 25h2" /></svg>;
export const Return = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M10 16h18a7 7 0 0 1 0 14H14" /><path d="m15 11-5 5 5 5" /></svg>;
export const Lock = (p: P) => <svg {...base("0 0 24 24", p)}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
export const Gift = (p: P) => <svg {...base("0 0 32 32", p)}><rect x="5" y="12" width="22" height="16" /><path d="M3 8h26v4H3zM16 8v20M16 8c-2-5-8-5-7-1 1 2 7 1 7 1Zm0 0c2-5 8-5 7-1-1 2-7 1-7 1Z" /></svg>;
export const Tag = (p: P) => <svg {...base("0 0 24 24", p)}><path d="M3 12V4h8l10 10-8 8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>;
export const Eye = (p: P) => <svg {...base("0 0 24 24", p)}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const Arrow = (p: P) => <svg {...base("0 0 24 24", p)} width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.3}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Close = (p: P) => <svg {...base("0 0 24 24", p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Menu = (p: P) => <svg {...base("0 0 24 24", p)}><path d="M3 7h18M3 12h18M3 17h12" /></svg>;
export const Search = (p: P) => <svg {...base("0 0 24 24", p)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>;
export const Bag = (p: P) => <svg {...base("0 0 24 24", p)}><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>;
export const WhatsApp = (p: P) => <svg {...base("0 0 32 32", p)}><path d="M16 3a13 13 0 0 0-11.3 19.4L3 29l6.8-1.8A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-4 1 1.1-3.9-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.9 1 3.9.8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4Z" /></svg>;

export const List = (p: P) => <svg {...base("0 0 40 40", p)}><rect x="9" y="6" width="22" height="28" rx="2" /><path d="M14 14h12M14 20h12M14 26h7" /></svg>;
export const Moon = (p: P) => <svg {...base("0 0 40 40", p)}><path d="M27 27A12 12 0 0 1 15 8a12 12 0 1 0 12 19Z" /></svg>;

export const TRUST_ICONS = { leaf: Leaf, shield: Shield, drop: Drop, heart: Heart, list: List } as const;
