"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type Item = { title: string; href: string; project: string; excerpt: string; text: string };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function SearchBox({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items
      .map((i) => {
        const title = norm(i.title), proj = norm(i.project), text = norm(i.text);
        let s = 0;
        for (const w of terms) {
          const hit = title.includes(w) ? 10 : proj.includes(w) ? 4 : text.includes(w) ? 1 : 0;
          if (!hit) return { i, s: 0 };
          s += hit;
        }
        return { i, s };
      })
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((r) => r.i);
  }, [q, items]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName ?? "");
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-[#ececec] bg-paper-white p-4 shadow-subtle transition focus-within:border-ink-black/30">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#a3a6af" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m14 14 3.5 3.5" /></svg>
        <input
          ref={ref}
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && results[sel]) router.push(results[sel].href);
          }}
          placeholder="Busca entre mis conocimientos"
          className="w-full bg-transparent text-[17px] outline-none placeholder:text-smoke-gray"
        />
        <kbd className="hidden rounded-md border border-[#ececec] px-1.5 text-[13px] text-ash-gray sm:block">/</kbd>
      </div>

      {q.trim() && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-paper-white p-2 shadow-subtle-2">
          {results.length === 0 && <p className="px-3 py-4 text-caption text-slate-gray">Sin resultados para “{q}”.</p>}
          {results.map((r, i) => (
            <Link
              key={r.href}
              href={r.href}
              onMouseEnter={() => setSel(i)}
              className={`block rounded-xl px-3 py-3 transition-colors ${i === sel ? "bg-fog-white" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-[480]">{r.title}</span>
                <span className="text-[14px] text-ash-gray">{r.project}</span>
              </div>
              <p className="mt-0.5 truncate text-[14px] text-slate-gray">{r.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
