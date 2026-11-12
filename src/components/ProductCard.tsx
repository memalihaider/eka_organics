import Link from "next/link";
import { STAGES, type Product } from "@/lib/data";
import { inr, stars } from "@/lib/format";
import ProductArt from "./ProductArt";
import { AddToBag, QuickViewButton } from "./store/Buttons";

export function Rating({ p }: { p: Product }) {
  // Only shown once the product has genuine reviews
  if (!p.reviews) return null;
  return <div className="rating"><span className="stars">{stars(p.rating)}</span>{p.rating} ({p.reviews})</div>;
}

export default function ProductCard({ p }: { p: Product }) {
  const v = p.variants[0];
  return (
    <article className="card rv">
      <Link className="card__media" href={`/products/${p.id}`} aria-label={p.name}>
        <ProductArt p={p} />
        <div className="card__tags">
          {p.tags.includes("signature") && <span className="tag tag--sig">Signature</span>}
          {p.tags.includes("bestseller") && <span className="tag tag--dark">Bestseller</span>}
          {p.tags.includes("new") && <span className="tag">New</span>}
        </div>
      </Link>
      <div className="card__quick">
        <AddToBag id={p.id}>Add to bag · {inr(v.price)}</AddToBag>
        <QuickViewButton id={p.id} />
      </div>
      <div className="card__body">
        <span className="card__stage">{STAGES[p.stage].name}</span>
        <Link href={`/products/${p.id}`} className="card__name">{p.name}</Link>
        <p className="card__sub">{p.sub}</p>
        <div className="card__foot">
          <span className="price">{inr(v.price)}{p.variants.length > 1 && <small style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 6 }}>{v.size}</small>}</span>
          <Rating p={p} />
        </div>
        <AddToBag id={p.id} className="btn btn--ghost card__mobile-add">Add to bag</AddToBag>
      </div>
    </article>
  );
}
