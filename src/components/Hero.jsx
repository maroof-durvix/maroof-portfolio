import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Download, Volume2 } from "lucide-react";
import { profile, heroPills } from "../data/portfolioData.js";
import { duration, ease, parallax, stagger } from "../motion/config.js";
import { useIntroReady } from "../motion/IntroContext.jsx";
import { useMedia, useMotionPrefs } from "../motion/useMotionPrefs.js";
import Magnetic from "../motion/Magnetic.jsx";
import SplitText from "../motion/SplitText.jsx";

/**
 * Hero with a one-time intro video.
 *
 * Layouts (see the custom `wide` screen in tailwind.config.js):
 *  - wide  (laptop/desktop landscape): video fills the whole hero, speaker on the right, text on the left.
 *  - other (phones, tablets, portrait): the full 16:9 video frame sits on top and the text goes below,
 *    so nothing is ever cropped, including the final face zoom.
 *
 * Playback: plays ONCE, with sound. Browsers block autoplay-with-sound for first-time visitors, so:
 *  1. we try to play with sound;
 *  2. if the browser refuses, we play it muted, show a subtle "Tap" pill button, and restart it
 *     WITH sound from 0s on the visitor's first click / tap / key press;
 *  3. when it ends, it fades back to the poster (first frame) and does not loop.
 */
export default function Hero() {
  const { reduce, lite } = useMotionPrefs();
  const ready = useIntroReady(); // false while the page-load curtain is up
  const wideLayout = useMedia("(min-width: 1024px) and (min-aspect-ratio: 5/4)");
  const depth = wideLayout && !reduce && !lite; // scroll depth effects: desktop landscape only
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [imageOk, setImageOk] = useState(true);
  const sectionRef = useRef(null);
  const [ended, setEnded] = useState(false);
  const [videoReady, setVideoReady] = useState(false); // true once the video is actually rendering frames
  const [showSoundButton, setShowSoundButton] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", `${parallax.heroVideo * 100}%`]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const unlockedRef = useRef(false);
  const removeListenersRef = useRef(() => { });

  const triggerUnlock = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    removeListenersRef.current();
    setShowSoundButton(false);
    const v = videoRef.current;
    if (!v || v.ended) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => { });
    });
  };

  const handleEnded = () => {
    setEnded(true);
    setShowSoundButton(false);
    removeListenersRef.current();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce || !ready) return undefined;

    let isMounted = true;

    async function start() {
      // Attempt 1: try unmuted playback (succeeds if user interacted previously or browser MEI allows it)
      try {
        video.muted = false;
        video.volume = 1;
        await video.play();
        if (!isMounted) return;
        unlockedRef.current = true;
        setShowSoundButton(false);
        return;
      } catch {
        /* autoplay with sound blocked by browser policy */
      }

      if (!isMounted) return;

      // Attempt 2: play muted (always allowed) and show Tap button
      video.muted = true;
      try {
        await video.play();
      } catch {
        /* ignore */
      }

      if (!isMounted) return;

      setShowSoundButton(true);

      // Listen for first real user gesture: pointerup, touchend, keydown (not touchstart to prevent scroll glitches)
      const events = ["pointerup", "touchend", "keydown"];
      const onGlobalInteraction = () => {
        triggerUnlock();
      };

      events.forEach((e) => window.addEventListener(e, onGlobalInteraction, { passive: true }));
      removeListenersRef.current = () => {
        events.forEach((e) => window.removeEventListener(e, onGlobalInteraction));
      };
    }

    start();

    return () => {
      isMounted = false;
      removeListenersRef.current();
    };
  }, [reduce, ready]);

  // Pause the intro (and its sound) when the hero leaves the viewport or the tab is hidden; resume on return.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || reduce) return undefined;
    let heroVisible = true;
    let pageVisible = !document.hidden;
    const sync = () => {
      if (video.ended) return;
      if (heroVisible && pageVisible) {
        if (video.paused && video.currentTime > 0) video.play().catch(() => { });
      } else if (!video.paused) {
        video.pause();
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.intersectionRatio > 0.25;
        sync();
      },
      { threshold: [0, 0.25, 0.5] }
    );
    io.observe(section);
    const onVis = () => {
      pageVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  // Entrance: waits for the page-load curtain (`ready`), then staggers in using the shared easing/duration.
  const item = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: ready || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: duration.slow, delay: 0.25 + stagger.items * i, ease: ease.out },
  });

  // Speaker sits at ~70% horizontally, vertical 20% ensures face and head have full headroom and are never blocked by navbar
  const fit = "h-full w-full object-cover object-[70%_20%]";
  const showPoster = ended || !videoOk || reduce || !videoReady;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex flex-col overflow-hidden bg-ink pt-24 sm:pt-28 wide:min-h-[100svh] wide:justify-center wide:pt-24"
    >
      {/* ---------- Media & Sound Control ---------- */}
      <div className="relative w-full wide:static">
        <motion.div
          aria-hidden="true"
          style={depth ? { y: videoY, scale: 1.06 } : undefined}
          className={`relative aspect-video w-full overflow-hidden bg-ink wide:absolute wide:inset-0 wide:-z-10 wide:aspect-auto ${depth ? "will-change-transform" : ""}`}
        >
          {videoOk && (
            <video
              ref={videoRef}
              className={`absolute inset-0 ${fit}`}
              src={profile.heroVideo}
              poster={imageOk ? profile.heroImage : undefined}
              playsInline
              disablePictureInPicture
              preload="auto"
              onPlaying={() => setVideoReady(true)}
              onEnded={handleEnded}
              onError={() => setVideoOk(false)}
            />
          )}
          {imageOk && (
            <img
              src={profile.heroImage}
              alt=""
              width={1280}
              height={720}
              decoding="async"
              fetchPriority="high"
              onError={() => setImageOk(false)}
              className={`absolute inset-0 ${fit} transition-opacity duration-slow ${showPoster ? "opacity-100" : "opacity-0"}`}
            />
          )}
          {!videoOk && !imageOk && (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_70%_30%,rgba(47,107,255,.35),transparent_50%),radial-gradient(ellipse_at_30%_80%,rgba(255,122,26,.25),transparent_55%),#0B0F1A]">
              <span className="select-none text-[clamp(6rem,24vw,20rem)] font-black tracking-[-0.08em] text-white/[0.06]">
                {profile.initials}
              </span>
            </div>
          )}

          {/* Readability overlays: left scrim for the text column on wide layout, soft bottom fade into the page on all layouts */}
          <div
            className="pointer-events-none absolute inset-0 hidden wide:block bg-[linear-gradient(90deg,rgba(5,5,5,.88)_0%,rgba(5,5,5,.62)_28%,rgba(5,5,5,.12)_55%,transparent_70%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </motion.div>

        {/* Tap button for sound unlock */}
        <AnimatePresence>
          {showSoundButton && !ended && videoOk && !reduce && (
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerUnlock();
              }}
              aria-label="Tap to play intro with sound"
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25, ease: "easeOut" } }}
              className="group absolute bottom-3 right-3 z-30 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-2 text-xs font-semibold text-white shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-fast hover:scale-[1.04] hover:border-brand-orange hover:bg-black/75 hover:shadow-[0_0_20px_rgba(255,122,26,.3)] focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-2 sm:bottom-4 sm:right-4 sm:min-h-[44px] sm:px-4 sm:text-sm wide:bottom-24 wide:right-7 pointer-events-auto"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
              </span>
              <Volume2 size={16} className="shrink-0 text-brand-orange transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="tracking-wide text-zinc-100">Tap</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Text ---------- */}
      <motion.div
        style={depth ? { y: contentY, opacity: contentOpacity } : undefined}
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 wide:pb-16 wide:pt-0"
      >
        <div className="wide:max-w-xl">
          <motion.span
            {...item(0)}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,.16)] backdrop-blur-md sm:text-xs"
          >
            <span className="h-2 w-2 shrink-0 animate-pulseDot rounded-full bg-emerald-400" />
            {profile.badge}
          </motion.span>

          <SplitText
            as="h1"
            text="Maroof Ahmed Durwesh"
            trigger="mount"
            ready={ready || reduce}
            delay={0.2}
            wordClass={(w) => (w === "Durwesh" ? "text-zinc-300" : "")}
            className="mt-5 break-words text-[clamp(2.1rem,8.5vw,3.6rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,.7)] wide:text-[clamp(2.4rem,4.2vw,4.6rem)]"
          />

          <motion.p
            {...item(2)}
            className="mt-4 text-xs font-bold uppercase leading-relaxed tracking-[0.13em] text-brand-orange [text-shadow:0_2px_16px_rgba(0,0,0,.7)] sm:text-sm"
          >
            {profile.role}
          </motion.p>

          <motion.ul {...item(3)} className="mt-5 flex flex-wrap gap-2">
            {heroPills.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-zinc-100 backdrop-blur-md"
              >
                {pill}
              </li>
            ))}
          </motion.ul>

          <motion.div {...item(4)} className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-ink shadow-[0_8px_30px_rgba(255,122,26,.28)] transition hover:scale-[1.03] hover:brightness-110 active:scale-95"
              >
                View Projects
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resumeUrl || "/MAROOF_AHMED_DURWESH_.pdf"}
                download="MAROOF_AHMED_DURWESH_.pdf"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:scale-[1.03] hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange active:scale-95"
              >
                <Download size={15} className="text-brand-orange" aria-hidden="true" />
                Download CV
              </a>
            </Magnetic>
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-black/40 px-5 py-3 text-sm font-semibold backdrop-blur-md transition hover:scale-[1.03] hover:border-brand-orange hover:text-brand-orange active:scale-95"
              >
                GitHub ↗
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue: wide layout only, fades away as soon as the page moves */}
      {depth && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 wide:flex"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollCue bg-brand-orange" />
          </span>
        </motion.div>
      )}
    </section>
  );
}
