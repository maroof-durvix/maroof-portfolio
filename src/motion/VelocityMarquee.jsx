import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { marquee as cfg } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Endless text strip that drifts on its own and speeds up (and flips direction) with scroll velocity.
 * Pauses when off-screen. Reduced motion: static strip.
 *  direction  1 = leftwards, -1 = rightwards   |   outline  hollow lettering for the second row
 */
export default function VelocityMarquee({ items, direction = 1, outline = false, className = "" }) {
  const ref = useRef(null);
  const { reduce } = useMotionPrefs();
  const inView = useInView(ref, { margin: "100px" });
  const x = useMotionValue(0);
  const dir = useRef(direction);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2000, 0, 2000], [-cfg.boost, 0, cfg.boost], { clamp: true });

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const f = boost.get();
    if (f < -0.05) dir.current = -direction;
    else if (f > 0.05) dir.current = direction;
    const step = dir.current * cfg.base * (delta / 1000) * (1 + Math.abs(f));
    x.set(wrap(-50, 0, x.get() - step));
  });

  const translate = useTransform(x, (v) => `translate3d(${v}%,0,0)`);
  const loop = [...items, ...items];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" }}
    >
      <motion.div style={{ transform: translate }} className="flex w-max gap-10 will-change-transform">
        {loop.map((m, i) => (
          <span
            key={i}
            className={`whitespace-nowrap font-black leading-tight tracking-tight ${
              outline ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]" : "text-zinc-200"
            }`}
          >
            {m}
            <span className="ml-10 text-brand-orange [-webkit-text-stroke:0]">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
