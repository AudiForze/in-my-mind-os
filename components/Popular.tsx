"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Item } from "./SearchBox";

export default function Popular({ items }: { items: Item[] }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    try { setCounts(JSON.parse(localStorage.getItem("imm:views") || "{}")); } catch {}
  }, []);
  const top = [...items].sort((a, b) => (counts[b.href] || 0) - (counts[a.href] || 0)).slice(0, 5);

  return (
    <div>
      <h2 className="mb-2 text-[14px] text-ash-gray">Más visitados</h2>
      <ul>
        {top.map((d, i) => (
          <motion.li
            key={d.href}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.5 }}
          >
            <Link href={d.href} className="group flex items-baseline gap-3 border-t border-[#ececec] py-3 first:border-t-0">
              <span className="text-[17px] font-[450] transition-transform duration-200 group-hover:translate-x-1">{d.title}</span>
              <span className="text-[14px] text-ash-gray">{d.project}</span>
              {counts[d.href] > 0 && <span className="ml-auto text-[14px] text-slate-gray">{counts[d.href]} visitas</span>}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
