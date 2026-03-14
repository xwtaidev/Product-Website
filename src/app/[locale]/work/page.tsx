import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkMetadata, WorkPageView } from "@/app/work/page";
import { defaultLocale, isSupportedLocale, supportedLocales } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getWorkMetadata(isSupportedLocale(locale) ? locale : defaultLocale);
}

export default async function LocalizedWorkPage({ params }: Props) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <WorkPageView locale={locale} />;
}
