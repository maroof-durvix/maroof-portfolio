import { Code2, Database, Server, Workflow } from "lucide-react";
import { skills } from "../data/portfolioData.js";
import ScrollCard from "../motion/ScrollCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

const icons = { Code2, Database, Server, Workflow };

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <SectionHeading kicker="What I work with" title="Skills & toolset" ghost="Skills" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, index) => {
          const Icon = icons[group.icon];
          return (
            <ScrollCard key={group.title} lag={index * 0.25}>
              <article className="glass spot group h-full rounded-3xl p-5 sm:p-6">
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-brand-orange/25 bg-brand-orange/10 text-brand-orange transition group-hover:shadow-[0_0_24px_rgba(255,122,26,.2)]">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mb-5 text-base font-bold leading-snug text-zinc-100">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li key={skill} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs leading-4 text-zinc-300">{skill}</li>
                  ))}
                </ul>
              </article>
            </ScrollCard>
          );
        })}
      </div>
    </section>
  );
}
