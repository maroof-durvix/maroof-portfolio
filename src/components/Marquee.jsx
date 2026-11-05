import { marquee } from "../data/portfolioData.js";
import VelocityMarquee from "../motion/VelocityMarquee.jsx";

/** Two tech-keyword rows that drift in opposite directions and react to scroll speed. */
export default function Marquee() {
  const reversed = [...marquee].reverse();
  return (
    <div className="relative mb-16 space-y-2 border-y border-white/10 py-6 sm:mb-24 sm:py-8">
      <VelocityMarquee items={marquee} className="text-3xl sm:text-5xl lg:text-6xl" />
      <VelocityMarquee items={reversed} direction={-1} outline className="text-3xl sm:text-5xl lg:text-6xl" />
    </div>
  );
}
