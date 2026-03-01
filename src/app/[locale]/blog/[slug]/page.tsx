import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailPageView, buildBlogMetadata, getBlogStaticParams } from "@/app/blog/[slug]/page";
import { defaultLocale, isSupportedLocale, supportedLocales } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const blogParams = getBlogStaticParams();
  return supportedLocales.flatMap((locale) => blogParams.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildBlogMetadata(slug, isSupportedLocale(locale) ? locale : defaultLocale);
}

export default async function LocalizedBlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <BlogDetailPageView slug={slug} locale={locale} />;
}
