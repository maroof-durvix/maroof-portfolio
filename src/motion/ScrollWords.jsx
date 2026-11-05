import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { reading } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

function Word({ word, range, progress }) {
  const opacity = useTransform(progress, range, [reading.dim, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

/**
 * Paragraph whose words light up one by one as you scroll through it (opacity only).
 * The real text stays in the DOM, so screen readers read it normally.
 * Reduced motion: plain, fully visible text.
 */
export default function ScrollWords({ text, className = "" }) {
  const ref = useRef(null);
  const { reduce } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${reading.start}%`, `end ${reading.end}%`] });
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const a = (i / words.length) * 0.88;
        return <Word key={`${w}-${i}`} word={w} range={[a, a + 0.12]} progress={scrollYProgress} />;
      })}
    </p>
  );
}
