import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { spring } from "../motion/config.js";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";

const INTERACTIVE = "a, button, [role='button'], summary, [data-cursor]";

/**
 * Custom cursor: precise dot + trailing ring that grows over interactive elements.
 * Desktop (hover + fine pointer) and non-reduced-motion only; renders nothing otherwise.
 * The native cursor is hidden only while this is mounted and active (html.has-custom-cursor).
 */
export default function Cursor() {
  const { reduce, canHover } = useMotionPrefs();
  const active = canHover && !reduce;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, spring.cursor);
  const ry = useSpring(y, spring.cursor);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => setHovering(Boolean(e.target.closest?.(INTERACTIVE)));
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", leave);
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[200] transition-opacity duration-fast ${visible ? "opacity-100" : "opacity-0"}`}>
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0 will-change-transform">
        <div
          className={`-ml-[18px] -mt-[18px] h-9 w-9 rounded-full border transition-[transform,background-color,border-color] duration-base ${
            hovering ? "scale-[1.7] border-brand-orange/70 bg-brand-orange/10" : "scale-100 border-white/40 bg-transparent"
          }`}
        />
      </motion.div>
      <motion.div style={{ x, y }} className="absolute left-0 top-0 will-change-transform">
        <div className={`-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-orange transition-opacity duration-fast ${hovering ? "opacity-0" : "opacity-100"}`} />
      </motion.div>
    </div>
  );
}
