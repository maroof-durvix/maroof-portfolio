import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";

/**
 * Fixed, very soft brand-colored light pools that drift as you scroll (depth behind every section).
 * Radial gradients (no blur filter) + transform-only movement. Desktop only; skipped on touch / reduced motion.
 */
export default function AmbientBackground() {
  const { reduce, lite } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const orangeY = useTransform(scrollYProgress, [0, 1], ["-5vh", "55vh"]);
  // Fade the light pools in after the hero so there is no visible seam where the opaque hero ends.
  const fade = useTransform(scrollYProgress, [0.03, 0.14], [0, 1]);
  const blueY = useTransform(scrollYProgress, [0, 1], ["10vh", "-35vh"]);

  if (reduce || lite) return null;
  return (
    <motion.div aria-hidden="true" style={{ opacity: fade }} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: orangeY }}
        className="absolute -left-[20vw] top-0 h-[70vh] w-[60vw] bg-[radial-gradient(closest-side,rgba(255,122,26,0.12),transparent)] will-change-transform"
      />
      <motion.div
        style={{ y: blueY }}
        className="absolute -right-[20vw] top-[25vh] h-[80vh] w-[65vw] bg-[radial-gradient(closest-side,rgba(47,107,255,0.11),transparent)] will-change-transform"
      />
      <div className="grain absolute inset-0" />
    </motion.div>
  );
}
