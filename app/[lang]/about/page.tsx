import { LOCALES, type Lang } from "@/i18n";
import InfoPage, { infoMetadata } from "@/components/info/InfoPage";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));
export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  return infoMetadata((await params).lang, "about");
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  return <InfoPage lang={(await params).lang} kind="about" />;
}
