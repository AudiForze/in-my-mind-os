"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type SideFolder = { slug: string; label: string; href: string; docs: { title: string; href: string }[]; children: SideFolder[] };

function Tree({ folders }: { folders: SideFolder[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const isOpen = (f: SideFolder) => open[f.href] ?? pathname.startsWith(f.href);

  const renderFolder = (f: SideFolder, depth = 0): React.ReactNode => (
    <div key={f.href} className="mb-1">
      <button onClick={() => setOpen((o) => ({ ...o, [f.href]: !isOpen(f) }))} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[16px] font-[450] transition-colors hover:bg-mist-gray" style={{ paddingLeft: `${12 + depth * 16}px` }}>
        <svg className={`transition-transform duration-200 ${isOpen(f) ? "rotate-90" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m4 2 4 4-4 4" /></svg>
        {f.label}
        <span className="ml-auto text-[13px] text-ash-gray">{f.docs.length}</span>
      </button>
      {isOpen(f) && (
          <div className="animate-in fade-in slide-in-from-top-1 ml-5 overflow-hidden border-l border-[#ececec] pl-2 duration-200">
            {f.children.map((child) => renderFolder(child, depth + 1))}
            {f.docs.map((d) => (
              <Link key={d.href} href={d.href} className={`block rounded-lg px-3 py-1.5 text-[15px] transition-colors hover:text-ink-black ${pathname === d.href ? "bg-mist-gray font-[500] text-ink-black" : "text-slate-gray"}`}>
                {d.title}
              </Link>
            ))}
          </div>
      )}
    </div>
  );

  return (
    <nav className="flex-1 overflow-y-auto px-4 pb-8">
      <Link href="/docs" className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] transition-colors hover:bg-mist-gray ${pathname === "/docs" ? "bg-mist-gray font-[500]" : "text-slate-gray"}`}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m14 14 3.5 3.5" /></svg>
        Buscar
      </Link>
      {folders.map((f) => renderFolder(f))}
    </nav>
  );
}

const Logo = () => (
  <Link href="/" className="font-signifier text-[26px] leading-none tracking-tight">In My <em>Mind</em></Link>
);

export default function Sidebar({ folders }: { folders: SideFolder[] }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  useEffect(() => setMobile(false), [pathname]);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-[#ececec] bg-paper-white lg:flex">
        <div className="px-7 pb-8 pt-8"><Logo /></div>
        <Tree folders={folders} />
      </aside>

      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#ececec] bg-paper-white/90 px-5 backdrop-blur lg:hidden">
        <Logo />
        <button aria-label="Menú" onClick={() => setMobile(true)} className="grid size-10 place-items-center rounded-full hover:bg-mist-gray">
          <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h14M3 14h14" /></svg>
        </button>
      </div>

      {mobile && (
        <>
            <div onClick={() => setMobile(false)} className="fixed inset-0 z-40 animate-in fade-in bg-ink-black/20 lg:hidden" />
            <aside className="fixed inset-y-0 left-0 z-50 flex w-[290px] animate-in slide-in-from-left flex-col bg-fog-white shadow-subtle-2 duration-200 lg:hidden">
              <div className="px-7 pb-6 pt-6"><Logo /></div>
              <Tree folders={folders} />
            </aside>
        </>
      )}
    </>
  );
}
