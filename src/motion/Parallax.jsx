import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { parallax } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/** Vertical depth drift tied to scroll. Transform only. Static on phones / touch / reduced motion. */
export default function Parallax({ speed = parallax.glow, className = "", children }) {
  const ref = useRef(null);
  const { reduce, lite } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);

  if (reduce || lite) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div ref={ref} style={{ y }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
