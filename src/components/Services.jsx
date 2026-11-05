import { Check, Database, Globe, Server, Smartphone } from "lucide-react";
import { services } from "../data/portfolioData.js";
import ScrollCard from "../motion/ScrollCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

const iconMap = {
  Globe,
  Smartphone,
  Server,
  Database,
};

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <SectionHeading kicker="DURVIX Core Capabilities" title="Engineering Services & Solutions" ghost="Services" />

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] || Globe;
          return (
            <ScrollCard key={service.title} from={index % 2 === 0 ? "left" : "right"} lag={Math.floor(index / 2) * 0.1}>
              <article className="glass spot relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-orange/30 bg-brand-orange/10 text-brand-orange shadow-[0_0_20px_rgba(255,122,26,.15)]">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                      {service.tagline}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {service.description}
                  </p>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                      Deliverables &amp; Focus
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check size={14} className="shrink-0 text-brand-orange" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </ScrollCard>
          );
        })}
      </div>
    </section>
  );
}

