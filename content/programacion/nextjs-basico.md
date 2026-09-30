---
title: Next.js desde cero
date: 2026-08-14
tags: [nextjs, react]
order: 1
---
Guía rápida para levantar un proyecto. Si ya conoces los hooks, salta a [[React hooks]].

> [!tip] Consejo
> Usa el **App Router**: los componentes son de servidor por defecto.

## Pasos

- [x] Instalar Node 20+
- [x] Crear el proyecto
- [ ] Desplegar en Vercel

```bash
npx create-next-app@latest mi-app
cd mi-app && npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm run build` | Build de producción |
