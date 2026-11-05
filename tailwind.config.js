import { ease, hover, cssEase } from "./src/motion/config.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Full screens map (not `extend`) so ordering is deterministic: xs < sm < md < lg < xl < 2xl < wide.
    // `xs` replaces the `min-[380px]:` arbitrary variant, which Tailwind cannot generate when a raw screen exists.
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Fullscreen cinematic layout only on wide landscape screens.
      // Phones, tablets and portrait windows use the stacked layout (whole video frame visible).
      wide: { raw: "(min-width: 1024px) and (min-aspect-ratio: 5/4)" },
    },
    extend: {
      // CSS transitions share the central motion config (src/motion/config.js).
      transitionTimingFunction: {
        DEFAULT: cssEase(ease.out),
        out: cssEase(ease.out),
        "in-out": cssEase(ease.inOut),
      },
      transitionDuration: {
        DEFAULT: `${hover.fast * 1000}ms`,
        fast: `${hover.fast * 1000}ms`,
        base: `${hover.base * 1000}ms`,
        slow: `${hover.slow * 1000}ms`,
      },
      colors: {
        ink: "#050505",
        surface: "#0C0C0F",
        brand: { orange: "#FF7A1A", blue: "#2F6BFF" },
      },
      fontFamily: {
        sans: ["Geist Variable", "Geist", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scrollCue: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
        pulseDot: {
          "0%,100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(0.8)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
        scrollCue: "scrollCue 1.8s cubic-bezier(0.65,0,0.35,1) infinite",
      },
    },
  },
  plugins: [
    // Expose the central motion tokens to plain CSS (index.css) as custom properties.
    ({ addBase }) =>
      addBase({
        ":root": {
          "--ease-out": cssEase(ease.out),
          "--ease-in-out": cssEase(ease.inOut),
          "--dur-fast": `${hover.fast}s`,
          "--dur-base": `${hover.base}s`,
          "--dur-slow": `${hover.slow}s`,
        },
      }),
  ],
};
