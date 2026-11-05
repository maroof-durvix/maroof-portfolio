import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Award, Briefcase, ChevronRight, GraduationCap } from "lucide-react";
import { experience } from "../data/portfolioData.js";
import ScrollCard from "../motion/ScrollCard.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { spring } from "../motion/config.js";
import { useMotionPrefs } from "../motion/useMotionPrefs.js";

export default function Experience() {
  const listRef = useRef(null);
  const { reduce } = useMotionPrefs();
  // The orange line "draws" down the timeline as you read (transform: scaleY only).
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, spring.progress);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <SectionHeading kicker="Milestones & Background" title="Professional Journey & Leadership" ghost="Journey" />

      <div ref={listRef} className="relative border-l border-white/10 pl-6 sm:pl-10 ml-2 sm:ml-4 space-y-10 sm:space-y-12">
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : smooth }}
          className="pointer-events-none absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-brand-orange via-brand-orange/60 to-brand-blue will-change-transform"
        />
        {experience.map((item, index) => {
          const isWinner = item.badgeColor === "emerald";
          const isFounder = item.badgeColor === "brand-orange";

          return (
            <ScrollCard key={item.role} from="right">
              <div className="relative group">
                {/* Node icon on the timeline */}
                <div
                  className={`absolute -left-[35px] sm:-left-[51px] top-1 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border shadow-lg transition-transform duration-base group-hover:scale-110 ${
                    isWinner
                      ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.3)]"
                      : isFounder
                      ? "border-brand-orange/50 bg-brand-orange/20 text-brand-orange shadow-[0_0_16px_rgba(255,122,26,.3)]"
                      : "border-white/20 bg-surface text-zinc-300"
                  }`}
                >
                  {isWinner ? (
                    <Award size={16} aria-hidden="true" />
                  ) : index === 3 ? (
                    <GraduationCap size={16} aria-hidden="true" />
                  ) : (
                    <Briefcase size={16} aria-hidden="true" />
                  )}
                </div>

                {/* Timeline Card */}
                <article className="glass spot rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide ${
                        isWinner
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                          : isFounder
                          ? "border-brand-orange/40 bg-brand-orange/10 text-brand-orange"
                          : "border-white/15 bg-white/[0.04] text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brand-orange">
                    {item.organization}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {item.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-zinc-300 sm:text-sm">
                        <ChevronRight size={15} className="shrink-0 mt-0.5 text-brand-orange" aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </ScrollCard>
          );
        })}
      </div>
    </section>
  );
}

