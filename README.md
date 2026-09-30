# In my Mind OS

Next.js (App Router) + React + Tailwind v4 + `motion`. Tokens en `DESIGN.md` (copiados a `app/globals.css`).

```bash
npm install
npm run dev     # http://localhost:3000
```

## Contenido
`content/<proyecto>/<pagina>.md` → carpeta = proyecto (sidebar), `.md` = página en `/docs/<proyecto>/<pagina>`.
También puedes anidar carpetas para agrupar artículos relacionados. Por ejemplo, `content/ciberseguridad/SSRF/introduccion.md` se muestra en `/docs/ciberseguridad/ssrf` y el artículo queda en `/docs/ciberseguridad/ssrf/introduccion`.
Puedes copiar tus carpetas de Obsidian dentro de `content/`. Soporta: frontmatter (`title`, `date`, `tags`, `order`),
GFM (tablas, tareas), `[[wikilinks]]`, embeds `![[imagen.png]]`, `![[video.mp4]]`, `![[documento.pdf]]`, `![[diagrama.excalidraw]]` y `![[analisis.ipynb]]`, callouts `> [!note]` y bloques de código.
Coloca las imágenes, vídeos, PDFs, notebooks y archivos `.excalidraw` en `public/img/`; los embeds se sirven automáticamente desde `/img/`. Los PDFs se muestran con el visor del navegador, los diagramas Excalidraw se cargan en modo lectura con zoom, desplazamiento y pantalla completa, y los notebooks se muestran completos con celdas Markdown, código y salidas comunes.
Las páginas con nombres numerados se ordenan de forma natural: `1`, `2`, `3`, `10`.

## Fuentes
Signifier y Söhne son comerciales; se usan Source Serif 4 e Inter (sustitutos de DESIGN.md) en `app/layout.tsx`.
Si tienes licencia, cámbialas con `next/font/local` conservando las variables `--font-serif` y `--font-sans`.

## Vercel
Sube el repo a GitHub → Import en Vercel. Sin configuración extra (las páginas se generan estáticas en el build).
Los "más visitados" se guardan en `localStorage` (por navegador).
