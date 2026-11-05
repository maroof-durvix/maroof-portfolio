import { Fragment } from "react";
import { motion } from "framer-motion";
import { distance, duration, ease, stagger, viewport } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/**
 * Staggered word-mask reveal (each word rises from behind a clipping line).
 * - trigger="view"  : plays once when scrolled into view
 * - trigger="mount" : plays when `ready` becomes true (used by the hero)
 * Accessible: the real text is exposed once via sr-only; the animated copy is aria-hidden.
 * Reduced motion: words simply fade in.
 */
export default function SplitText({
  text,
  as = "span",
  className = "",
  wordClass,
  trigger = "view",
  ready = true,
  delay = 0,
  step = stagger.words,
}) {
  const { reduce } = useMotionPrefs();
  const Tag = motion[as];
  const words = text.split(" ");

  const word = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } } }
    : {
        hidden: { y: `${distance.text}%` },
        show: { y: 0, transition: { duration: duration.slow, ease: ease.out } },
      };

  const triggerProps =
    trigger === "view"
      ? { whileInView: "show", viewport }
      : { animate: ready ? "show" : "hidden" };

  return (
    <Tag
      className={className}
      initial="hidden"
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...triggerProps}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            {/* Padding + negative margin keep ascenders/descenders from being clipped without changing line height */}
            <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] pt-[0.08em] -mt-[0.08em]">
              <motion.span className={`inline-block ${wordClass ? wordClass(w, i) : ""}`} variants={word}>
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
