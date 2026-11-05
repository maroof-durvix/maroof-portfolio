import { useCallback, useSyncExternalStore } from "react";

/** Subscribe to a CSS media query. Client-only app, so reading matchMedia synchronously is safe. */
export function useMedia(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Central capability flags used by every motion component.
 *  - reduce:   visitor asked for reduced motion  -> simple fades only, no scroll-linked / pointer effects
 *  - canHover: mouse-like pointer                -> cursor, magnetic buttons, tilt
 *  - lite:     phones / touch                    -> no parallax, no heavy effects
 */
export function useMotionPrefs() {
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const canHover = useMedia("(hover: hover) and (pointer: fine)");
  const narrow = useMedia("(max-width: 767px)");
  return { reduce, canHover, lite: narrow || !canHover };
}
