/**
 * Central motion config: the ONE place easing, duration, stagger, spring and scroll tuning live.
 * Imported by React components AND by tailwind.config.js (so CSS transitions share the same curves).
 * Plain JS only (no JSX / no browser globals) so Node can load it from the Tailwind config.
 */

/** Cubic-bezier curves (Framer Motion accepts these arrays directly). */
export const ease = {
  /** Default entrance: fast start, long soft landing (expo-out feel). */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric, for things that move across the screen and settle. */
  inOut: [0.65, 0, 0.35, 1],
  /** Exits: quick, decisive. */
  in: [0.4, 0, 1, 1],
};

/** Durations in seconds. */
export const duration = {
  fast: 0.25, // hovers, small state changes
  base: 0.6, // standard reveal
  slow: 0.9, // headlines, hero
  loader: 0.9, // page-load curtain
};

/** CSS hover/transition durations in seconds (Tailwind `duration-fast|base|slow` map to these). */
export const hover = { fast: 0.25, base: 0.4, slow: 0.7 };

/** Delay between siblings, in seconds. */
export const stagger = {
  words: 0.07,
  items: 0.09,
  cards: 0.1,
};

/** Spring presets. */
export const spring = {
  /** Magnetic buttons: responsive, slightly loose. */
  magnetic: { stiffness: 220, damping: 18, mass: 0.5 },
  /** Cursor ring: trails the dot. */
  cursor: { stiffness: 380, damping: 32, mass: 0.6 },
  /** Scroll progress bar: smooth but never behind the scroll. */
  progress: { stiffness: 140, damping: 30, restDelta: 0.001 },
  /** Shared-layout moves (navbar active pill). */
  layout: { type: "spring", stiffness: 420, damping: 34 },
};

/** Default whileInView settings: animate once, a little before the element is fully in view. */
export const viewport = { once: true, margin: "-80px 0px -80px 0px" };

/** Reveal travel distance in px. */
export const distance = { reveal: 28, text: 110 /* % of a masked word */ };

/** Scroll-linked effect strengths. Mobile / touch gets the `lite` multiplier (0 = off). */
export const parallax = {
  heroVideo: 0.08, // fraction of hero height the video drifts
  glow: 0.22, // background glow blobs
  story: 0.12, // pinned-story floating chips
  lite: 0,
};

/** Hover / pointer effects (desktop with a fine pointer only). */
export const pointer = {
  magneticStrength: 0.28, // fraction of the cursor offset the button follows
  magneticMax: 10, // px cap
  tiltMax: 5, // degrees
  tiltPerspective: 900,
};

/**
 * Scroll-scrubbed entrances: the element's progress is tied to scroll position (not a one-shot timer),
 * so cards genuinely move with the page. `start` / `end` are viewport positions (% from top) where the
 * entrance begins (element top enters) and completes. `lite` (phones) = shorter travel, no tilt/scale.
 */
export const scrub = {
  start: 102,
  end: 66,
  y: 90, // px
  x: 56, // px, for from="left" | "right"
  scale: 0.94,
  tilt: 9, // deg (rotateX), desktop only
  perspective: 1100,
  lite: { y: 34, x: 0 },
};

/** Scroll-linked word highlight (About). Words start dim and light up as the paragraph is read. */
export const reading = { dim: 0.16, start: 90, end: 58 };

/** Velocity marquee: base drift in %/s and how strongly scroll speed boosts it. */
export const marquee = { base: 2.4, boost: 3.2 };

/** Pinned storytelling section. */
export const story = {
  /** Scroll distance per slide, in viewport heights. */
  vhPerStep: 0.85,
};

/** Lenis (smooth scroll) tuning: premium = a little inertia, never laggy. */
export const lenis = {
  duration: 1.1,
  // Exponential ease-out: quick response, soft stop.
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 0.95,
  smoothWheel: true,
  syncTouch: false, // keep native momentum on touch devices
  anchorDuration: 1.4,
};

/** Build a CSS cubic-bezier() string from an easing array. */
export const cssEase = (curve) => `cubic-bezier(${curve.join(", ")})`;
