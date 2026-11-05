import { motion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { duration, ease, viewport } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/**
 * Clip-path "window" reveal for key panels (one-time, few elements).
 * clip-path is the one deliberate exception to "transform/opacity only": it is paint-only, runs once per panel,
 * and is removed afterwards (so glows/shadows are never clipped). Phones + reduced motion get a plain fade/rise.
 */
export default function ClipReveal({ children, className = "", delay = 0, radius = "1.5rem" }) {
  const { reduce, lite } = useMotionPrefs();
  if (reduce || lite) {
    return (
      <Reveal className={className} delay={delay}>
        {children}
      </Reveal>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ clipPath: `inset(14% 8% 14% 8% round ${radius})`, opacity: 0 }}
      whileInView={{ clipPath: `inset(0% 0% 0% 0% round ${radius})`, opacity: 1, transitionEnd: { clipPath: "none" } }}
      viewport={viewport}
      transition={{ duration: duration.slow + 0.2, delay, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
