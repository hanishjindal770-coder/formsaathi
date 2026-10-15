import { getDict, type Lang } from "@/i18n";

export default function PrivacyNote({ lang }: { lang: Lang }) {
  return <p className="mt-3 text-center text-sm text-muted">🔒 {getDict(lang).site.privacy}</p>;
}
