"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

type NotebookOutput = {
  output_type?: string;
  text?: string | string[];
  data?: Record<string, string | string[]>;
};

type NotebookCell = {
  cell_type?: "markdown" | "code" | "raw" | string;
  source?: string | string[];
  execution_count?: number | null;
  outputs?: NotebookOutput[];
};

type Notebook = { cells?: NotebookCell[] };

const asText = (value: string | string[] | undefined) => Array.isArray(value) ? value.join("") : value ?? "";

function Output({ output }: { output: NotebookOutput }) {
  const image = output.data?.["image/png"];
  if (image) {
    const source = Array.isArray(image) ? image.join("") : image;
    return <img className="notebook-output-image" src={`data:image/png;base64,${source}`} alt="Salida del notebook" />;
  }
  const text = asText(output.text ?? output.data?.["text/plain"]);
  return text ? <pre className="notebook-output"><code>{text}</code></pre> : null;
}

export default function NotebookViewer({ src }: { src: string }) {
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el notebook");
        return response.json() as Promise<Notebook>;
      })
      .then((json) => { if (active) setNotebook(json); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [src]);

  if (error) return <div className="embed-error">No se pudo cargar el notebook.</div>;
  if (!notebook) return <div className="notebook-embed" aria-busy="true">Cargando notebook...</div>;

  return (
    <div className="notebook-embed">
      {(notebook.cells ?? []).map((cell, index) => {
        const source = asText(cell.source);
        if (cell.cell_type === "markdown") {
          return <div className="notebook-markdown" key={index}><ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown></div>;
        }
        return (
          <section className="notebook-cell" key={index}>
            <pre className="notebook-code"><code>{source}</code></pre>
            {cell.outputs?.map((output, outputIndex) => <Output key={outputIndex} output={output} />)}
          </section>
        );
      })}
    </div>
  );
}