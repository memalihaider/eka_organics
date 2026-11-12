"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SortKey = "featured" | "best" | "low" | "high";

export default function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <select
      className="select"
      aria-label="Sort"
      value={value}
      onChange={(e) => {
        const q = new URLSearchParams(params.toString());
        if (e.target.value === "featured") q.delete("sort"); else q.set("sort", e.target.value);
        router.push(`${pathname}${q.size ? "?" + q.toString() : ""}`, { scroll: false });
      }}
    >
      <option value="featured">Featured</option>
      <option value="best">Bestsellers</option>
      <option value="low">Price: low to high</option>
      <option value="high">Price: high to low</option>
    </select>
  );
}
