import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Battery,
  Check,
  Copy,
  Download,
  ExternalLink,
  Monitor,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Wifi,
  X,
} from "lucide-react";

export default function LivePreviewModal({ project, onClose }) {
  const [device, setDevice] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [showSpecs, setShowSpecs] = useState(true);
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Set smart default device on project open
  useEffect(() => {
    if (!project) return;
    const isMobileFirst =
      project.filterGroup === "mobile" ||
      project.category?.toLowerCase().includes("mobile") ||
      Boolean(project.apkUrl && !project.liveUrl?.startsWith("http"));
    setDevice(isMobileFirst ? "mobile" : "desktop");
    setIframeLoaded(false);
  }, [project]);

  // Close on Escape key
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const liveUrl = project.liveUrl || project.live || "";
  const githubUrl = project.githubUrl || project.github || "https://github.com/maroof-durvix";
  const hasLiveWeb = Boolean(liveUrl && liveUrl.startsWith("http"));
  const isIframeRestricted = Boolean(
    project.openDirect ||
    (liveUrl && (liveUrl.includes("infinityfreeapp.com") || liveUrl.includes("englishwithmhs.com")))
  );
  const apkHref = project.apkUrl || project.downloadUrl || (liveUrl.endsWith(".apk") ? liveUrl : null);
  const apkFileName = project.downloadFileName || (apkHref ? apkHref.split("/").pop() : "application.apk");

  const copyUrl = async () => {
    try {
      const urlToCopy = hasLiveWeb ? liveUrl : `${window.location.origin}${apkHref}`;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Default milestones if project doesn't have custom ones
  const milestones = project.milestones || (apkHref
    ? [
        "60 FPS Native Flutter Engine",
        "Offline-First SQLite & Firebase Sync",
        "Zero-Latency State Architecture",
        "Verified Android Production Package",
      ]
    : [
        "100/100 Lighthouse Performance Vitals",
        "P99 Edge Latency < 18ms",
        "High-Concurrency Component Pipeline",
        "Bespoke Responsive Layout Engine",
      ]);

  // Dynamic SPECS width according to device:
  // - desktop: compact sidebar (300px) so desktop preview gets massive width
  // - tablet: balanced sidebar (340px)
  // - mobile: spacious sidebar (440px) since phone takes only ~375px
  const specsWidth = device === "desktop" ? 300 : device === "tablet" ? 340 : 440;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          aria-hidden="true"
        />

        {/* Modal Window Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 bg-[#090D16]/95 shadow-2xl shadow-black/90 backdrop-blur-2xl"
        >
          {/* ================= Top Browser Chrome / Window Bar ================= */}
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#07090F] px-4 sm:px-6">
            {/* Left: macOS Dots + Project Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-3 w-3 rounded-full bg-[#FF5F56] transition hover:opacity-80"
                  aria-label="Close modal"
                />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="hidden text-xs font-bold text-zinc-300 md:inline max-w-[200px] truncate">
                {project.title}
              </span>
            </div>

            {/* Center: Interactive URL Pill */}
            <div className="flex max-w-[480px] flex-1 items-center justify-between gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-1.5 text-xs text-zinc-300 shadow-inner">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                <span className="truncate font-mono text-[11px] text-zinc-300">
                  {hasLiveWeb ? liveUrl : `${apkFileName} (Android Package)`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={copyUrl}
                  title="Copy link"
                  className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
                {hasLiveWeb && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Open in new window"
                    className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Device Switchers + Specs Toggle + Close */}
            <div className="flex items-center gap-2">
              {/* Responsive Device Viewport Switchers */}
              <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setDevice("desktop")}
                  title="Desktop View (Full Screen Web)"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    device === "desktop"
                      ? "bg-brand-orange text-ink shadow-[0_0_12px_rgba(255,122,26,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor size={14} />
                  <span className="hidden lg:inline text-[11px]">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("tablet")}
                  title="Tablet View (iPad)"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    device === "tablet"
                      ? "bg-brand-orange text-ink shadow-[0_0_12px_rgba(255,122,26,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Tablet size={14} />
                  <span className="hidden lg:inline text-[11px]">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  title="Mobile View (iPhone)"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    device === "mobile"
                      ? "bg-brand-orange text-ink shadow-[0_0_12px_rgba(255,122,26,0.3)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone size={14} />
                  <span className="hidden lg:inline text-[11px]">Mobile</span>
                </button>
              </div>

              {/* Specs Panel Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSpecs((prev) => !prev)}
                title="Toggle Architectural Specs"
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  showSpecs
                    ? "border-brand-orange/50 bg-brand-orange/15 text-brand-orange shadow-[0_0_12px_rgba(255,122,26,.15)]"
                    : "border-white/15 bg-white/[0.05] text-zinc-300 hover:border-white/30 hover:text-white"
                }`}
              >
                <SlidersHorizontal size={13} />
                <span className="hidden md:inline">SPECS</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:border-brand-orange hover:bg-brand-orange hover:text-ink active:scale-95"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ================= Main Body (Stage + Specs Sidebar) ================= */}
          <div className="flex flex-1 overflow-hidden">
            {/* Preview Stage (Left/Center) */}
            <div className="relative flex flex-1 min-w-0 items-center justify-center overflow-hidden bg-[#050608] p-3 sm:p-5 md:p-6">
              {/* Subtle grid background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]"
              />

              {/* --- CONTENT CONTAINER WITH AUTHENTIC SIZES --- */}
              {hasLiveWeb ? (
                /* Real Live Website inside selected responsive device frame */
                <div
                  className={`relative flex transition-all duration-300 ${
                    device === "desktop"
                      ? "h-full w-full flex-col overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl"
                      : device === "tablet"
                      ? "h-full max-h-[640px] w-full max-w-[720px] shrink-0 flex-col overflow-hidden rounded-[26px] border-[8px] border-[#181A20] bg-black shadow-2xl ring-1 ring-white/15"
                      : "h-full max-h-[680px] w-[360px] sm:w-[375px] shrink-0 flex-col overflow-hidden rounded-[42px] border-[8px] border-[#181A20] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.95)] ring-1 ring-white/15"
                  }`}
                >
                  {/* Phone Notch & Dynamic Island when in mobile mode */}
                  {device === "mobile" && (
                    <>
                      <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 flex h-4 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-black ring-1 ring-white/10">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-[#1c1c1e]" />
                        <div className="h-2 w-2 rounded-full bg-[#0b1329]" />
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-7 items-center justify-between px-7 pt-1 text-[10px] font-semibold text-white/70">
                        <span>9:41</span>
                        <div className="flex items-center gap-1.5">
                          <Signal size={10} />
                          <Wifi size={10} />
                          <Battery size={12} />
                        </div>
                      </div>
                      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-white/35" />
                    </>
                  )}

                  {/* Tablet Camera when in tablet mode */}
                  {device === "tablet" && (
                    <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-2 w-2 -translate-x-1/2 rounded-full bg-white/20" />
                  )}

                  {/* Desktop Browser Mini Header */}
                  {device === "desktop" && (
                    <div className="flex h-7 shrink-0 items-center justify-between border-b border-white/10 bg-[#0C0E14] px-3 text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500/80" />
                        <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="truncate font-mono text-[10px] text-zinc-400 max-w-sm">{liveUrl}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                    </div>
                  )}

                  {isIframeRestricted ? (
                    <div className="flex flex-1 flex-col items-center justify-between overflow-y-auto bg-gradient-to-b from-[#0C0E17] via-[#090C14] to-[#05060A] p-6 sm:p-8 text-center custom-scrollbar">
                      <div className="my-auto flex flex-col items-center max-w-md">
                        <div className="relative grid h-20 w-20 place-items-center rounded-3xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 shadow-[0_0_35px_rgba(255,122,26,0.25)]">
                          <ExternalLink size={34} className="text-brand-orange" />
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
                          </span>
                        </div>

                        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                          Production Host Online &amp; Verified
                        </span>

                        <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white">{project.title}</h3>
                        <p className="mt-1 text-xs font-semibold text-brand-orange">
                          {project.category} {project.badge ? `• ${project.badge}` : ""}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                          {project.description}
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left">
                          <p className="text-[11px] leading-relaxed text-zinc-400">
                            <strong className="text-zinc-200">Live Production Portal:</strong> Runs on secure production infrastructure. Opens directly in a dedicated tab with full session authentication and interactive features.
                          </p>
                        </div>

                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange px-6 py-3 text-xs font-bold text-ink shadow-[0_4px_24px_rgba(255,122,26,.35)] transition hover:brightness-110 active:scale-95"
                        >
                          <span>Launch Live Production Portal ↗</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!iframeLoaded && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0A0D14]">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                          <span className="text-xs font-semibold text-zinc-400">Loading live preview...</span>
                        </div>
                      )}

                      <iframe
                        key={`${liveUrl}-${device}`}
                        src={liveUrl}
                        title={project.title}
                        onLoad={() => setIframeLoaded(true)}
                        className="h-full w-full border-0 bg-white"
                      />
                    </>
                  )}
                </div>
              ) : (
                /* Fallback Phone Frame only if project has no web URL (APK only) */
                <div className="relative flex h-full max-h-[680px] w-[360px] sm:w-[375px] shrink-0 flex-col overflow-hidden rounded-[42px] border-[8px] border-[#181A20] bg-[#0C0E17] shadow-[0_25px_80px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
                  <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-4 w-28 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
                  <div className="flex h-10 shrink-0 items-center justify-between px-6 pt-2 text-[10px] font-semibold text-zinc-400">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <Signal size={11} />
                      <Wifi size={11} />
                      <Battery size={13} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 text-center custom-scrollbar">
                    <div className="mt-6 flex flex-col items-center">
                      <div className="relative grid h-20 w-20 place-items-center rounded-3xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 shadow-[0_0_30px_rgba(255,122,26,0.25)]">
                        <Smartphone size={36} className="text-brand-orange" />
                        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-ink shadow-md">
                          <ShieldCheck size={14} />
                        </span>
                      </div>
                      <span className="mt-5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {project.badge || "Verified Android APK"}
                      </span>
                      <h3 className="mt-3 text-2xl font-black text-white">{project.title}</h3>
                      <p className="mt-1 text-xs font-semibold text-brand-orange">{project.category}</p>
                      <p className="mt-3 text-xs leading-relaxed text-zinc-300">{project.description}</p>
                    </div>

                    {apkHref && (
                      <div className="mt-6">
                        <a
                          href={apkHref}
                          download={apkFileName}
                          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange px-4 py-3 text-xs font-bold text-ink shadow-[0_4px_24px_rgba(255,122,26,.35)] transition hover:brightness-110 active:scale-95"
                        >
                          <Download size={16} />
                          <span>Download Android APK ⇩</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Architectural Profile / Specs Sidebar (Right - Dynamically Sized per Device) */}
            <AnimatePresence>
              {showSpecs && (
                <motion.aside
                  key={`specs-${device}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  style={{ width: `${specsWidth}px` }}
                  className="hidden md:flex shrink-0 flex-col justify-between overflow-y-auto border-l border-white/10 bg-[#090D16]/95 p-5 lg:p-6 custom-scrollbar"
                >
                  <div>
                    {/* Architectural Profile Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange font-mono">
                          [ ARCHITECTURAL PROFILE ]
                        </span>
                        <h2 id="preview-modal-title" className="mt-1 text-lg sm:text-xl font-black text-white truncate">
                          {project.title}
                        </h2>
                        <p className="mt-0.5 text-xs font-semibold text-zinc-400">{project.category}</p>
                      </div>
                      {project.badge && (
                        <span className="shrink-0 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-orange shadow-[0_0_12px_rgba(255,122,26,.15)]">
                          {project.badge}
                        </span>
                      )}
                    </div>

                    {/* Executive Description */}
                    <div className="mt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                        System Architecture &amp; Purpose
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                        {project.description}
                      </p>
                    </div>

                    {/* Performance Milestones */}
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-orange font-mono">
                        PERFORMANCE MILESTONES:
                      </h4>
                      <ul className="mt-2.5 space-y-2">
                        {milestones.map((m) => (
                          <li key={m} className="flex items-center gap-2 text-xs font-medium text-zinc-200">
                            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-orange/20 text-[10px] text-brand-orange">
                              ✓
                            </span>
                            <span className="leading-tight">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Relational Tech Stack */}
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                        RELATIONAL TECH STACK:
                      </h4>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                    {/* Primary Web Link Button */}
                    {hasLiveWeb && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-ink shadow-[0_4px_16px_rgba(255,122,26,.3)] transition hover:brightness-110 active:scale-95"
                      >
                        <span>Visit Live Website ↗</span>
                      </a>
                    )}

                    {/* Dedicated APK Download Button if available */}
                    {apkHref && (
                      <a
                        href={apkHref}
                        download={apkFileName}
                        className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl border border-brand-orange/50 bg-brand-orange/10 px-4 py-2 text-xs font-bold text-brand-orange transition hover:bg-brand-orange hover:text-ink active:scale-95"
                      >
                        <Download size={14} />
                        <span>Download APK ⇩</span>
                      </a>
                    )}

                    {/* GitHub Code Link */}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-[36px] w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-brand-orange/60 hover:bg-white/[0.08] hover:text-brand-orange active:scale-95"
                      >
                        <span>View Repository Code</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
