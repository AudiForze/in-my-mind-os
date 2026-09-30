"use client";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Reveal from "./Reveal";
import { pillFilled, pillGhost } from "./ui";

export type Area = { slug: string; label: string; count: number; docs: { title: string; href: string }[] };
const EASE = [0.16, 1, 0.3, 1] as const;
const artifact = "rounded-[20px] bg-paper-white p-5 shadow-subtle-3";

/* ---------- pequeñas piezas ---------- */
const Cursor = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 22 22" fill="#17191c"><path d="M2 3 20 9l-7.5 3L9 20z" /></svg>
);
const Avatar = ({ t, tone, className }: { t: string; tone: string; className: string }) => (
  <motion.div className={`absolute ${className}`} animate={{ x: [0, 8, 0], y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
    <div className={`grid size-10 place-items-center rounded-full border border-ink-black/20 text-[15px] font-[500] ${tone}`}>{t}</div>
    <Cursor className="absolute -right-2 -top-3" />
  </motion.div>
);

function Float({ className, style, delay, dx = 0, dur = 6, children }: { className: string; style?: CSSProperties | Record<string, unknown>; delay: number; dx?: number; dur?: number; children: ReactNode }) {
  return (
    <motion.div style={style as CSSProperties} className={`absolute hidden lg:block ${className}`}>
      <motion.div initial={{ opacity: 0, x: dx, y: 50, scale: 0.94 }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: 1.1, delay, ease: EASE }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}>{children}</motion.div>
      </motion.div>
    </motion.div>
  );
}

const PHRASES = ["Busca entre mis conocimientos…", "Guías paso a paso…", "Papers de ciberseguridad…", "Automatización con Home Assistant…"];
function useTyped(words: string[]) {
  const [t, setT] = useState("");
  useEffect(() => {
    let w = 0, c = 0, del = false;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      c += del ? -1 : 1;
      setT(word.slice(0, c));
      let d = del ? 25 : 55;
      if (!del && c === word.length) { del = true; d = 1600; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 400; }
      id = setTimeout(tick, d);
    };
    id = setTimeout(tick, 1800);
    return () => clearTimeout(id);
  }, [words]);
  return t;
}

/* ---------- artefactos flotantes del hero ---------- */
function RegionCard({ areas, total }: { areas: Area[]; total: number }) {
  return (
    <div className={`${artifact} flex w-[316px] gap-4 text-[14px]`}>
      <div className="w-[84px]">
        <div className="text-[32px] font-[500] leading-none tracking-tight">{total}</div>
        <div className="mt-1 text-slate-gray">notas</div>
        <div className="mt-4 flex h-[90px] items-end gap-1.5">
          {[40, 70, 55, 90].map((h, i) => (
            <motion.div key={i} className="w-2 rounded-full bg-ink-black" initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: 1.5 + i * 0.1, duration: 0.8, ease: "easeOut" }} />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="mb-2 font-[500]">Área</div>
        {areas.slice(0, 5).map((a) => (
          <div key={a.slug} className="flex justify-between border-t border-[#ececec] py-1.5">
            <span className="truncate text-slate-gray">{a.label}</span><span>{a.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeachCard() {
  const r = 54;
  return (
    <div className="w-[295px] rounded-3xl bg-blush-peach p-5 text-sienna-brown">
      <div className="font-[500]">Papers</div>
      <div className="relative mx-auto mt-2 size-[120px]">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#5d2a1a" strokeOpacity=".15" strokeWidth="4" />
          <motion.circle cx="60" cy="60" r={r} fill="none" stroke="#5d2a1a" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 0.75 }} transition={{ delay: 1.6, duration: 1.6, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <div className="text-[30px] font-[500] leading-none">75%</div><div className="text-[12px] opacity-70">de la meta</div>
        </div>
      </div>
      <div className="mt-1 text-[20px] font-[500]">2.4k</div>
      <div className="text-[14px] opacity-80">↑ 5.5% vs semana pasada</div>
    </div>
  );
}

function ActivationCard() {
  return (
    <div className={`${artifact} w-[294px]`}>
      <div className="text-[14px] font-[500]">Guías</div>
      <div className="mt-2 flex items-end gap-3">
        <div>
          <div className="text-[26px] font-[500] leading-none tracking-tight">46.2%</div>
          <div className="mt-1 text-[13px] text-slate-gray">103% de la meta</div>
        </div>
        <svg viewBox="0 0 140 76" className="h-[76px] flex-1 overflow-visible" fill="none">
          <path d="M0 4H140M46 0V70M92 0V70M138 0V70" stroke="#ececec" />
          <motion.path d="M4 70 C22 70 26 44 46 42 S72 34 92 30 S122 8 134 6" stroke="#5d2a1a" strokeWidth="1.6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.6, duration: 1.8, ease: "easeInOut" }} />
          <circle cx="134" cy="6" r="3" fill="#5d2a1a" />
        </svg>
      </div>
      <div className="mt-2 flex justify-end gap-4 text-[12px] text-slate-gray">Ago <span>Sep</span> <span>Oct</span> <span className="rounded-full border border-ink-black px-1.5 text-ink-black">Nov</span></div>
    </div>
  );
}

function Composer() {
  const typed = useTyped(PHRASES);
  return (
    <Link href="/docs" className={`${artifact} block w-[400px] !rounded-2xl transition-transform duration-300 hover:scale-[1.02]`}>
      <div className="h-7 text-[16px] text-smoke-gray">{typed}<span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-ink-black align-middle" /></div>
      <div className="mt-5 flex items-center justify-between text-slate-gray">
        <span className="text-[16px]">@ &nbsp;◷</span>
        <span className="grid size-10 place-items-center rounded-full bg-ink-black text-paper-white">↑</span>
      </div>
    </Link>
  );
}

/* ---------- hero ---------- */
const Line = ({ delay, children }: { delay: number; children: ReactNode }) => (
  <span className="block overflow-hidden px-[0.1em] pb-[0.12em]">
    <motion.span className="block" initial={{ y: "110%", filter: "blur(8px)" }} animate={{ y: 0, filter: "blur(0px)" }} transition={{ duration: 1.1, delay, ease: EASE }}>{children}</motion.span>
  </span>
);

function Hero({ areas }: { areas: Area[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yL = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yR = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const yT = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const total = areas.reduce((n, a) => n + a.count, 0);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[760px] overflow-hidden lg:min-h-[900px]">
      <div className="hero-glow absolute -inset-[10%]" />

      <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-[22px] font-[500] tracking-tight">In my Mind</Link>
          <div className="hidden gap-10 md:flex">
            {["Proyectos", "Guías", "Preguntas", "Artículos"].map((l) => (
              <Link key={l} href="/docs" className="py-0.5 hover:underline hover:underline-offset-4">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="#contacto" className="hidden text-[16px] sm:block">Contacto</a>
            <Link href="/docs" className="inline-flex h-9 items-center rounded-full bg-ink-black px-4 text-[15px] text-paper-white">Entrar</Link>
          </div>
        </div>
      </motion.nav>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="absolute left-1/2 top-24 z-10 -translate-x-1/2">
        <Link href="/docs" className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#ececec] bg-paper-white/60 px-4 py-2 text-[15px] backdrop-blur transition hover:bg-paper-white">
          <span className="size-1.5 rounded-full bg-sienna-brown" /> Nuevo: notas escritas en Obsidian <span>→</span>
        </Link>
      </motion.div>

      <motion.div style={{ y: yT, opacity: fade }} className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-10 text-center">
        <h1 className="font-signifier text-heading md:text-heading-lg lg:text-display">
          <Line delay={0.3}>Bienvenido a</Line>
          <Line delay={0.45}>In my <em>Mind OS</em></Line>
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-4 max-w-[640px] text-body-lg text-ink-black/85">
          Papers científicos, artículos de investigación, guías paso a paso y experiencias desarrolladas por Physco.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.8 }} className="mt-8 flex items-center gap-3">
          <Link href="/docs" className={pillFilled}>Empezar</Link>
          <a href="#areas" className={pillGhost}>Investigar</a>
        </motion.div>
      </motion.div>

      <Float delay={0.8} dx={-80} className="-left-[2%] top-[21%]" style={{ y: yL }}><RegionCard areas={areas} total={total} /></Float>
      <Float delay={1} dx={80} dur={7} className="-right-[1%] top-[42%]" style={{ y: yR }}><PeachCard /></Float>
      <Float delay={1.2} dx={-60} dur={5.5} className="left-[11%] top-[71%]" style={{ y: yL }}>
        <ActivationCard /><Avatar t="JB" tone="bg-[#d5f0dc]" className="-left-12 top-[70%]" />
      </Float>
      <Float delay={1.4} dx={60} dur={6.5} className="left-[54%] top-[81%]" style={{ y: yR }}>
        <Composer /><Avatar t="AF" tone="bg-[#d6e6fb]" className="-bottom-5 left-[24%]" />
      </Float>
    </section>
  );
}

/* ---------- secciones al hacer scroll ---------- */
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="font-signifier text-heading md:text-heading-lg">{children}</h2>
);

function Features() {
  const items = [
    { tag: "Investigación", title: "Papers", body: "Trabajos con metodología, resultados y referencias, listos para leer o citar." },
    { tag: "Práctica", title: "Guías paso a paso", body: "Procedimientos reproducibles: desde la instalación hasta el resultado final." },
    { tag: "Experiencias", title: "Proyectos de Physco", body: "Lo que construyo y lo que aprendo en el camino, documentado con honestidad." },
  ];
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <Reveal className="max-w-[760px]">
        <H2>Todo lo que aprendo, <em>ordenado</em></H2>
        <p className="mt-4 text-body-lg text-slate-gray">Un solo lugar para consultar, buscar y volver a lo importante.</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.12}>
            <div className="h-full rounded-3xl bg-mist-gray px-5 py-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="text-[14px] text-ash-gray">{f.tag}</div>
              <h3 className="mt-3 text-[20px] font-[500]">{f.title}</h3>
              <p className="mt-2 leading-normal">{f.body}</p>
              <Link href="/docs" className="inline-block py-5 hover:underline">Explorar →</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AppPreview({ areas }: { areas: Area[] }) {
  const [open, setOpen] = useState<string | null>(areas[0]?.slug ?? null);
  const popular = areas.flatMap((a) => a.docs.map((d) => ({ ...d, area: a.label }))).slice(0, 4);
  return (
    <section id="explorar" className="mx-auto max-w-[1200px] px-6 py-20">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-[#ececec] bg-paper-white shadow-subtle-2">
          <div className="flex min-h-[520px]">
            <aside className="hidden w-[250px] shrink-0 border-r border-[#ececec] px-6 py-8 sm:block">
              <div className="mb-12 font-signifier text-[26px] leading-none">In My <em>Mind</em></div>
              {areas.map((a) => (
                <div key={a.slug}>
                  <button onClick={() => setOpen(open === a.slug ? null : a.slug)} className="flex w-full items-center gap-2 py-1.5 text-left text-[16px] font-[450]">
                    <motion.span animate={{ rotate: open === a.slug ? 90 : 0 }} className="text-[12px] text-slate-gray">▸</motion.span>
                    {a.label}
                  </button>
                  <AnimatePresence initial={false}>
                    {open === a.slug && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="ml-1.5 overflow-hidden border-l border-[#ececec] pl-3">
                        {a.docs.map((d) => (
                          <li key={d.href}><Link href={d.href} className="block py-1 text-[15px] text-slate-gray transition-colors hover:text-ink-black">{d.title}</Link></li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </aside>
            <div className="flex flex-1 items-center px-6 py-16 sm:px-14">
              <div className="mx-auto w-full max-w-[520px]">
                <Link href="/docs" className="flex items-center gap-3 rounded-2xl border border-[#ececec] p-4 shadow-subtle transition hover:border-ink-black/30">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#a3a6af" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="m14 14 3.5 3.5" /></svg>
                  <span className="text-[17px] text-smoke-gray">Busca entre mis conocimientos</span>
                </Link>
                <p className="mt-3 text-[14px] text-slate-gray">Papers desarrollados por Physco</p>
                <h3 className="mb-2 mt-14 text-[14px] text-ash-gray">Más visitados</h3>
                <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }}>
                  {popular.map((d) => (
                    <motion.li key={d.href} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                      <Link href={d.href} className="group flex items-baseline gap-3 border-t border-[#ececec] py-3 first:border-t-0">
                        <span className="font-[450] transition-transform group-hover:translate-x-1">{d.title}</span>
                        <span className="text-[14px] text-ash-gray">{d.area}</span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Areas({ areas }: { areas: Area[] }) {
  return (
    <section id="areas" className="mx-auto max-w-[1200px] scroll-mt-10 px-6 py-20">
      <Reveal><H2>Áreas de <em>investigación</em></H2></Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 3) * 0.1}>
            <Link href={a.docs[0]?.href ?? "/docs"} className="group block h-full rounded-3xl bg-mist-gray px-5 py-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="text-[14px] text-ash-gray">{a.count} {a.count === 1 ? "nota" : "notas"}</div>
              <h3 className="mt-3 text-heading-sm font-[450]">{a.label}</h3>
              <p className="mt-3 text-[15px] text-slate-gray">{a.docs.slice(0, 2).map((d) => d.title).join(" · ")}</p>
              <span className="mt-5 inline-block transition-transform duration-200 group-hover:translate-x-1">Abrir →</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-20">
      <Reveal>
        <div className="rounded-3xl bg-mist-gray px-6 py-24 text-center">
          <H2>Empieza a <em>explorar</em></H2>
          <p className="mx-auto mt-4 max-w-[480px] text-body-lg text-slate-gray">Busca un tema o abre una carpeta. Todo está a un clic.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/docs" className={pillFilled}>Empezar</Link>
            <a href="#areas" className={pillGhost}>Ver áreas</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Landing({ areas }: { areas: Area[] }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <MotionConfig reducedMotion="user">
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-ink-black" />
      <main>
        <Hero areas={areas} />
        <Features />
        <AppPreview areas={areas} />
        <Areas areas={areas} />
        <CTA />
      </main>
      <footer id="contacto" className="border-t border-[#ececec] py-10 text-center text-caption text-slate-gray">
        © {new Date().getFullYear()} Physco · In my Mind OS
      </footer>
    </MotionConfig>
  );
}
