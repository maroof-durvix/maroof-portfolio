import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink, Layers, Monitor, Play, Smartphone, Tablet, X } from "lucide-react";
import { projects, archiveProjects } from "../data/portfolioData.js";
import { duration, ease } from "../motion/config.js";
import { useLenis } from "../motion/SmoothScroll.jsx";
import Magnetic from "../motion/Magnetic.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { ProjectActions, ProjectCard } from "./ProjectCard.jsx";
import LivePreviewModal from "./LivePreviewModal.jsx";
import Marquee from "./Marquee.jsx";

const ACCENTS = [
  "radial-gradient(60% 60% at 75% 25%, rgba(255,122,26,.35), transparent 70%), radial-gradient(55% 55% at 20% 80%, rgba(47,107,255,.28), transparent 72%)",
  "radial-gradient(60% 60% at 25% 25%, rgba(47,107,255,.38), transparent 70%), radial-gradient(55% 55% at 80% 75%, rgba(255,122,26,.28), transparent 72%)",
  "radial-gradient(60% 60% at 70% 75%, rgba(255,122,26,.32), transparent 70%), radial-gradient(55% 55% at 25% 25%, rgba(47,107,255,.30), transparent 72%)",
  "radial-gradient(60% 60% at 30% 70%, rgba(47,107,255,.34), transparent 70%), radial-gradient(55% 55% at 75% 25%, rgba(255,122,26,.30), transparent 72%)",
  "radial-gradient(60% 60% at 50% 50%, rgba(255,122,26,.35), transparent 70%), radial-gradient(50% 50% at 85% 20%, rgba(52,211,153,.25), transparent 70%)",
];

const initialsOf = (title) =>
  title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState("all");
  const [previewProject, setPreviewProject] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const lenis = useLenis();
  const targetRef = useRef(null);
  const trackRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Top 5 flagship projects for the cinematic horizontal scroll showcase
  const featuredList = [
    projects[0], // Green Life
    projects[1], // JamesThew Culinary Academy
    projects[2], // Scooply Artisan Creamery
    projects[3], // ParcelPulse Logistics
    archiveProjects[0], // DURVIX Estates
  ].filter(Boolean);

  const allProjectsList = [...projects, ...archiveProjects];

  const filterTabs = [
    { id: "all", label: "All Projects", count: allProjectsList.length },
    { id: "fullstack", label: "Full-Stack Web", count: allProjectsList.filter((p) => p.filterGroup === "fullstack").length },
    { id: "enterprise", label: "Enterprise (.NET / PHP)", count: allProjectsList.filter((p) => p.filterGroup === "enterprise").length },
    { id: "mobile", label: "Mobile Apps (Flutter)", count: allProjectsList.filter((p) => p.filterGroup === "mobile").length },
    { id: "ai", label: "AI & Tools", count: allProjectsList.filter((p) => p.filterGroup === "ai").length },
  ];

  const filteredModalProjects =
    modalFilter === "all" ? allProjectsList : allProjectsList.filter((p) => p.filterGroup === modalFilter);

  // Measure exact horizontal scroll distance of all cards combined
  const [scrollDistance, setScrollDistance] = useState(() =>
    typeof window !== "undefined" ? Math.max(0, featuredList.length * 950 - window.innerWidth) : 3800
  );

  useEffect(() => {
    const calcDistance = () => {
      if (trackRef.current) {
        const total = trackRef.current.scrollWidth;
        const view = window.innerWidth;
        setScrollDistance(Math.max(0, total - view + 60));
      }
    };

    calcDistance();
    const t = setTimeout(calcDistance, 150);
    window.addEventListener("resize", calcDistance);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", calcDistance);
    };
  }, [featuredList.length]);

  // Pinned Horizontal Scroll progress linked to mouse wheel / touch scroll
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Slide track smoothly from 0 to -scrollDistance (pixel-perfect lockstep)
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  // Synchronize HUD active slide counter with visible card position
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = 1 / featuredList.length;
    const idx = Math.min(featuredList.length - 1, Math.max(0, Math.floor(latest / step)));
    setActiveSlide(idx);
  });

  // Jump to specific project slide when step indicator is clicked
  const goToSlide = (index) => {
    const target = targetRef.current;
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    const distance = target.offsetHeight - window.innerHeight;
    const targetY = top + distance * (index / (featuredList.length - 1));
    if (lenis) lenis.scrollTo(targetY, { duration: 1.1 });
    else window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Lock page scroll while archive modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isModalOpen, lenis]);

  // Modal keyboard handling
  useEffect(() => {
    if (!isModalOpen) return undefined;
    const trigger = triggerRef.current;
    const focusables = () =>
      dialogRef.current
        ? [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        : [];
    window.requestAnimationFrame(() => focusables()[0]?.focus());
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isModalOpen]);

  return (
    <section id="projects" className="relative pb-24 sm:pb-32">
      <Marquee />

      {/* ================= Section Header ================= */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mb-6 sm:mb-10">
        <SectionHeading kicker="Selected Productions" title="Featured Engineering Works" ghost="Work" />
      </div>

      {/* ================= Desktop / Laptop: Pinned Horizontal Scroll Reel ================= */}
      <div ref={targetRef} className="hidden md:block relative h-[520vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-16 sm:pt-20">
          {/* Reel HUD Header (Cleanly positioned with ample clearance below floating navbar) */}
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 mb-4 sm:mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-brand-orange font-mono">
                SYSTEM {String(activeSlide + 1).padStart(2, "0")} / {String(featuredList.length).padStart(2, "0")}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-zinc-400">
                — {featuredList[activeSlide]?.title}
              </span>
            </div>

            {/* Step Indicators Bar */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-2 font-mono">
                THE REEL
              </span>
              {featuredList.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className="group relative flex h-5 items-center px-0.5"
                  title={`Jump to ${p.title}`}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeSlide
                        ? "w-7 bg-brand-orange shadow-[0_0_12px_#FF7A1A]"
                        : "w-2.5 bg-white/20 group-hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Horizontally Moving Cards Track */}
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex w-max gap-8 lg:gap-12 pl-6 sm:pl-12 lg:pl-20 pr-16 lg:pr-24 items-center will-change-transform"
            >
              {featuredList.map((p, i) => (
                <article
                  key={p.title}
                  className="w-[84vw] max-w-5xl h-[62vh] min-h-[440px] max-h-[540px] shrink-0 rounded-3xl border border-white/10 bg-[#090D16]/95 p-6 sm:p-8 lg:p-9 shadow-2xl backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden transition-colors hover:border-brand-orange/40 hover:shadow-[0_0_35px_rgba(255,122,26,0.12)]"
                >
                  <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-center h-full">
                    {/* Left Column: Project Story & Specs */}
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
                            SYSTEM {String(i + 1).padStart(2, "0")} • {p.category}
                          </span>
                          {p.badge && (
                            <span className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-0.5 text-[11px] font-semibold text-brand-orange shadow-[0_0_12px_rgba(255,122,26,.15)]">
                              {p.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                          {p.title}
                        </h3>

                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-300 line-clamp-3 sm:line-clamp-4">
                          {p.description}
                        </p>

                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {p.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons: Live Preview + APK Download + View Code */}
                      <ProjectActions p={p} onOpenPreview={setPreviewProject} className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4" />
                    </div>

                    {/* Right Column: Architectural Visual Stage */}
                    <div
                      onClick={() => setPreviewProject(p)}
                      className="group/stage relative h-full min-h-[220px] rounded-2xl border border-white/10 bg-[#06080F] overflow-hidden shadow-2xl cursor-pointer transition-all hover:border-brand-orange/50 hover:shadow-[0_0_30px_rgba(255,122,26,0.2)]"
                    >
                      {/* Ambient light pool background */}
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover/stage:scale-105"
                        style={{ background: ACCENTS[i % ACCENTS.length] }}
                      />

                      {/* Translucent Architectural Ghost Watermark */}
                      <div className="absolute inset-0 grid place-items-center select-none pointer-events-none">
                        <span className="text-[clamp(5rem,14vw,10rem)] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)] transition-transform duration-700 group-hover/stage:scale-110">
                          {initialsOf(p.title)}
                        </span>
                      </div>

                      {/* Grid overlay */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]"
                      />

                      {/* Floating Tech Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                          BUILD: PRODUCTION READY
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                          <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
                        </div>
                      </div>

                      {/* Center Interactive Launch Pill */}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="flex items-center gap-2.5 rounded-full border border-brand-orange/50 bg-black/85 px-4 py-2.5 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-300 group-hover/stage:scale-105 group-hover/stage:border-brand-orange group-hover/stage:bg-brand-orange group-hover/stage:text-ink">
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-orange text-ink transition-transform group-hover/stage:scale-110 group-hover/stage:bg-black group-hover/stage:text-brand-orange">
                            <Play size={11} className="fill-current ml-0.5" />
                          </span>
                          <span className="text-xs font-black tracking-wider text-white group-hover/stage:text-ink">
                            LAUNCH LIVE SANDBOX
                          </span>
                          <ExternalLink size={12} className="text-zinc-400 group-hover/stage:text-ink" />
                        </div>
                      </div>

                      {/* Bottom Device Mockup Hints */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-zinc-400 font-mono pointer-events-none">
                        <div className="flex items-center gap-2">
                          <Monitor size={13} />
                          <Tablet size={13} />
                          <Smartphone size={13} />
                        </div>
                        <span>CLICK TO PREVIEW</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {/* Final Card in the Reel: Archive Gateway */}
              <article className="w-[84vw] max-w-md h-[62vh] min-h-[440px] max-h-[540px] shrink-0 rounded-3xl border border-brand-orange/40 bg-gradient-to-br from-[#12100E] to-[#0A0D16] p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between text-center">
                <div className="my-auto">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-brand-orange/50 bg-brand-orange/10 text-brand-orange shadow-[0_0_30px_rgba(255,122,26,0.3)]">
                    <Layers size={32} />
                  </div>
                  <span className="mt-5 inline-block text-xs font-mono font-bold uppercase tracking-widest text-brand-orange">
                    COMPLETE PORTFOLIO
                  </span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white">20+ Systems Engineered</h3>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                    Explore full-stack web platforms, enterprise .NET backends, offline-first Flutter mobile apps, and cloud APIs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-orange py-3.5 text-xs font-bold text-ink shadow-[0_4px_24px_rgba(255,122,26,.35)] transition hover:brightness-110 active:scale-95"
                >
                  <span>Open 20+ Systems Archive</span>
                  <ArrowUpRight size={15} />
                </button>
              </article>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= Mobile (< md): Touch Swipe Reel with Zero Tilt ================= */}
      <div className="md:hidden px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 custom-scrollbar">
          {featuredList.map((p) => (
            <div key={`mob-${p.title}`} className="w-[88vw] shrink-0 snap-center">
              <ProjectCard p={p} onOpenPreview={setPreviewProject} />
            </div>
          ))}
        </div>
      </div>

      {/* ================= Explore All Projects Global Trigger ================= */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-12 sm:mt-16 flex justify-center">
        <Magnetic>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.05] px-8 py-3.5 text-sm font-bold text-white shadow-xl backdrop-blur-md transition-all duration-base hover:scale-[1.03] hover:border-brand-orange hover:bg-brand-orange hover:text-ink hover:shadow-[0_0_30px_rgba(255,122,26,0.35)] active:scale-95"
          >
            <span>Explore All 20 Projects Archive</span>
            <ArrowUpRight size={16} />
          </button>
        </Magnetic>
      </div>

      {/* ================= Lightbox Modal for All 20 Projects ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: duration.base - 0.1, ease: ease.out }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl border border-white/15 bg-surface/95 p-5 shadow-2xl shadow-black/80 backdrop-blur-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-orange font-mono">
                    ARCHIVE &amp; EXTENDED WORKS
                  </p>
                  <h3 id="archive-modal-title" className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    All Engineering Projects ({filteredModalProjects.length})
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-400 sm:text-sm">
                    Filter by technology stack to explore full-stack web platforms, mobile APKs, and cloud backends.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close project archive"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-zinc-300 transition hover:border-brand-orange hover:bg-brand-orange hover:text-ink active:scale-95"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Filter Tabs Bar */}
              <div className="mt-5 flex flex-wrap gap-2 border-b border-white/10 pb-4">
                {filterTabs.map((tab) => {
                  const isActive = modalFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModalFilter(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-fast active:scale-95 ${
                        isActive
                          ? "bg-brand-orange text-ink shadow-[0_0_16px_rgba(255,122,26,.3)]"
                          : "border border-white/10 bg-white/[0.04] text-zinc-300 hover:border-brand-orange/40 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          isActive ? "bg-black/20 text-ink" : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Body: Scrollable Project Grid with ZERO TILT */}
              <div data-lenis-prevent className="mt-5 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredModalProjects.map((p) => (
                    <ProjectCard key={`modal-${p.title}`} p={p} onOpenPreview={setPreviewProject} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Live View & Architectural Profile Preview Modal */}
      <LivePreviewModal project={previewProject} onClose={() => setPreviewProject(null)} />
    </section>
  );
}
