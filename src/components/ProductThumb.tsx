import Image from "next/image";
import type { Product } from "@/lib/data";
import ProductArt from "./ProductArt";

/** Real product photo when available; otherwise the CSS bottle illustration. */
export default function ProductThumb({
  p,
  tone,
  alt,
  fill,
  sizes = "120px",
  className,
}: {
  p: Product;
  tone?: string;
  alt?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
}) {
  const img = p.images?.[0];
  if (img) {
    if (fill) {
      return (
        <span className={className} style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
          <Image src={img.src} alt={img.alt || p.name} fill sizes={sizes} style={{ objectFit: "contain" }} />
        </span>
      );
    }
    return (
      <Image
        className={className}
        src={img.src}
        alt={img.alt || p.name}
        width={480}
        height={480}
        sizes={sizes}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    );
  }
  return <ProductArt p={p} tone={tone} alt={alt} />;
}
