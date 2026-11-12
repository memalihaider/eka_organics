"use client";

import type { ReactNode } from "react";
import { useStore } from "./StoreProvider";
import { Eye } from "../Icons";

export function AddToBag({ id, v = 0, className = "btn", silent, children }: { id: string; v?: number; className?: string; silent?: boolean; children: ReactNode }) {
  const { add } = useStore();
  return <button type="button" className={className} onClick={() => add(id, v, 1, { open: !silent })}>{children}</button>;
}

export function QuickViewButton({ id }: { id: string }) {
  const { openModal } = useStore();
  return <button type="button" className="btn btn--ghost" aria-label="Quick view" onClick={() => openModal({ kind: "quickview", id })}><Eye /></button>;
}

export function QuizButton({ className, children }: { className?: string; children: ReactNode }) {
  const { openModal } = useStore();
  return <button type="button" className={className} onClick={() => openModal({ kind: "quiz" })}>{children}</button>;
}
