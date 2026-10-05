import React, { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import ExcalidrawViewer from "@/components/ExcalidrawViewer";
import NotebookViewer from "@/components/NotebookViewer";

/** Callouts de Obsidian: > [!note] Título */
function Quote({ children }: { children?: ReactNode }) {
  const kids = React.Children.toArray(children);
  const idx = kids.findIndex(isValidElement);
  const first = kids[idx] as ReactElement<{ children?: ReactNode }> | undefined;
  const inner = first ? React.Children.toArray(first.props.children) : [];
  const head = inner[0];
  const m = typeof head === "string" ? head.match(/^\[!(\w+)\][+-]?[ \t]*([^\n]*)\n?/) : null;
  if (!m || !first) return <blockquote>{children}</blockquote>;
  const rest = (head as string).slice(m[0].length);
  return (
    <div className="callout" data-type={m[1].toLowerCase()}>
      <p className="callout-title">{m[2] || m[1]}</p>
      {(rest.trim() || inner.length > 1) && cloneElement(first, undefined, rest, ...inner.slice(1))}
      {kids.slice(idx + 1)}
    </div>
  );
}
function getVideoEmbed(href: string) {
  try {
    const url = new URL(href);
    if (!/^https?:$/.test(url.protocol)) return null;

    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return id ? { type: "iframe" as const, src: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (url.hostname === "youtube.com" || url.hostname === "www.youtube.com") {
      const id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)?.[1];
      return id ? { type: "iframe" as const, src: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") {
      const id = url.pathname.match(/\/(\d+)(?:$|\/)/)?.[1];
      return id ? { type: "iframe" as const, src: `https://player.vimeo.com/video/${id}` } : null;
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { type: "video" as const, src: url.toString() };
  } catch {
    return null;
  }

  return null;
}

function PdfEmbed({ href }: { href: string }) {
  return (
    <div className="pdf-embed-wrap">
      <iframe className="pdf-embed" src={href} title="Documento PDF" loading="lazy" />
      <a href={href} target="_blank" rel="noopener noreferrer">Abrir PDF en una pestaña nueva</a>
    </div>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  const hasBlockEmbed = React.Children.toArray(children).some(
    (child) => {
      if (!isValidElement(child)) return false;
      if (child.type === PdfEmbed || child.type === ExcalidrawViewer || child.type === NotebookViewer) return true;
      const link = child as ReactElement<{ href?: string }>;
      return child.type === A && /\.(pdf|excalidraw|ipynb)(?:$|[?#])/i.test(String(link.props.href ?? ""));
    },
  );
  return hasBlockEmbed ? <div>{children}</div> : <p>{children}</p>;
}

function A({ href = "", children }: { href?: string; children?: ReactNode }) {
  if (/\.pdf(?:$|[?#])/i.test(href)) return <PdfEmbed href={href} />;
  if (/\.excalidraw(?:$|[?#])/i.test(href)) return <ExcalidrawViewer src={href} />;
  if (/\.ipynb(?:$|[?#])/i.test(href)) return <NotebookViewer src={href} />;
  const embed = getVideoEmbed(href);
  if (embed?.type === "iframe") {
    return <iframe className="video-embed" src={embed.src} title="Video embebido" loading="lazy" allowFullScreen />;
  }
  if (embed?.type === "video") return <video controls preload="metadata" className="video-embed" src={embed.src} />;
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  if (href.startsWith("#")) return <a href={href}>{children}</a>;
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function Image({ alt = "", src = "" }: { alt?: string; src?: string }) {
  if (/\.(mp4|webm|ogg)(?:$|[?#])/i.test(src)) {
    return <video controls preload="metadata" className="max-w-full" aria-label={alt}><source src={src} /></video>;
  }
  return <img src={src} alt={alt} />;
}

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          p: Paragraph as never,
          blockquote: Quote as never,
          a: A as never,
          img: Image as never,
          table: (({ children }: { children?: ReactNode }) => (
            <div className="tbl"><table>{children}</table></div>
          )) as never,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
