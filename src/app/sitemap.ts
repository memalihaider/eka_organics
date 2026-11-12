import type { MetadataRoute } from "next";
import { PRODUCTS, STAGES } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, priority: 1 },
    { url: `${base}/shop`, priority: 0.9 },
    ...Object.keys(STAGES).map((k) => ({ url: `${base}/shop?stage=${k}`, priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/products/${p.id}`, priority: 0.8 })),
    { url: `${base}/story`, priority: 0.5 },
    { url: `${base}/faq`, priority: 0.5 },
  ];
}
