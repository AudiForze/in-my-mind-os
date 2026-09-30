import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import Reveal from "@/components/Reveal";
import ViewTracker from "@/components/ViewTracker";
import { getAllDocs, getAllFolders, getFolders, resolveObsidianImages, resolveWikilinks } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const f = getFolders();
  return [...getAllFolders().map((x) => ({ path: x.href.split("/").slice(2) })), ...f.flatMap((x) => x.docs.map((d) => ({ path: [d.project, ...d.slug] })) )];
}

export default async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const folders = getFolders();

  const folder = getAllFolders().find((f) => f.href === `/docs/${path.join("/")}`);
  if (folder) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-16 lg:py-24">
        <h1 className="font-signifier text-heading">{folder.label}</h1>
        {folder.children.length > 0 && <ul className="mt-8">
          {folder.children.map((child) => (
            <li key={child.href}>
              <Link href={child.href} className="group flex items-baseline gap-3 border-t border-[#ececec] py-4">
                <span className="text-body-lg font-[450] transition-transform group-hover:translate-x-1">{child.label}</span>
                <span className="ml-auto text-[14px] text-slate-gray">{child.docs.length} artículos</span>
              </Link>
            </li>
          ))}
        </ul>}
        <ul className={folder.children.length > 0 ? "mt-2" : "mt-8"}>
          {folder.directDocs.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="group flex items-baseline gap-3 border-t border-[#ececec] py-4">
                <span className="text-body-lg font-[450] transition-transform group-hover:translate-x-1">{d.title}</span>
                <span className="ml-auto truncate text-[14px] text-slate-gray">{d.excerpt.slice(0, 60)}…</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const docs = getAllDocs();
  const href = `/docs/${path.join("/")}`;
  const doc = docs.find((d) => d.href === href);
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 lg:py-24">
      <ViewTracker href={doc.href} />
      <Reveal y={16}>
        <Link href={`/docs/${doc.project}`} className="text-caption text-slate-gray hover:text-ink-black">← {doc.projectLabel}</Link>
        <h1 className="mt-4 font-signifier text-heading md:text-heading-lg">{doc.title}</h1>
        <div className="mt-4 flex flex-wrap gap-x-4 text-[14px] text-ash-gray">
          {doc.date && <span>{doc.date}</span>}
          {doc.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-10"><Markdown source={resolveWikilinks(resolveObsidianImages(doc.body), docs)} /></Reveal>
    </article>
  );
}
