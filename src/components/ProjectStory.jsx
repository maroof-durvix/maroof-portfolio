import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { projects } from "../data/portfolioData.js";
import { duration, ease, parallax, story } from "../motion/config.js";
import { useLenis } from "../motion/SmoothScroll.jsx";
import SplitText from "../motion/SplitText.jsx";
import { ProjectActions } from "./ProjectCard.jsx";

const COUNT = projects.length;
const pad = (n) => String(n).padStart(2, "0");
const initialsOf = (title) =>
  title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

/** Alternating brand-color light pools, one per project (data-driven: no new content). */
const ACCENTS = [
  "radial-gradient(60% 60% at 72% 28%, rgba(255,122,26,.38), transparent 70%), radial-gradient(55% 55% at 18% 82%, rgba(47,107,255,.30), transparent 72%)",
  "radial-gradient(60% 60% at 24% 26%, rgba(47,107,255,.38), transparent 70%), radial-gradient(55% 55% at 82% 78%, rgba(255,122,26,.30), transparent 72%)",
  "radial-gradient(60% 60% at 70% 74%, rgba(255,122,26,.34), transparent 70%), radial-gradient(55% 55% at 22% 22%, rgba(47,107,255,.32), transparent 72%)",
  "radial-gradient(60% 60% at 28% 70%, rgba(47,107,255,.36), transparent 70%), radial-gradient(55% 55% at 78% 24%, rgba(255,122,26,.32), transparent 72%)",
];

/** Text entrance for one slide: children fade/rise in a stagger once the slide becomes active. */
const itemVariants = {
  out: { opacity: 0, y: 28, transition: { duration: duration.fast, ease: ease.in } },
  in: (order) => ({ opacity: 1, y: 0, transition: { duration: duration.base, delay: 0.15 + order * 0.07, ease: ease.out } }),
};

function StepBar({ index, progress, active, title, onSelect }) {
  const fill = useTransform(progress, [index / COUNT, (index + 1) / COUNT], [0, 1], { clamp: true });
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Show project ${index + 1} of ${COUNT}: ${title}`}
      aria-current={active ? "true" : undefined}
      className="group flex h-8 flex-1 items-center"
    >
      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
        <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left rounded-full bg-brand-orange" />
      </span>
    </button>
  );
}

function Visual({ project, index, active, progress }) {
  // Floating tag chips drift at different speeds against the panel (depth, transform only).
  const driftA = useTransform(progress, [0, 1], [parallax.story * 240, -parallax.story * 240]);
  const driftB = useTransform(progress, [0, 1], [-parallax.story * 180, parallax.story * 180]);
  const drifts = [driftA, driftB, driftA, driftB, driftA];
  const spots = ["left-[7%] top-[16%]", "right-[8%] top-[28%]", "left-[12%] bottom-[24%]", "right-[10%] bottom-[14%]", "left-[42%] top-[8%]"];

  // Ghost initials slide sideways across the whole story (scroll-linked), opposite direction per project.
  const ghostX = useTransform(progress, [0, 1], index % 2 === 0 ? ["10%", "-10%"] : ["-10%", "10%"]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      initial={false}
      // Wipe: the active visual opens upward from the bottom edge; the previous one folds away downward.
      animate={{ clipPath: active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
      transition={{ duration: duration.slow, ease: ease.inOut }}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: active ? 1 : 1.12 }}
        transition={{ duration: duration.slow + 0.3, ease: ease.out }}
      >
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0" style={{ background: ACCENTS[index % ACCENTS.length] }} />
        <motion.div style={{ x: ghostX }} className="absolute inset-0 grid place-items-center will-change-transform">
          <span className="select-none text-[clamp(7rem,17vw,15rem)] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.18)]">
            {initialsOf(project.title)}
          </span>
        </motion.div>
        {project.tags.slice(0, spots.length).map((tag, i) => (
          <motion.span
            key={tag}
            style={{ y: drifts[i] }}
            className={`absolute ${spots[i]} rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-zinc-100 backdrop-blur-md will-change-transform`}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/**
 * Pinned storytelling for the featured projects (desktop, landscape, motion allowed).
 * The stage sticks to the viewport while scrolling advances project 01 -> 04; the text re-reveals and
 * the visual cross-fades. Inactive slides are `inert` so keyboard/screen-reader users only meet the active one,
 * and the step bars are real buttons that scroll to each project.
 */
export default function ProjectStory({ onOpenPreview }) {
  const trackRef = useRef(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    const y = top + distance * ((index + 0.5) / COUNT);
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y });
  };

  return (
    <div ref={trackRef} style={{ height: `${(1 + COUNT * story.vhPerStep) * 100}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-8 pt-20 lg:grid-cols-[5fr_6fr]">
          {/* ---------- Text column ---------- */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-sm font-bold tabular-nums text-brand-orange">
                {pad(active + 1)} <span className="text-zinc-400">/ {pad(COUNT)}</span>
              </span>
              <div className="flex flex-1 gap-2">
                {projects.map((p, i) => (
                  <StepBar key={p.title} index={i} progress={scrollYProgress} active={i === active} title={p.title} onSelect={goTo} />
                ))}
              </div>
            </div>

            <div className="relative min-h-[27rem]">
              {projects.map((p, i) => {
                const isActive = i === active;
                return (
                  <motion.article
                    key={p.title}
                    initial="out"
                    animate={isActive ? "in" : "out"}
                    aria-hidden={isActive ? undefined : true}
                    inert={isActive ? undefined : ""}
                    className={`absolute inset-0 flex flex-col justify-center ${isActive ? "" : "pointer-events-none"}`}
                  >
                    <motion.div variants={itemVariants} custom={0} className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">{p.category}</span>
                      {p.badge && (
                        <span className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-0.5 text-[11px] font-semibold text-brand-orange">
                          {p.badge}
                        </span>
                      )}
                    </motion.div>

                    <SplitText
                      as="h3"
                      text={p.title}
                      trigger="mount"
                      ready={isActive}
                      delay={0.12}
                      className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white xl:text-5xl"
                    />

                    <motion.p variants={itemVariants} custom={3} className="mt-5 text-base leading-relaxed text-zinc-300">
                      {p.description}
                    </motion.p>

                    <motion.ul variants={itemVariants} custom={4} className="mt-6 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                          {t}
                        </li>
                      ))}
                    </motion.ul>

                    <motion.div variants={itemVariants} custom={5}>
                      <ProjectActions p={p} className="mt-7 flex flex-wrap items-center gap-2.5" onOpenPreview={onOpenPreview} />
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* ---------- Visual column ---------- */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-[0_30px_120px_-30px_rgba(255,122,26,0.25)]">
            {projects.map((p, i) => (
              <Visual key={p.title} project={p} index={i} active={i === active} progress={scrollYProgress} />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
