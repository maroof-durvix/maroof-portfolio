import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { ease } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/** Counts "20+" / "100%" up from 0 once in view. Non-numeric or tiny values ("1st") stay static. */
export default function CountUp({ value, className = "" }) {
  const { reduce } = useMotionPrefs();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const animated = Boolean(match) && target >= 10 && !reduce;

  useEffect(() => {
    if (!animated || !inView || !ref.current) return undefined;
    const node = ref.current;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: ease.out,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [animated, inView, target, suffix]);

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true">
        {animated ? `0${suffix}` : value}
      </span>
    </span>
  );
}
