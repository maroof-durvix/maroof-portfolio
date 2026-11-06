import { useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";
import Services from "./components/Services.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import CaseStudies from "./components/CaseStudies.jsx";
import Experience from "./components/Experience.jsx";
import Contact from "./components/Contact.jsx";
import DurvixAIAssistant from "./components/DurvixAIAssistant.jsx";
import Preloader from "./components/Preloader.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Cursor from "./components/Cursor.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import SmoothScroll from "./motion/SmoothScroll.jsx";
import { IntroContext } from "./motion/IntroContext.jsx";
import { useMotionPrefs } from "./motion/useMotionPrefs.js";
import { useSpotlight } from "./motion/useSpotlight.js";

export default function App() {
  const { reduce } = useMotionPrefs();
  useSpotlight();

  // Show luxury percentage preloader on page load (skipped only if user has OS reduced motion enabled)
  const [ready, setReady] = useState(() => Boolean(reduce));
  const reveal = useCallback(() => setReady(true), []);

  return (
    // reducedMotion="user": Framer drops transform/layout animation for visitors who prefer reduced motion (opacity fades remain).
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <IntroContext.Provider value={ready}>
          {!reduce && <Preloader onReveal={reveal} />}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
          >
            Skip to content
          </a>
          <AmbientBackground />
          <ScrollProgress />
          <Cursor />
          <Navbar />
          <main id="main">
            <Hero />
            <Stats />
            <About />
            <Services />
            <Skills />
            <Projects />
            <CaseStudies />
            <Experience />
            <Contact />
          </main>
          <DurvixAIAssistant />
        </IntroContext.Provider>
      </SmoothScroll>
    </MotionConfig>
  );
}
