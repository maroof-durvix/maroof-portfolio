import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Layers,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { caseStudies } from "../data/portfolioData.js";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "../motion/Reveal.jsx";

export default function CaseStudies() {
  const [activeId, setActiveId] = useState(caseStudies[0].id);

  const activeStudy = caseStudies.find((c) => c.id === activeId) || caseStudies[0];

  return (
    <section id="case-studies" className="relative border-t border-white/10 py-24 sm:py-32 overflow-hidden bg-[#050505]">
      {/* Ambient background spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-blue/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="PROBLEM → SOLUTION → BUSINESS IMPACT"
          title="Engineered Case Studies"
          subtitle="Clients don't hire code — they hire outcomes. Here is how I diagnose critical operational bottlenecks, engineer scalable architectures, and deliver measurable business ROI."
        />

        {/* ================= Interactive Project Selector Tabs ================= */}
        <div className="mt-12 flex gap-2 overflow-x-auto pb-4 scrollbar-none sm:flex-wrap sm:justify-center">
          {caseStudies.map((study) => {
            const isActive = study.id === activeId;
            return (
              <button
                key={study.id}
                type="button"
                onClick={() => setActiveId(study.id)}
                className={`group relative shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "border-brand-orange bg-brand-orange text-ink shadow-[0_0_25px_rgba(255,122,26,0.35)]"
                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span>{study.title}</span>
                {study.badge && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                      isActive ? "bg-black/20 text-ink" : "bg-white/10 text-brand-orange"
                    }`}
                  >
                    {study.category.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= Active Case Study Canvas ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStudy.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 rounded-3xl border border-white/15 bg-[#080B12]/80 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            {/* Header: Title, Category & Live Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-bold text-brand-orange">
                    {activeStudy.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400">
                    {activeStudy.clientDomain}
                  </span>
                  {activeStudy.badge && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Award size={13} />
                      {activeStudy.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {activeStudy.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl font-medium leading-relaxed">
                  {activeStudy.tagline}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-2.5">
                {activeStudy.liveUrl && (
                  <a
                    href={activeStudy.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-orange px-5 py-2 text-xs font-bold text-ink shadow-[0_0_20px_rgba(255,122,26,0.3)] transition hover:brightness-110 active:scale-95"
                  >
                    <span>Visit Live Website</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}

                {activeStudy.apkUrl && (
                  <a
                    href={activeStudy.apkUrl}
                    download
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500 hover:text-ink active:scale-95"
                  >
                    <Download size={14} />
                    <span>Download APK</span>
                  </a>
                )}

                {activeStudy.githubUrl && (
                  <a
                    href={activeStudy.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold text-zinc-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95"
                  >
                    <Code2 size={14} />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>

            {/* ================= 3 Pillars: Problem ➔ Solution ➔ Result ================= */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 🔴 Pillar 1: Problem */}
              <div className="flex flex-col justify-between rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-transparent p-6 shadow-inner">
                <div>
                  <div className="flex items-center gap-2 text-red-400">
                    <div className="grid h-8 w-8 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-400/80">STEP 01</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">The Operational Bottleneck</h4>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    {activeStudy.problem}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-red-500/15 text-[11px] font-mono text-red-300/80">
                  Critical business impact before engineering intervention.
                </div>
              </div>

              {/* 🟡 Pillar 2: Solution */}
              <div className="flex flex-col justify-between rounded-2xl border border-brand-blue/30 bg-gradient-to-b from-brand-blue/[0.08] to-transparent p-6 shadow-inner">
                <div>
                  <div className="flex items-center gap-2 text-brand-blue">
                    <div className="grid h-8 w-8 place-items-center rounded-xl border border-brand-blue/30 bg-brand-blue/15 shadow-[0_0_12px_rgba(47,107,255,0.25)]">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue/80">STEP 02</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">Architectural Solution</h4>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    {activeStudy.solution}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-blue/15">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    Key Stack Employed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStudy.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🟢 Pillar 3: Result */}
              <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-transparent p-6 shadow-inner">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="grid h-8 w-8 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">STEP 03</span>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">Measurable Business ROI</h4>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    {activeStudy.result}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-500/15">
                  <div className="grid grid-cols-2 gap-2">
                    {activeStudy.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-2 text-center"
                      >
                        <span className="block text-xs font-black text-emerald-400 font-mono">
                          {m.value}
                        </span>
                        <span className="text-[9px] text-zinc-400 tracking-wider">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= High-Converting Conversion CTA Box ================= */}
        <Reveal>
          <div className="mt-16 rounded-3xl border border-brand-orange/40 bg-gradient-to-b from-[#140D07] via-[#0A0704] to-[#050505] p-8 sm:p-12 shadow-[0_20px_60px_rgba(255,122,26,0.12)]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange font-mono">
                  <Sparkles size={13} /> CLIENT-FIRST ARCHITECTURE
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Have a similar operational bottleneck in your business?
                </h3>
                <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-zinc-400 font-medium">
                  Clients don&apos;t just invest in what can be built —{" "}
                  <span className="text-white font-bold">they invest in how their core business problems get solved</span>.
                  Whether you need a high-concurrency web platform, an offline-first mobile app, or automated enterprise logistics,
                  let&apos;s engineer an architectural solution that accelerates your revenue and eliminates manual friction.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Direct WhatsApp CTA */}
                <a
                  href={`https://wa.me/message/BDYY4P52CJSXN1?text=${encodeURIComponent(
                    `Hi Maroof, I reviewed your case study for ${activeStudy.title} and have a project bottleneck I'd like to discuss.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-bold text-ink shadow-[0_0_25px_rgba(16,185,129,0.35)] transition hover:brightness-110 active:scale-95"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

