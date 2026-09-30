---
title: React hooks
date: 2026-08-02
tags: [react]
order: 2
---
Los hooks permiten usar estado y efectos en componentes de función.

```tsx
const [n, setN] = useState(0);
useEffect(() => { document.title = `Clicks: ${n}`; }, [n]);
```

> [!warning] Ojo
> No llames hooks dentro de condicionales.
