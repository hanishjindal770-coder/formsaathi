import { getDict, type Lang } from "@/i18n";

/** WhatsApp / Telegram share links: plain anchors, no scripts, work on every phone. */
export default function ShareButtons({ lang, url, title }: { lang: Lang; url: string; title: string }) {
  const t = getDict(lang).tool;
  const text = `${title} — ${url}`;
  return (
    <section className="my-6 text-center">
      <p className="mb-2 font-semibold">{t.shareTitle}</p>
      <div className="flex justify-center gap-3">
        <a className="btn-secondary" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">
          WhatsApp
        </a>
        <a
          className="btn-secondary"
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener"
        >
          Telegram
        </a>
      </div>
    </section>
  );
}
