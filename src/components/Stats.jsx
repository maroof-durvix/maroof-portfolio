import { stats } from "../data/portfolioData.js";
import ScrollCard from "../motion/ScrollCard.jsx";
import CountUp from "../motion/CountUp.jsx";

export default function Stats() {
  return (
    <section aria-label="Highlights" className="relative z-10 mx-auto mt-24 sm:mt-32 lg:mt-36 mb-20 sm:mb-28 max-w-6xl px-5 sm:px-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, index) => (
          <ScrollCard key={s.label} lag={(index % 4) * 0.25}>
            <div className="glass spot relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-orange/10 blur-2xl" />
              <div>
                <CountUp value={s.value} className="block text-3xl font-black tracking-tight text-brand-orange sm:text-4xl lg:text-5xl" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white sm:text-sm">{s.label}</p>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-zinc-400 sm:text-xs">{s.subtext}</p>
            </div>
          </ScrollCard>
        ))}
      </div>
    </section>
  );
}
