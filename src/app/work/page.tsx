import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { defaultLocale, type SupportedLocale, withLocalePath } from "@/lib/i18n";
import { getLocalizedProject, getProjectStatusLabel } from "@/lib/localized-content";
import { projects } from "@/lib/projects";

type WorkPageViewProps = {
  locale?: SupportedLocale;
};

type WorkCopy = {
  title: string;
  description: string;
  backHome: string;
  listLabel: string;
  headline: [string, string];
  intro: string;
  projectStats: (all: number, launched: number) => [string, string, string];
  featuredCase: string;
  impact: string;
  allWork: string;
  readWritings: string;
  inProgress: string;
};

const workCopyByLocale: Record<SupportedLocale, WorkCopy> = {
  "zh-CN": {
    title: "作品",
    description: "项目列表页：按 AI 系统目标、约束、架构方案与落地结果浏览完整案例。",
    backHome: "← 返回首页",
    listLabel: "项目列表",
    headline: ["AI 架构案例", "完整上下文可追溯。"],
    intro:
      "这里汇总我近期参与的 AI 工程项目：每个案例都围绕目标、约束、架构设计、实施路径与结果展开，便于快速判断是否与你当前阶段匹配。",
    projectStats: (all, launched) => [`${all} 个项目`, `${launched} 个已上线`, `${all - launched} 个进行中 / 内部`],
    featuredCase: "精选案例",
    impact: "影响",
    allWork: "全部项目",
    readWritings: "查看文章 →",
    inProgress: "进行中 / 内部",
  },
  en: {
    title: "Work",
    description: "Project list with full context: goals, constraints, architecture, and delivery outcomes.",
    backHome: "← Back to home",
    listLabel: "Work list",
    headline: ["AI Architecture Cases", "With Full Context."],
    intro:
      "This page summarizes recent AI engineering projects I worked on. Each case covers goals, constraints, architecture choices, implementation, and outcomes.",
    projectStats: (all, launched) => [`${all} projects`, `${launched} launched`, `${all - launched} in progress / internal`],
    featuredCase: "Featured Case",
    impact: "Impact",
    allWork: "All Work.",
    readWritings: "Read writings →",
    inProgress: "in progress / internal",
  },
};

export function getWorkMetadata(locale: SupportedLocale): Metadata {
  const copy = workCopyByLocale[locale];
  return {
    title: copy.title,
    description: copy.description,
  };
}

export const metadata: Metadata = getWorkMetadata(defaultLocale);

export function WorkPageView({ locale = defaultLocale }: WorkPageViewProps) {
  const copy = workCopyByLocale[locale];
  const localizedProjects = projects.map((project) => getLocalizedProject(project, locale));
  const [featuredProject, ...otherProjects] = localizedProjects;
  const launchedCount = projects.filter((project) => project.status === "已上线").length;
  const [totalStat, launchedStat, inProgressStat] = copy.projectStats(localizedProjects.length, launchedCount);

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <section className="fade-up">
          <Link
            href={withLocalePath(locale, "/")}
            className="inline-flex text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {copy.backHome}
          </Link>
          <p className="mt-4 text-xs tracking-[0.14em] uppercase text-zinc-600 dark:text-zinc-400">{copy.listLabel}</p>
          <h1 className="font-display mt-4 text-4xl leading-none font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            {copy.headline[0]}
            <br />
            {copy.headline[1]}
          </h1>
          <p className="mt-7 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">{copy.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">
            <span>{totalStat}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>{launchedStat}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>{inProgressStat}</span>
          </div>
        </section>

        {featuredProject ? (
          <section className="mt-12 fade-up">
            <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white/82 dark:border-zinc-800 dark:bg-zinc-900/72">
              <Link href={withLocalePath(locale, `/projects/${featuredProject.slug}`)} className="block">
                <div className="relative aspect-[16/8] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={featuredProject.coverImage}
                    alt={featuredProject.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    className={`h-full w-full transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      featuredProject.imageFit === "contain"
                        ? "object-contain bg-zinc-950 p-2 group-hover:scale-[1.01]"
                        : "object-cover group-hover:scale-[1.03]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/16 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                    {copy.featuredCase}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{featuredProject.category}</p>
                      <h2 className="font-display mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        {featuredProject.title}
                      </h2>
                    </div>
                    <span className="text-xs tracking-[0.08em] uppercase text-zinc-100">
                      {getProjectStatusLabel(featuredProject.status, locale)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300">{featuredProject.summary}</p>
                  <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">{copy.impact}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {featuredProject.impact.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          </section>
        ) : null}

        <section className="mt-12 fade-up">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{copy.allWork}</h2>
            <Link
              href={withLocalePath(locale, "/blog")}
              className="text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {copy.readWritings}
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
            {otherProjects.map((project, index) => (
              <article
                key={project.slug}
                className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white/78 dark:border-zinc-800 dark:bg-zinc-900/66 ${
                  index % 2 === 0 ? "md:col-span-7" : "md:col-span-5"
                }`}
              >
                <Link href={withLocalePath(locale, `/projects/${project.slug}`)} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className={`h-full w-full transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        project.imageFit === "contain"
                          ? "object-contain bg-zinc-950 p-2 group-hover:scale-[1.01]"
                          : "object-cover group-hover:scale-[1.03]"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-black/8 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-white">{project.title}</h3>
                      <span className="text-[11px] tracking-[0.08em] uppercase text-zinc-100">
                        {getProjectStatusLabel(project.status, locale)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">{project.category}</p>
                    <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.08em] uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} Wayne Xu
      </footer>
    </div>
  );
}

export default function WorkPage() {
  return <WorkPageView locale={defaultLocale} />;
}
