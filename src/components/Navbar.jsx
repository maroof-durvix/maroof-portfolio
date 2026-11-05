import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile, nav } from "../data/portfolioData.js";
import { duration, ease, spring } from "../motion/config.js";
import { useIntroReady } from "../motion/IntroContext.jsx";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";
import Magnetic from "../motion/Magnetic.jsx";

export default function Navbar() {
  const [active, setActive] = useState("#top");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const ready = useIntroReady();
  const { reduce } = useMotionPrefs();

  // Refs for focus management
  const burgerRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  // Scroll detection: expands navbar automatically when client scrolls down past hero
  useEffect(() => {
    const handleScroll = () => {
      const isPastHero = window.scrollY > 60;
      setScrolled(isPastHero);
      if (!isPastHero) {
        // When scrolled back to the very top, auto-collapse so Maroof's face is never covered
        setManualOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isExpanded = scrolled || manualOpen;

  // Intersection Observer: track active section
  useEffect(() => {
    const sections = ["top", ...nav.map((item) => item.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.15, 0.4] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Escape key closes the menu
  useEffect(() => {
    if (!open && !manualOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        if (!scrolled) setManualOpen(false);
        burgerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, manualOpen, scrolled]);

  // Move focus to first menu item on open
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => firstMenuItemRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <motion.header
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={ready || reduce ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
      transition={{ duration: duration.slow, delay: 0.15, ease: ease.out }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4"
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ================= Compact Collapsed State (Hero / Top of Page) ================= */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            <button
              type="button"
              onClick={() => setManualOpen(true)}
              className="group flex items-center gap-2.5 rounded-full border border-brand-orange/40 bg-black/80 px-3.5 py-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl transition hover:border-brand-orange hover:bg-black/95 hover:scale-105 active:scale-95"
              aria-label="Open Navigation Menu"
              title="Click to open menu"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-brand-orange/50 bg-brand-orange/15 text-[11px] font-black text-brand-orange shadow-[0_0_15px_rgba(255,122,26,.3)] transition group-hover:scale-110">
                {profile.initials}
              </span>
              <span className="text-xs font-black tracking-wider text-white">DURVIX</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
              </span>
            </button>
          </motion.div>
        ) : (
          /* ================= Expanded Navigation Bar ================= */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <nav
              aria-label="Main navigation"
              className="relative mx-auto flex min-h-12 w-full max-w-md items-center justify-between gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:px-4 md:w-fit md:max-w-none md:justify-center md:gap-4 lg:gap-6"
            >
              <button
                type="button"
                onClick={() => {
                  if (!scrolled) {
                    setManualOpen(false);
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full pr-1 text-sm font-black tracking-tight text-white transition hover:opacity-90"
                title={!scrolled ? "Click to collapse navbar" : "Scroll to top"}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-brand-orange/40 bg-brand-orange/10 text-[11px] text-brand-orange shadow-[0_0_20px_rgba(255,122,26,.15)] transition group-hover:scale-105 group-hover:border-brand-orange">
                  {profile.initials}
                </span>
                <span className="hidden xs:inline">DURVIX</span>
                <span className="sr-only"> — {profile.name}, home</span>
              </button>

              <ul className="hidden items-center gap-1 md:flex">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active === item.href ? "location" : undefined}
                      className={`relative inline-flex rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                        active === item.href ? "text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {active === item.href && (
                        <motion.span
                          layoutId="nav-active"
                          transition={spring.layout}
                          className="absolute inset-0 rounded-full bg-white/[0.09] ring-1 ring-inset ring-white/10"
                        >
                          <span className="absolute inset-x-4 -bottom-px h-px bg-brand-orange shadow-[0_0_8px_#FF7A1A]" />
                        </motion.span>
                      )}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex shrink-0 items-center gap-2">
                {/* Compact CTA */}
                <a
                  href="#contact"
                  className="hidden min-h-8 items-center rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-orange xs:inline-flex sm:hidden"
                >
                  Talk
                </a>
                {/* Full CTA */}
                <Magnetic className="hidden sm:inline-flex">
                  <a
                    href="#contact"
                    className="inline-flex min-h-8 items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition hover:bg-brand-orange"
                  >
                    Let's Talk <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </Magnetic>
                <button
                  ref={burgerRef}
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white md:hidden"
                  aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={open}
                  aria-controls="mobile-navigation"
                >
                  {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-navigation"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: duration.fast, ease: ease.in } }}
            transition={{ duration: duration.base, ease: ease.out }}
            style={{ transformOrigin: "top center" }}
            className="mx-auto mt-2 flex w-[calc(100%-1.5rem)] max-w-4xl flex-col rounded-3xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl md:hidden"
          >
            {nav.map((item, idx) => (
              <li key={item.href}>
                <a
                  ref={idx === 0 ? firstMenuItemRef : undefined}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active === item.href ? "location" : undefined}
                  className={`block rounded-2xl px-4 py-3 text-sm transition ${
                    active === item.href ? "bg-white/[0.08] text-brand-orange" : "text-zinc-200 hover:bg-white/[0.06]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-4 py-3 text-sm font-bold text-ink"
              >
                Let's Talk <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
