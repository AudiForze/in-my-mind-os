import Popular from "@/components/Popular";
import Reveal from "@/components/Reveal";
import SearchBox from "@/components/SearchBox";
import { getAllDocs } from "@/lib/content";

export default function DocsHome() {
  const items = getAllDocs().map((d) => ({ title: d.title, href: d.href, project: d.projectLabel, excerpt: d.excerpt, text: d.text }));
  return (
    <div className="mx-auto flex min-h-[calc(100svh-56px)] max-w-[720px] flex-col justify-center px-6 py-20 lg:min-h-screen">
      <Reveal>
        <SearchBox items={items} />
        <p className="mt-3 text-[14px] text-slate-gray">Papers desarrollados por Physco</p>
      </Reveal>
      <Reveal delay={0.15} className="mt-16"><Popular items={items} /></Reveal>
    </div>
  );
}
