import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CONFIG, PAIRS, PRODUCTS, PRODUCT_MAP, STAGES, STORE_BRAND,
  catalogProducts, getProduct, productBrand,
} from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { FaqList } from "@/components/Sections";
import ProductHero from "./ProductHero";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  const title = p.seo?.title ?? p.name;
  const description = p.seo?.description ?? `${p.name} — ${p.sub}. ${p.benefits[0]}.`;
  const ogImage = p.images?.[0]?.src;
  return {
    title,
    description,
    keywords: p.seo?.keywords,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, alt: p.images![0].alt }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p || p.visible === false) notFound();

  const isSet = !!p.includes;
  const related = catalogProducts().filter((x) => x.id !== id && (x.stage === p.stage || p.includes?.includes(x.id))).slice(0, 4);
  const pair = PAIRS[id] ? PRODUCT_MAP[PAIRS[id]] : undefined;
  const brand = productBrand(p);
  const scoped = p.id === "nabhi-kund-oil" ? " pdp--nabhi-kund" : "";
  const hasRich = !!(p.overview || p.features || p.specs);

  const offers = p.variants
    .filter((v) => v.price > 0)
    .map((v) => ({
      "@type": "Offer",
      name: v.name ?? v.size,
      sku: v.sku,
      price: v.price,
      priceCurrency: "INR",
      availability: v.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `https://ekaorganics.in/products/${p.id}`,
      seller: { "@type": "Organization", name: STORE_BRAND },
    }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.seo?.description ?? p.sub,
      brand: { "@type": "Brand", name: brand },
      image: p.images?.map((i) => i.src),
      sku: p.variants[0]?.sku,
      ...(offers.length ? { offers } : {}),
      // Storefront merchant (distinct from product brand when brand is set)
      ...(p.brand ? { manufacturer: { "@type": "Organization", name: brand } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ekaorganics.in/" },
        { "@type": "ListItem", position: 2, name: STAGES[p.stage].name, item: `https://ekaorganics.in/shop?stage=${p.stage}` },
        { "@type": "ListItem", position: 3, name: p.name, item: `https://ekaorganics.in/products/${p.id}` },
      ],
    },
    ...(p.faq ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    }] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container">
        <div className="crumbs" style={{ paddingTop: 28 }}>
          <Link href="/">Home</Link> / <Link href={`/shop?stage=${p.stage}`}>{STAGES[p.stage].name}</Link> / {p.name}
        </div>
        <div className={`pdp${scoped}`}>
          <ProductHero p={p} pair={pair}>
            <div className="acc" style={{ marginTop: 30 }}>
              {!p.features && (
                <details open><summary>Why you&apos;ll love it</summary><div className="acc__body"><ul>
                  {p.highlights ? p.highlights.map((h) => <li key={h.title}><b>{h.title}</b> — {h.text}</li>) : p.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul></div></details>
              )}
              {isSet && (
                <details open><summary>What&apos;s inside</summary><div className="acc__body"><ul>
                  {p.includes!.map((i) => <li key={i}><Link href={`/products/${i}`} style={{ textDecoration: "underline" }}>{PRODUCT_MAP[i].name}</Link> — {PRODUCT_MAP[i].variants[0].size}</li>)}
                </ul></div></details>
              )}
              {p.hero.length > 0 && !p.ingredients && (
                <details><summary>Key botanicals</summary><div className="acc__body"><ul>
                  {p.hero.map((h) => <li key={h.name}><b>{h.name}</b> ({h.origin}) — {h.note}</li>)}
                </ul></div></details>
              )}
              {!hasRich && <details><summary>The ritual</summary><div className="acc__body">{p.ritual}</div></details>}
              <details><summary>Full ingredients</summary><div className="acc__body">{p.inci}</div></details>
              {!hasRich && <details><summary>Safety &amp; care</summary><div className="acc__body">{p.safety}</div></details>}
              {p.packaging && <details><summary>Packaging</summary><div className="acc__body">{p.packaging}</div></details>}
              <details><summary>Shipping &amp; returns</summary><div className="acc__body">Dispatched within 24 hours from our studio. Metro cities 1–3 working days, rest of India 3–6. COD available on most PIN codes (₹{CONFIG.codFee} fee). Unopened products may be returned within 7 days.</div></details>
            </div>
          </ProductHero>
        </div>
      </div>

      {p.overview && (
        <section className="section" style={{ paddingTop: 0 }}><div className="container narrow-prose">
          <p className="eyebrow">— Overview —</p>
          <h2 className="h-lg" style={{ marginTop: 12 }}>About this <em>oil</em></h2>
          <p className="lead" style={{ marginTop: 16 }}>{p.overview}</p>
        </div></section>
      )}

      {p.features && (
        <section className="section" style={{ paddingTop: 0 }}><div className="container">
          <div className="sec-head"><div><p className="eyebrow">— Key features —</p><h2 className="h-lg">Why customers <em>choose it</em></h2></div></div>
          <ul className="feature-list">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </div></section>
      )}

      {p.ingredients && (
        <section className="section" style={{ paddingTop: 0 }}><div className="container">
          <div className="sec-head"><div><p className="eyebrow">— Ingredients —</p><h2 className="h-lg">What&apos;s inside, <em>and why</em></h2></div></div>
          {p.id === "nabhi-kund-oil" && (
            <p className="lead" style={{ maxWidth: 640, marginBottom: 24 }}>
              Seven oils identified on the manufacturer brochure. The blend is marketed as 19 natural ingredients;
              the remaining names will appear here once the manufacturer supplies a verified complete list.
            </p>
          )}
          <div className="ing-table" role="table" aria-label={`${p.name} ingredients`}>
            <div className="ing-row ing-row--head" role="row"><span role="columnheader">Ingredient</span><span role="columnheader">INCI name</span><span role="columnheader">Its role</span></div>
            {p.ingredients.map((i) => (
              <div className="ing-row" role="row" key={i.inci}><b role="cell">{i.name}</b><span role="cell">{i.inci}</span><span role="cell">{i.role}</span></div>
            ))}
          </div>
          {!!p.ingredientsPending?.length && (
            <ul className="pending-ings">{p.ingredientsPending.map((n) => <li key={n}>{n}</li>)}</ul>
          )}
        </div></section>
      )}

      {hasRich && (
        <section className="section" style={{ paddingTop: 0 }}><div className="container">
          <div className="pdp-panels">
            <div>
              <p className="eyebrow">— How to use —</p>
              <h2 className="h-md" style={{ marginTop: 10 }}>Application</h2>
              <p style={{ marginTop: 12, lineHeight: 1.65 }}>{p.ritual}</p>
              <p className="safety-note" style={{ marginTop: 16 }}>{p.safety}</p>
            </div>
            {p.specs && (
              <div>
                <p className="eyebrow">— Product details —</p>
                <h2 className="h-md" style={{ marginTop: 10 }}>Specifications</h2>
                <dl className="spec-list">
                  {p.specs.map((s) => (
                    <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div></section>
      )}

      {p.faq && (
        <section className="section" style={{ paddingTop: 0 }}><div className="container faq-wrap">
          <div><p className="eyebrow">— Questions, answered —</p><h2 className="h-lg" style={{ marginTop: 12 }}>About <em>{p.name}</em></h2></div>
          <div className="acc"><FaqList items={p.faq} /></div>
        </div></section>
      )}
      {related.length > 0 && (
        <section className="section" style={{ background: "var(--ivory)" }}><div className="container">
          <div className="sec-head"><div><p className="eyebrow">— Complete your ritual —</p><h2 className="h-lg">You may also <em>love</em></h2></div></div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </div></section>
      )}
    </>
  );
}
