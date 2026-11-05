import { useEffect } from "react";
import { useMotionPrefs } from "./useMotionPrefs.js";

/**
 * One delegated pointer listener for every `.spot` card (instead of a handler per card).
 * Writes the cursor position into --mx / --my on the hovered card; CSS does the rest.
 * Mouse only: touch and reduced-motion visitors never run it.
 */
export function useSpotlight() {
  const { reduce, canHover } = useMotionPrefs();
  useEffect(() => {
    if (reduce || !canHover) return undefined;
    let frame = 0;
    let last = null;
    const paint = () => {
      frame = 0;
      if (!last) return;
      const { card, x, y } = last;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${x - r.left}px`);
      card.style.setProperty("--my", `${y - r.top}px`);
    };
    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const card = e.target.closest?.(".spot");
      if (!card) return;
      last = { card, x: e.clientX, y: e.clientY };
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduce, canHover]);
}
