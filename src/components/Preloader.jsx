import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "../motion/SmoothScroll.jsx";
import { profile } from "../data/portfolioData.js";

/**
 * Luxury Interactive Percentage Preloader
 * Features a glowing monogram, high-precision progress line, and 0% -> 100% digital counter.
 * Slides up like a curtain upon 100% completion, smoothly revealing the hero section.
 */
export default function Preloader({ onReveal }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();

  // Freeze smooth scroll while the preloader curtain is active
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // 1.5s smooth, premium loading pacing
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const fraction = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve for natural acceleration and deceleration
      const currentProgress = Math.min(
        100,
        Math.floor((1 - Math.pow(1 - fraction, 3)) * 100)
      );

      setProgress(currentProgress);

      if (fraction < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setProgress(100);
        // Short completion grace period (180ms) before lifting curtain
        setTimeout(() => {
          onReveal();
          setVisible(false);
        }, 180);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [onReveal]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white will-change-transform"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Ambient radial glow backdrop */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,26,0.12),transparent_70%)]" />

          {/* Centered Brand Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative flex flex-col items-center select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]">
                {profile.initials}
              </span>
              <span className="h-3 w-3 rounded-full bg-brand-orange shadow-[0_0_20px_#FF7A1A]" />
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-zinc-400 uppercase">
                DURVIX DIGITAL ARCHITECTURE
              </span>
            </div>
          </motion.div>

          {/* Progress Bar & Percentage Line */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative mt-9 flex flex-col items-center gap-2.5 w-64 sm:w-80"
          >
            {/* Status text + Percentage counter alongside line */}
            <div className="flex w-full items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-500 tracking-wider flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-brand-orange animate-ping" />
                INITIALIZING SYSTEM
              </span>
              <span className="font-bold text-brand-orange text-xs sm:text-sm tracking-wider font-mono">
                {progress}%
              </span>
            </div>

            {/* Glowing progress line */}
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-orange via-amber-400 to-brand-blue shadow-[0_0_12px_rgba(255,122,26,0.85)] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Microstatus metadata */}
            <div className="flex w-full items-center justify-between font-mono text-[9px] text-zinc-600 mt-0.5">
              <span>V2.5 PRODUCTION</span>
              <span>20+ SYSTEMS VERIFIED</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
