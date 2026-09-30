"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRef } from "react";
import type { ExcalidrawInitialDataState, ExcalidrawProps } from "@excalidraw/excalidraw/types";

const Excalidraw = dynamic<ExcalidrawProps>(
  () => import("@excalidraw/excalidraw").then(({ Excalidraw: Component }) => Component),
  { ssr: false },
);

export default function ExcalidrawViewer({ src }: { src: string }) {
  const [data, setData] = useState<ExcalidrawInitialDataState | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el diagrama");
        return response.json() as Promise<ExcalidrawInitialDataState>;
      })
      .then((json) => { if (active) setData(json); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [src]);

  if (error) return <div className="embed-error">No se pudo cargar el diagrama de Excalidraw.</div>;
  if (!data) return <div className="excalidraw-embed" aria-busy="true">Cargando diagrama...</div>;

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="excalidraw-embed">
      <button type="button" className="excalidraw-fullscreen" onClick={toggleFullscreen} aria-label="Alternar pantalla completa">
        Pantalla completa
      </button>
      <Excalidraw initialData={data} viewModeEnabled zenModeEnabled />
    </div>
  );
}