import Link from "next/link";
import { STAGES, isPurchasable, productBrand, type Product } from "@/lib/data";
import { inr, stars } from "@/lib/format";
import ProductThumb from "./ProductThumb";
import { AddToBag, QuickViewButton } from "./store/Buttons";

export function Rating({ p }: { p: Product }) {
  // Only shown once the product has genuine reviews
  if (!p.reviews) return null;
  return <div className="rating"><span className="stars">{stars(p.rating)}</span>{p.rating} ({p.reviews})</div>;
}

export default function ProductCard({ p }: { p: Product }) {
  const v = p.variants[0];
  const canBuy = isPurchasable(v);
  return (
    <article className="card rv">
      <Link className="card__media" href={`/products/${p.id}`} aria-label={p.name}>
        <ProductThumb p={p} sizes="(max-width: 700px) 50vw, 280px" />
        <div className="card__tags">
          {p.tags.includes("signature") && <span className="tag tag--sig">Signature</span>}
          {p.tags.includes("bestseller") && <span className="tag tag--dark">Bestseller</span>}
          {p.tags.includes("new") && <span className="tag">New</span>}
        </div>
      </Link>
      <div className="card__quick">
        {canBuy ? <AddToBag id={p.id}>Add to bag · {inr(v.price)}</AddToBag> : <Link className="btn" href={`/products/${p.id}`}>View details</Link>}
        <QuickViewButton id={p.id} />
      </div>
      <div className="card__body">
        <span className="card__stage">{STAGES[p.stage].name}{p.brand ? ` · ${productBrand(p)}` : ""}</span>
        <Link href={`/products/${p.id}`} className="card__name">{p.name}</Link>
        <p className="card__sub">{p.sub}</p>
        <div className="card__foot">
          <span className="price">
            {v.price > 0 ? inr(v.price) : "Price soon"}
            {p.variants.length > 1 && <small style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 6 }}>{v.name ?? v.size}</small>}
          </span>
          <Rating p={p} />
        </div>
        {canBuy
          ? <AddToBag id={p.id} className="btn btn--ghost card__mobile-add">Add to bag</AddToBag>
          : <Link className="btn btn--ghost card__mobile-add" href={`/products/${p.id}`}>View details</Link>}
      </div>
    </article>
  );
}
