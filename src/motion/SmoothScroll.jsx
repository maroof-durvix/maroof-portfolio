import { createContext, useContext, useEffect, useState } from "react";
import { lenis as lenisConfig } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

const LenisContext = createContext(null);

/** Access the Lenis instance (null when reduced motion is on). Used to pause scrolling under modals. */
export const useLenis = () => useContext(LenisContext);

/**
 * Premium smooth scrolling.
 * Why Lenis: native `scroll-behavior: smooth` only smooths anchor jumps. Lenis adds wheel inertia while still
 * driving the REAL scroll position, so `position: sticky`, IntersectionObserver and Framer's useScroll keep working.
 * Disabled for touch devices (native momentum scrolling is already smooth) and for reduced motion.
 */
export default function SmoothScroll({ children }) {
  const { reduce, canHover } = useMotionPrefs();
  // Wheel smoothing is only useful with a mouse/trackpad. Touch devices keep fully native scrolling
  // (no permanent rAF loop = less main-thread work on phones); CSS smooth-scroll covers their anchor jumps.
  const enabled = !reduce && canHover;
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let lenis;
    let cancelled = false;
    // Loaded on demand: phones / reduced-motion visitors never download or parse Lenis.
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: lenisConfig.duration,
        easing: lenisConfig.easing,
        wheelMultiplier: lenisConfig.wheelMultiplier,
        smoothWheel: lenisConfig.smoothWheel,
        syncTouch: lenisConfig.syncTouch,
        autoRaf: true,
      });
      setInstance(lenis);
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      setInstance(null);
    };
  }, [enabled]);

  // In-page anchors: glide with Lenis (it honors the CSS scroll-margin used for the fixed navbar).
  useEffect(() => {
    if (!instance) return undefined;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      const target = hash === "#" ? document.body : document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      // Lenis already subtracts the target's CSS scroll-margin-top (our fixed-navbar offset), so no manual offset here.
      instance.scrollTo(hash === "#" || hash === "#top" ? 0 : target, {
        duration: lenisConfig.anchorDuration,
        easing: lenisConfig.easing,
      });
      if (hash !== "#") window.history.replaceState(null, "", hash);
      // Keyboard / screen-reader users: move focus to the destination without a second scroll.
      if (target !== document.body) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [instance]);

  return <LenisContext.Provider value={instance}>{children}</LenisContext.Provider>;
}
