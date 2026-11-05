import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { pointer, spring } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

const clamp = (v, max) => Math.max(-max, Math.min(max, v));

/** Subtle magnetic pull toward the cursor. Desktop + fine pointer only; otherwise a plain wrapper. */
export default function Magnetic({ children, className = "" }) {
  const ref = useRef(null);
  const { reduce, canHover } = useMotionPrefs();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.magnetic);
  const sy = useSpring(y, spring.magnetic);

  if (reduce || !canHover) return <span className={`inline-flex ${className}`}>{children}</span>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * pointer.magneticStrength, pointer.magneticMax));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * pointer.magneticStrength, pointer.magneticMax));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  );
}
