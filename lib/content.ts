import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");
const BASE_PATH = process.env.GITHUB_ACTIONS === "true" ? "/in-my-mind-os" : "";

export type Doc = {
  project: string; projectLabel: string; slug: string[]; href: string;
  title: string; excerpt: string; text: string; body: string;
  tags: string[]; date?: string; order: number;
};
export type Folder = {
  slug: string;
  label: string;
  href: string;
  docs: Doc[];
  directDocs: Doc[];
  children: Folder[];
};

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pretty = (s: string) => {
  const t = s.replace(/[-_]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function mdFiles(dir: string, rel: string[] = []): string[][] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? e.name.startsWith(".") ? [] : mdFiles(path.join(dir, e.name), [...rel, e.name])
      : e.name.toLowerCase().endsWith(".md") ? [[...rel, e.name]] : []
  );
}

function readDocs(dir: string, project: string, projectLabel: string, folderSlug: string[], files: string[]): Doc[] {
  return files.map((file): Doc => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const base = file.replace(/\.md$/i, "");
    const slug = [...folderSlug, base].map(slugify);
    const plain = content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*`|\[\]!_~-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return {
      project, projectLabel, slug,
      href: `/docs/${[project, ...slug].join("/")}`,
      title: data.title ?? pretty(base),
      excerpt: plain.slice(0, 150), text: plain.slice(0, 1500), body: content,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      date: data.date ? new Date(data.date).toISOString().slice(0, 10) : undefined,
      order: typeof data.order === "number" ? data.order : 999,
    };
  });
}

function readFolder(dir: string, project: string, projectLabel: string, relative: string[] = []): Folder {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const directDocs = readDocs(
    dir,
    project,
    projectLabel,
    relative,
    entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md")).map((e) => e.name),
  );
  directDocs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" }));
  const children = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => readFolder(path.join(dir, e.name), project, projectLabel, [...relative, e.name]))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" }));
  return {
    slug: relative.length ? slugify(relative[relative.length - 1]) : project,
    label: pretty(relative.length ? relative[relative.length - 1] : projectLabel),
    href: `/docs/${[project, ...relative.map(slugify)].join("/")}`,
    docs: [...directDocs, ...children.flatMap((child) => child.docs)],
    directDocs,
    children,
  };
}

/** Cada carpeta dentro de /content es un proyecto y puede contener subcarpetas. */
export function getFolders(): Folder[] {
  if (!fs.existsSync(ROOT)) return [];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort()
    .map((name) => readFolder(path.join(ROOT, name), slugify(name), name));
}

export const getAllDocs = () => getFolders().flatMap((f) => f.docs);

export function getAllFolders() {
  return getFolders().flatMap((folder) => [folder, ...getNestedFolders(folder.children)]);
}

function getNestedFolders(folders: Folder[]): Folder[] {
  return folders.flatMap((folder) => [folder, ...getNestedFolders(folder.children)]);
}

/** Embeds de Obsidian -> Markdown servido desde /public/img. */
export function resolveObsidianImages(body: string) {
  return body.replace(/!\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_, target: string, alias?: string) => {
    const cleanTarget = target.trim();
    const assetPath = cleanTarget.split("/").map(encodeURIComponent).join("/");
    const label = (alias ?? cleanTarget.split("/").pop() ?? cleanTarget).trim();
    const href = `${BASE_PATH}/img/${assetPath}`;
    if (/\.(pdf|excalidraw|ipynb)$/i.test(cleanTarget)) return `[${label}](${href})`;
    return `![${label}](${href})`;
  });
}

/** [[Página]] y [[Página|alias]] de Obsidian -> links de markdown. */
export function resolveWikilinks(body: string, docs: Doc[]) {
  const norm = (s: string) => slugify(s);
  return body.replace(/(?<!!)\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, target: string, alias?: string) => {
    const t = norm(target.trim());
    const hit = docs.find((d) => norm(d.title) === t || d.slug[d.slug.length - 1] === t);
    const label = (alias ?? target).trim();
    return hit ? `[${label}](${hit.href})` : label;
  });
}
