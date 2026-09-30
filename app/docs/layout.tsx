import Sidebar, { type SideFolder } from "@/components/Sidebar";
import { getFolders, type Folder } from "@/lib/content";

function toSideFolder(folder: Folder): SideFolder {
  return {
    slug: folder.slug,
    label: folder.label,
    href: folder.href,
    docs: folder.directDocs.map((d) => ({ title: d.title, href: d.href })),
    children: folder.children.map(toSideFolder),
  };
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const folders = getFolders().map(toSideFolder);
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar folders={folders} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
