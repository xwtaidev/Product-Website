import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildProjectMetadata,
  getProjectStaticParams,
  ProjectDetailPageView,
} from "@/app/projects/[slug]/page";
import { defaultLocale, isSupportedLocale, supportedLocales } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const projectParams = getProjectStaticParams();
  return supportedLocales.flatMap((locale) => projectParams.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildProjectMetadata(slug, isSupportedLocale(locale) ? locale : defaultLocale);
}

export default async function LocalizedProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <ProjectDetailPageView slug={slug} locale={locale} />;
}
