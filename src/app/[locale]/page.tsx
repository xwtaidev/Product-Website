import { notFound } from "next/navigation";
import { HomePageView } from "@/app/page";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <HomePageView locale={locale} />;
}
