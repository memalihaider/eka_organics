import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, STAGES, isStage, type StageKey } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { TrustBar } from "@/components/Sections";
import SortSelect, { type SortKey } from "./SortSelect";

type Search = Promise<{ stage?: string; sort?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { stage } = await searchParams;
  return isStage(stage)
    ? { title: STAGES[stage].name, description: `${STAGES[stage].name} — ${STAGES[stage].line}. Ayurvedic, organic care from Eka Organics.` }
    : { title: "Shop All Rituals" };
}

export default async function Shop({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const stage = isStage(sp.stage) ? sp.stage : null;
  const sort = (["featured", "best", "low", "high"].includes(sp.sort ?? "") ? sp.sort : "featured") as SortKey;
  const s = stage ? STAGES[stage] : null;

  let list = PRODUCTS.filter((p) => !stage || p.stage === stage);
  if (sort === "low") list = [...list].sort((a, b) => a.variants[0].price - b.variants[0].price);
  if (sort === "high") list = [...list].sort((a, b) => b.variants[0].price - a.variants[0].price);
  if (sort === "best") list = [...list].sort((a, b) => +b.tags.includes("bestseller") - +a.tags.includes("bestseller"));

  const href = (k: StageKey | null) => {
    const q = new URLSearchParams();
    if (k) q.set("stage", k);
    if (sort !== "featured") q.set("sort", sort);
    const str = q.toString();
    return "/shop" + (str ? "?" + str : "");
  };

  return (
    <>
      <section className="page-hero"><div className="container">
        <div className="crumbs"><Link href="/">Home</Link> / {s ? <><Link href="/shop">Shop</Link> / {s.name}</> : "Shop"}</div>
        <p className="eyebrow">— {s ? s.line : "Ayurvedic care for mother & child"} —</p>
        <h1 className="h-lg">{s ? <em>{s.name}</em> : <>All <em>Rituals</em></>}</h1>
      </div></section>
      <div className="container">
        <div className="toolbar">
          <div className="pills">
            <Link className={`pill${!stage ? " on" : ""}`} href={href(null)} style={{ display: "inline-grid", placeItems: "center" }}>All</Link>
            {(Object.keys(STAGES) as StageKey[]).map((k) => (
              <Link key={k} className={`pill${stage === k ? " on" : ""}`} href={href(k)} style={{ display: "inline-grid", placeItems: "center" }}>{STAGES[k].name}</Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span className="count">{list.length} products</span>
            <SortSelect value={sort} />
          </div>
        </div>
        <div className="grid" style={{ paddingBottom: 100 }}>{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
      <TrustBar />
    </>
  );
}
