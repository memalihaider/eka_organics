"use client";

import { useState, type ReactNode } from "react";
import { STAGES, type Product } from "@/lib/data";
import { Rating } from "@/components/ProductCard";
import Gallery from "./Gallery";
import BuyBox from "./BuyBox";

export default function ProductHero({ p, pair, children }: { p: Product; pair?: Product; children?: ReactNode }) {
  const [v, setV] = useState(0);
  return (
    <>
      <Gallery p={p} activeVariant={v} />
      <div className="info">
        <span className="card__stage">
          {STAGES[p.stage].name}
          {p.tags.includes("bestseller") && " · Bestseller"}
          {p.tags.includes("new") && " · New"}
        </span>
        <h1>{p.name}</h1>
        <p className="sub">{p.sub}</p>
        <Rating p={p} />
        <div className="concerns">{p.concerns.map((c) => <span key={c}>{c}</span>)}</div>
        <BuyBox p={p} pair={pair} variant={v} onVariantChange={setV} />
        {children}
      </div>
    </>
  );
}
