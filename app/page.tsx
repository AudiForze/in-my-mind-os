import Landing, { type Area } from "@/components/Landing";
import { getFolders } from "@/lib/content";

export default function Home() {
  const areas: Area[] = getFolders().map((f) => ({
    slug: f.slug, label: f.label, count: f.docs.length,
    docs: f.docs.map((d) => ({ title: d.title, href: d.href })),
  }));
  return <Landing areas={areas} />;
}
