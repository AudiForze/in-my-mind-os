"use client";
import { useEffect } from "react";

/** Cuenta visitas en localStorage (por navegador) para la lista de "más visitados". */
export default function ViewTracker({ href }: { href: string }) {
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("imm:views") || "{}");
      v[href] = (v[href] || 0) + 1;
      localStorage.setItem("imm:views", JSON.stringify(v));
    } catch {}
  }, [href]);
  return null;
}
