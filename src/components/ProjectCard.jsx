export function ProjectActions({
  p,
  className = "mt-6 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-4",
  onOpenPreview,
}) {
  const liveUrl = p.liveUrl || p.live;
  const githubUrl = p.githubUrl || p.github;
  const isDownload = Boolean(
    p.isDownload ||
      p.apkUrl ||
      p.downloadUrl ||
      (liveUrl && (liveUrl.endsWith(".apk") || liveUrl.endsWith(".zip") || liveUrl.endsWith(".pdf")))
  );
  const downloadHref = p.apkUrl || p.downloadUrl || liveUrl;
  const downloadName = p.downloadFileName || (downloadHref ? downloadHref.split("/").pop() : "download.apk");

  return (
    <div className={className}>
      {/* Primary Action Button: Opens Live Preview / Architecture Modal */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const shouldOpenDirect = Boolean(
            p.openDirect ||
            (liveUrl && (liveUrl.includes("infinityfreeapp.com") || liveUrl.includes("englishwithmhs.com")))
          );
          if (shouldOpenDirect) {
            window.open(liveUrl, "_blank", "noreferrer");
          } else if (onOpenPreview) {
            onOpenPreview(p);
          } else if (isDownload) {
            window.location.href = downloadHref;
          } else if (liveUrl) {
            window.open(liveUrl, "_blank", "noreferrer");
          }
        }}
        className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-ink shadow-[0_4px_16px_rgba(255,122,26,.24)] transition-all duration-fast hover:scale-[1.02] hover:brightness-110 active:scale-95"
      >
        Live Preview ↗
      </button>

      {/* Direct APK Download for APK items */}
      {isDownload && (
        <a
          href={downloadHref}
          download={downloadName}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-brand-orange/60 bg-brand-orange/10 px-3.5 py-2 text-xs font-bold text-brand-orange transition-all duration-fast hover:scale-[1.02] hover:bg-brand-orange hover:text-ink active:scale-95"
          title={`Download ${downloadName}`}
        >
          Download APK ⇩
        </a>
      )}

      {/* View Code Button */}
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition-all duration-fast hover:scale-[1.02] hover:border-brand-orange/60 hover:bg-white/[0.08] hover:text-brand-orange active:scale-95"
        >
          View Code
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ p, onOpenPreview }) {
  return (
    <article
      onClick={() => onOpenPreview && onOpenPreview(p)}
      className="glass spot flex h-full cursor-pointer flex-col rounded-3xl p-6 sm:p-7 transition-all hover:border-brand-orange/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">{p.category}</span>
        {p.badge && (
          <span className="rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-0.5 text-[11px] font-semibold text-brand-orange shadow-[0_0_12px_rgba(255,122,26,.15)]">
            {p.badge}
          </span>
        )}
      </div>

      <h3 className="mt-3.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{p.title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-300">{p.description}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
            {t}
          </li>
        ))}
      </ul>

      <ProjectActions p={p} onOpenPreview={onOpenPreview} />
    </article>
  );
}
