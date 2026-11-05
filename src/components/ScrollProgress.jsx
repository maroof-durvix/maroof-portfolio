import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "../motion/config.js";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";

/** Thin gradient bar across the top showing page scroll progress (transform: scaleX only). */
export default function ScrollProgress() {
  const { reduce } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, spring.progress);
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-orange to-brand-blue will-change-transform"
    />
  );
}
