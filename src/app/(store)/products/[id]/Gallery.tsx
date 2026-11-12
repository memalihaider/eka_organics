"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/data";
import ProductArt from "@/components/ProductArt";

export default function Gallery({ p }: { p: Product }) {
  const tones = [p.art.tone, "#EADFD2", "#D9CBBE"];
  const [sel, setSel] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery__thumbs">
        {tones.map((t, i) => (
          <button key={i} className={sel === i ? "on" : ""} onClick={() => setSel(i)} aria-label={`Image ${i + 1}`}><ProductArt p={p} tone={t} alt={i === 1} /></button>
        ))}
        <button className={sel === 3 ? "on" : ""} onClick={() => setSel(3)} aria-label="Ingredients card" style={{ background: "var(--espresso)", display: "grid", placeItems: "center" }}>
          <Image src="/img/monogram.png" alt="" width={220} height={200} style={{ width: "60%" }} />
        </button>
      </div>
      <div className="gallery__main">
        {sel < 3 ? <ProductArt p={p} tone={tones[sel]} alt={sel === 1} /> : (
          <div className="gallery__info"><div>
            <Image src="/img/monogram.png" alt="" width={220} height={200} />
            <h4>{p.hero.length ? p.hero.slice(0, 3).map((h) => h.name).join(" · ") : "A curated ritual"}</h4>
            <p>{p.safety}</p>
          </div></div>
        )}
      </div>
    </div>
  );
}
