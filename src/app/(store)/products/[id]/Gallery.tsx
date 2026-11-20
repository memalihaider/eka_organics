"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import ProductArt from "@/components/ProductArt";

type Shot = { src: string; alt: string };

export default function Gallery({ p, activeVariant = 0 }: { p: Product; activeVariant?: number }) {
  const photoShots = useMemo<Shot[]>(() => {
    const list = [...(p.images ?? [])];
    const packImg = p.variants[activeVariant]?.image;
    if (packImg && !list.some((s) => s.src === packImg)) {
      list.unshift({ src: packImg, alt: `${p.name} — ${p.variants[activeVariant]?.name ?? "selected pack"}` });
    } else if (packImg) {
      const i = list.findIndex((s) => s.src === packImg);
      if (i > 0) {
        const [shot] = list.splice(i, 1);
        list.unshift(shot);
      }
    }
    return list;
  }, [p, activeVariant]);

  const artTones = [p.art.tone, "#EADFD2", "#D9CBBE"];
  const usePhotos = photoShots.length > 0;
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => { setSel(0); }, [activeVariant, p.id]);

  if (!usePhotos) {
    return (
      <div className="gallery">
        <div className="gallery__thumbs">
          {artTones.map((t, i) => (
            <button key={i} className={sel === i ? "on" : ""} onClick={() => setSel(i)} aria-label={`Image ${i + 1}`}>
              <ProductArt p={p} tone={t} alt={i === 1} />
            </button>
          ))}
          <button className={sel === 3 ? "on" : ""} onClick={() => setSel(3)} aria-label="Ingredients card" style={{ background: "var(--espresso)", display: "grid", placeItems: "center" }}>
            <Image src="/img/monogram.png" alt="" width={220} height={200} style={{ width: "60%" }} />
          </button>
        </div>
        <div className="gallery__main">
          {sel < 3 ? <ProductArt p={p} tone={artTones[sel]} alt={sel === 1} /> : (
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

  const shot = photoShots[Math.min(sel, photoShots.length - 1)];

  return (
    <div className="gallery gallery--photos">
      <div className="gallery__main gallery__main--photo">
        {shot ? (
          <button type="button" className="gallery__zoom-btn" onClick={() => setZoom(true)} aria-label="Zoom image">
            <Image src={shot.src} alt={shot.alt} width={1200} height={1200} sizes="(max-width: 900px) 100vw, 520px" priority style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </button>
        ) : (
          <div className="gallery__missing">Product photos coming soon</div>
        )}
      </div>
      <div className="gallery__thumbs gallery__thumbs--row">
        {photoShots.map((s, i) => (
          <button key={s.src} className={sel === i ? "on" : ""} onClick={() => setSel(i)} aria-label={s.alt}>
            <Image src={s.src} alt="" width={160} height={160} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
      {zoom && shot && (
        <div className="gallery__lightbox" role="dialog" aria-modal="true" aria-label="Zoomed product image" onClick={() => setZoom(false)}>
          <button type="button" className="gallery__lightbox-close" aria-label="Close zoom" onClick={() => setZoom(false)}>×</button>
          <Image src={shot.src} alt={shot.alt} width={1600} height={1600} sizes="100vw" style={{ maxWidth: "min(960px, 96vw)", maxHeight: "90vh", width: "auto", height: "auto", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
