import { MessageCircle } from "lucide-react";
import { profile } from "../data/portfolioData.js";

export default function WhatsAppWidget() {
  return (
    <aside aria-label="Direct WhatsApp Contact" className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <a
        href={profile.whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat on WhatsApp: ${profile.whatsappDisplay}`}
        className="group relative flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-surface/90 py-2.5 pl-3 pr-4 text-xs font-bold text-white shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-base hover:scale-105 hover:border-emerald-400 hover:bg-emerald-500 hover:text-ink hover:shadow-[0_0_28px_rgba(52,211,153,.45)] active:scale-95"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
        </span>
        <MessageCircle size={18} className="shrink-0 text-emerald-400 transition-colors group-hover:text-ink" aria-hidden="true" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}

