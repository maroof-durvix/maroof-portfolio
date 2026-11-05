import { motion } from "framer-motion";
import { distance, duration, ease, viewport } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/** Fade + rise on scroll, once. Reduced motion: plain fade. */
export default function Reveal({ children, delay = 0, className = "", y = distance.reveal, as = "div" }) {
  const { reduce } = useMotionPrefs();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: duration.base + 0.1, delay, ease: ease.out }}
    >
      {children}
    </Tag>
  );
}
