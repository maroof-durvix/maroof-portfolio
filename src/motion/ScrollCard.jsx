import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { scrub } from "./config.js";
import Reveal from "./Reveal.jsx";
import { useMotionPrefs } from "./useMotionPrefs.js";

/**
 * Scroll-scrubbed card entrance. While the card travels from the bottom of the screen to ~2/3 height,
 * its position, opacity, scale and (desktop) tilt are driven directly by scroll progress, so it
 * moves with the page and reverses if you scroll back. Transform + opacity only.
 *
 *  from  "up" (default) | "left" | "right"  -> side the card slides in from
 *  lag   0..1 extra distance before it completes (use per column to stagger a grid)
 *
 * Reduced motion: falls back to the one-shot fade (Reveal). Phones: shorter travel, no tilt / scale.
 */
export default function ScrollCard({ children, className = "", from = "up", lag = 0, as = "div" }) {
  const ref = useRef(null);
  const { reduce, lite } = useMotionPrefs();
  const end = scrub.end - lag * 12;
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${scrub.start}%`, `start ${end}%`] });

  const dy = lite ? scrub.lite.y : scrub.y;
  const dx = lite ? scrub.lite.x : scrub.x;
  const sideways = from === "left" ? -dx : from === "right" ? dx : 0;

  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [dy, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [sideways, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [lite ? 1 : scrub.scale, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [lite ? 0 : scrub.tilt, 0]);

  if (reduce) {
    return (
      <Reveal className={className} as={as}>
        {children}
      </Reveal>
    );
  }

  const Tag = motion[as];
  return (
    <Tag
      ref={ref}
      style={{ opacity, y, x, scale }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </Tag>
  );
}
