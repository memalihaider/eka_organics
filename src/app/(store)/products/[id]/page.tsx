import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONFIG, PAIRS, PRODUCTS, PRODUCT_MAP, STAGES, getProduct } from "@/lib/data";
import ProductCard, { Rating } from "@/components/ProductCard";
import Gallery from "./Gallery";
import BuyBox from "./BuyBox";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  return { title: p.name, description: `${p.name} — ${p.sub}. ${p.benefits[0]}. From ₹${p.variants[0].price}.` };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();

  const isSet = !!p.includes;
  const related = PRODUCTS.filter((x) => x.id !== id && (x.stage === p.stage || p.includes?.includes(x.id))).slice(0, 4);
  const pair = PAIRS[id] ? PRODUCT_MAP[PAIRS[id]] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.sub,
    brand: { "@type": "Brand", name: "Eka Organics" },
    offers: p.variants.map((v) => ({ "@type": "Offer", name: v.size, price: v.price, priceCurrency: "INR", availability: "https://schema.org/InStock" })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container">
        <div className="crumbs" style={{ paddingTop: 28 }}>
          <Link href="/">Home</Link> / <Link href={`/shop?stage=${p.stage}`}>{STAGES[p.stage].name}</Link> / {p.name}
        </div>
        <div className="pdp">
          <Gallery p={p} />
          <div className="info">
            <span className="card__stage">{STAGES[p.stage].name}{p.tags.includes("bestseller") && " · Bestseller"}</span>
            <h1>{p.name}</h1>
            <p className="sub">{p.sub}</p>
            <Rating p={p} />
            <div className="concerns">{p.concerns.map((c) => <span key={c}>{c}</span>)}</div>

            <BuyBox p={p} pair={pair} />

            <div className="acc" style={{ marginTop: 30 }}>
              <details open><summary>Why you&apos;ll love it</summary><div className="acc__body"><ul>{p.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div></details>
              {isSet && (
                <details open><summary>What&apos;s inside</summary><div className="acc__body"><ul>
                  {p.includes!.map((i) => <li key={i}><Link href={`/products/${i}`} style={{ textDecoration: "underline" }}>{PRODUCT_MAP[i].name}</Link> — {PRODUCT_MAP[i].variants[0].size}</li>)}
                </ul></div></details>
              )}
              {p.hero.length > 0 && (
                <details><summary>Key botanicals</summary><div className="acc__body"><ul>
                  {p.hero.map((h) => <li key={h.name}><b>{h.name}</b> ({h.origin}) — {h.note}</li>)}
                </ul></div></details>
              )}
              <details><summary>The ritual</summary><div className="acc__body">{p.ritual}</div></details>
              <details><summary>Full ingredients</summary><div className="acc__body">{p.inci}</div></details>
              <details><summary>Safety &amp; care</summary><div className="acc__body">{p.safety}</div></details>
              <details><summary>Shipping &amp; returns</summary><div className="acc__body">Dispatched within 24 hours from our studio. Metro cities 1–3 working days, rest of India 3–6. COD available on most PIN codes (₹{CONFIG.codFee} fee). Unopened products may be returned within 7 days.</div></details>
            </div>
          </div>
        </div>
      </div>
      <section className="section" style={{ background: "var(--ivory)" }}><div className="container">
        <div className="sec-head"><div><p className="eyebrow">— Complete your ritual —</p><h2 className="h-lg">You may also <em>love</em></h2></div></div>
        <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </div></section>
    </>
  );
}
