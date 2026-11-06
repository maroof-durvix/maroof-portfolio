import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "../motion/SmoothScroll.jsx";

/**
 * High-End 10-Second Kinetic Reveal Preloader
 *
 * Timeline (Total: 10 Seconds):
 * - Phase 1 (0s - 3s): Glitch & Glowing SVG Stroke Outline drawing "MAD" + 0% - 35% counter
 * - Phase 2 (3s - 7s): Liquid gradient fill sweep inside letters + Kinetic typography cycle
 *                      ("DEVELOPER" -> "FOUNDER" -> "DURVIX") in Electric Blue (#0066FF)
 * - Phase 3 (7s - 9.5s): Full Brand Lockup ("MAROOF AHMED DURWESH | DURVIX") with scale spring
 * - Phase 4 (9.5s - 10s): Split-curtain cinematic wipe reveal uncovering the portfolio
 */
export default function Preloader({ onReveal }) {
  const [phase, setPhase] = useState(1); // 1, 2, 3, 4
  const [kineticWordIndex, setKineticWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const lenis = useLenis();
  const kineticWords = ["DEVELOPER", "FOUNDER", "DURVIX"];

  // Lock body scroll and freeze Lenis during the entire preloader animation
  useEffect(() => {
    lenis?.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [lenis]);

  // Master 10-second Timeline Orchestration
  useEffect(() => {
    let startTime = null;
    let animationFrameId;
    const TOTAL_DURATION = 10000; // 10,000ms = 10s

    const updateTimeline = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / TOTAL_DURATION, 1);

      // Smooth percentage calculation (0% to 100% over ~9.3 seconds)
      const currentPercent = Math.min(
        100,
        Math.floor((elapsed / 9300) * 100)
      );
      setProgress(currentPercent);

      // Phase 1: 0s - 3.0s (0ms - 3000ms)
      if (elapsed < 3000) {
        setPhase(1);
      }
      // Phase 2: 3.0s - 7.0s (3000ms - 7000ms)
      else if (elapsed < 7000) {
        setPhase(2);
        // Kinetic Word Cycling during Phase 2
        const phase2Elapsed = elapsed - 3000;
        if (phase2Elapsed < 1300) {
          setKineticWordIndex(0); // "DEVELOPER"
        } else if (phase2Elapsed < 2600) {
          setKineticWordIndex(1); // "FOUNDER"
        } else {
          setKineticWordIndex(2); // "DURVIX"
        }
      }
      // Phase 3: 7.0s - 9.5s (7000ms - 9500ms)
      else if (elapsed < 9500) {
        setPhase(3);
      }
      // Phase 4: 9.5s - 10.0s (Curtain exit wipe)
      else if (elapsed <= TOTAL_DURATION) {
        setPhase(4);
        if (!isExiting) {
          setIsExiting(true);
          onReveal?.(); // Trigger hero and navbar entrance
        }
      }

      if (elapsed < TOTAL_DURATION) {
        animationFrameId = requestAnimationFrame(updateTimeline);
      } else {
        setIsFinished(true);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimeline);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [onReveal, isExiting]);

  // Skip functionality (Esc key or Skip button)
  const handleSkip = () => {
    setProgress(100);
    setPhase(4);
    setIsExiting(true);
    onReveal?.();
    setTimeout(() => {
      setIsFinished(true);
    }, 450);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isFinished) return null;

  return (
    <div
      role="status"
      aria-label="Portfolio Loading"
      className="fixed inset-0 z-[120] pointer-events-auto select-none overflow-hidden"
    >
      {/* =========================================================================
          Split Curtain Wipe Panels (Phase 4 Exit)
          Top half slides up, Bottom half slides down for a cinematic theater split
          ========================================================================= */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key="preloader-container"
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A0C]"
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            {/* Ambient Animated Cyber Background Grid & Glitch Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#FF6B0010_1px,transparent_1px),linear-gradient(to_bottom,#0066FF10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(255,107,0,0.12),transparent_75%)]" />

            {/* Glowing Electric Blue Ambient Aura in Phase 2 & 3 */}
            <motion.div
              animate={{
                scale: phase >= 2 ? [1, 1.25, 1.1] : 0.8,
                opacity: phase >= 2 ? [0.25, 0.45, 0.3] : 0.1,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-96 w-96 rounded-full bg-[#0066FF] blur-[120px] pointer-events-none"
            />

            {/* Skip Button (Top Right) */}
            <button
              type="button"
              onClick={handleSkip}
              className="absolute top-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400 backdrop-blur-md transition hover:border-[#FF6B00] hover:text-[#FF6B00] active:scale-95"
            >
              <span>Skip Intro</span>
              <span className="text-zinc-600 font-sans">➔</span>
            </button>

            {/* Center Stage Container */}
            <div className="relative flex flex-col items-center justify-center z-10 px-4">
              {/* =================================================================
                  MAD Geometric SVG Monogram
                  Phase 1: Glowing stroke dash outline animation in Neon Orange
                  Phase 2: Liquid mask fill sweeps in + electric blue aura
                  Phase 3: Smooth spring scale expansion + full lockup
                  ================================================================= */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: phase === 3 ? 1.08 : 1,
                  opacity: 1,
                }}
                transition={{
                  scale: { type: "spring", stiffness: 180, damping: 20 },
                  opacity: { duration: 0.6 },
                }}
                className="relative flex flex-col items-center"
              >
                <div className="relative">
                  <svg
                    viewBox="0 0 250 100"
                    className="h-24 sm:h-32 md:h-36 w-auto overflow-visible filter drop-shadow-[0_0_20px_rgba(255,107,0,0.5)]"
                  >
                    <defs>
                      {/* Neon Orange to Sunset Gold Gradient */}
                      <linearGradient id="madGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B00" />
                        <stop offset="60%" stopColor="#FF7A00" />
                        <stop offset="100%" stopColor="#FF9500" />
                      </linearGradient>

                      {/* Electric Blue Accent Gradient */}
                      <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0066FF" />
                        <stop offset="100%" stopColor="#2F80ED" />
                      </linearGradient>

                      {/* Liquid mask rising from bottom (0 to 100) */}
                      <clipPath id="liquidClip">
                        <motion.rect
                          x="0"
                          width="250"
                          initial={{ y: 100, height: 0 }}
                          animate={{
                            y: phase >= 2 ? 0 : 100,
                            height: phase >= 2 ? 100 : 0,
                          }}
                          transition={{
                            duration: 2.2,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.1,
                          }}
                        />
                      </clipPath>

                      {/* Subtle Neon Stroke Glow Filter */}
                      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Subtle Track Strokes */}
                    <g opacity="0.15" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                      {/* M */}
                      <path d="M 22 85 L 22 20 L 48 56 L 74 20 L 74 85" />
                      {/* A */}
                      <path d="M 96 85 L 122 20 L 148 85" />
                      <path d="M 104 60 L 140 60" />
                      {/* D */}
                      <path d="M 170 20 L 170 85 L 195 85 C 220 85 234 68 234 52.5 C 234 37 220 20 195 20 Z" />
                    </g>

                    {/* Liquid Fill Layer (Phase 2 & 3) */}
                    <g
                      clipPath="url(#liquidClip)"
                      fill="url(#madGradient)"
                      stroke="url(#madGradient)"
                      strokeWidth="2"
                    >
                      {/* M */}
                      <path d="M 22 85 L 22 20 L 48 56 L 74 20 L 74 85" />
                      {/* A */}
                      <path d="M 96 85 L 122 20 L 148 85" />
                      <path d="M 104 60 L 140 60" />
                      {/* D */}
                      <path d="M 170 20 L 170 85 L 195 85 C 220 85 234 68 234 52.5 C 234 37 220 20 195 20 Z" />
                    </g>

                    {/* Glowing Stroke Outline Layer (Animated in Phase 1) */}
                    <motion.g
                      filter="url(#neonGlow)"
                      stroke="#FF6B00"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    >
                      {/* M Stroke */}
                      <motion.path
                        d="M 22 85 L 22 20 L 48 56 L 74 20 L 74 85"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                      />
                      {/* A Stroke */}
                      <motion.path
                        d="M 96 85 L 122 20 L 148 85"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
                      />
                      <motion.path
                        d="M 104 60 L 140 60"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1.5, ease: "easeInOut" }}
                      />
                      {/* D Stroke */}
                      <motion.path
                        d="M 170 20 L 170 85 L 195 85 C 220 85 234 68 234 52.5 C 234 37 220 20 195 20 Z"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.9, delay: 0.9, ease: "easeInOut" }}
                      />

                      {/* Electric Blue Terminal Accent Dot */}
                      <motion.circle
                        cx="244"
                        cy="83"
                        r="4"
                        fill="#0066FF"
                        stroke="#0066FF"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{
                          scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                          delay: 1.8,
                        }}
                      />
                    </motion.g>
                  </svg>
                </div>

                {/* =================================================================
                    Phase 2: Kinetic Typography cycling in Electric Blue (#0066FF)
                    "DEVELOPER" -> "FOUNDER" -> "DURVIX"
                    ================================================================= */}
                {phase === 2 && (
                  <div className="h-9 mt-4 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={kineticWords[kineticWordIndex]}
                        initial={{ y: 20, opacity: 0, letterSpacing: "0.4em" }}
                        animate={{ y: 0, opacity: 1, letterSpacing: "0.28em" }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-[#0066FF] drop-shadow-[0_0_12px_rgba(0,102,255,0.7)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF] animate-ping" />
                        <span>{kineticWords[kineticWordIndex]}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* =================================================================
                    Phase 3: Full Brand Lockup Reveal (7s - 9.5s)
                    "MAROOF AHMED DURWESH | DURVIX"
                    ================================================================= */}
                {phase >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 flex flex-col items-center text-center"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm sm:text-base md:text-lg font-black tracking-[0.25em] text-white">
                      <span>MAROOF AHMED DURWESH</span>
                      <span className="text-[#FF6B00]">|</span>
                      <span className="text-[#0066FF] drop-shadow-[0_0_10px_rgba(0,102,255,0.8)]">
                        DURVIX
                      </span>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="mt-1.5 text-[10px] sm:text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase"
                    >
                      Principal Systems Architect &amp; Full-Stack Engineer
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>

              {/* =================================================================
                  Progress Counter & Futuristic Timeline Bar
                  0% to 100% in crisp futuristic monospace typography
                  ================================================================= */}
              <div className="mt-12 flex flex-col items-center gap-2.5 w-64 sm:w-80 md:w-96">
                <div className="flex w-full items-center justify-between font-mono text-[11px]">
                  <span className="text-zinc-500 tracking-widest flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                    {phase === 1 && "SCANNING CORE OUTLINE"}
                    {phase === 2 && "SYNTHESIZING KINETIC STACKS"}
                    {phase === 3 && "SYSTEM VERIFIED // READY"}
                    {phase === 4 && "INITIATING LAUNCH SEQUENCE"}
                  </span>
                  <span className="font-bold text-[#FF6B00] text-sm tracking-wider font-mono drop-shadow-[0_0_8px_rgba(255,107,0,0.6)]">
                    {progress}%
                  </span>
                </div>

                {/* Sleek Dual Gradient Progress Line */}
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF7A00] to-[#0066FF] shadow-[0_0_14px_rgba(255,107,0,0.8)] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex w-full items-center justify-between font-mono text-[9px] text-zinc-600 tracking-wider">
                  <span>PHASE 0{phase} / 04</span>
                  <span>10.0S KINETIC PROTOCOL</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* =====================================================================
             Phase 4 Curtain Exit: Split Curtain Theater Reveal (9.5s - 10s)
             Top half slides up, Bottom half slides down with glowing edges
             ===================================================================== */
          <div className="fixed inset-0 z-[130] pointer-events-none">
            {/* Top Curtain Half */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 left-0 right-0 h-1/2 bg-[#0A0A0C] border-b border-[#FF6B00]/40 shadow-[0_10px_30px_rgba(255,107,0,0.3)]"
            />
            {/* Bottom Curtain Half */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: "100%" }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0A0A0C] border-t border-[#0066FF]/40 shadow-[0_-10px_30px_rgba(0,102,255,0.3)]"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
