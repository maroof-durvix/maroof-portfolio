import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { duration, ease, viewport } from "../motion/config.js";
import Reveal from "../motion/Reveal.jsx";
import SplitText from "../motion/SplitText.jsx";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";

/**
 * Shared section heading: kicker fades up, title rises word-by-word, accent line draws in.
 * `ghost` adds a huge hollow word behind the title that slides sideways with scroll (depth, transform only).
 */
export default function SectionHeading({ kicker, title, ghost }) {
  const ref = useRef(null);
  const { reduce, lite } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-22%"]);
  const showGhost = ghost && !reduce && !lite;

  return (
    <div ref={ref} className="relative mb-10 sm:mb-14">
      {showGhost && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 -z-10 overflow-hidden sm:-top-24">
          <motion.span
            style={{ x }}
            className="block select-none whitespace-nowrap text-[clamp(6rem,17vw,14rem)] font-black leading-none tracking-[-0.06em] text-transparent will-change-transform [-webkit-text-stroke:1px_rgba(255,255,255,0.055)]"
          >
            {ghost}
          </motion.span>
        </div>
      )}
      {kicker && (
        <Reveal y={12}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">{kicker}</p>
        </Reveal>
      )}
      <SplitText as="h2" text={title} className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl" />
      <motion.span
        aria-hidden="true"
        className="mt-6 block h-px w-24 origin-left bg-gradient-to-r from-brand-orange to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: duration.slow, delay: 0.3, ease: ease.out }}
      />
    </div>
  );
}
