import { about } from "../data/portfolioData.js";
import ClipReveal from "../motion/ClipReveal.jsx";
import SplitText from "../motion/SplitText.jsx";
import Parallax from "../motion/Parallax.jsx";
import ScrollWords from "../motion/ScrollWords.jsx";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 pb-24 pt-4 sm:px-8 sm:pb-32 sm:pt-8">
      <ClipReveal>
        <div className="gradient-border glass overflow-hidden p-7 sm:p-12">
          <Parallax speed={0.25} className="pointer-events-none absolute -right-24 -top-24 h-72 w-72">
            <div className="h-full w-full rounded-full bg-brand-blue/20 blur-3xl" />
          </Parallax>
          <Parallax speed={-0.25} className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72">
            <div className="h-full w-full rounded-full bg-brand-orange/20 blur-3xl" />
          </Parallax>
          <SplitText as="h2" text={about.heading} className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl" />
          {/* Words light up as you scroll through each paragraph */}
          <div className="relative mt-8 max-w-4xl space-y-5 text-sm leading-relaxed text-zinc-100 sm:text-base sm:leading-8">
            {about.paragraphs.map((paragraph, index) => (
              <ScrollWords key={index} text={paragraph} />
            ))}
          </div>
        </div>
      </ClipReveal>
    </section>
  );
}
