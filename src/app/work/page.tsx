import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import WorkJobsBoard, { type WorkJobsCopy } from "@/components/work-jobs-board";
import { defaultLocale, type SupportedLocale, withLocalePath } from "@/lib/i18n";
import { getLocalizedProject } from "@/lib/localized-content";
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
  board: WorkJobsCopy;
  projectStats: (all: number, launched: number) => [string, string, string];
};

const workCopyByLocale: Record<SupportedLocale, WorkCopy> = {
  "zh-CN": {
    title: "作品",
    description: "作品页：参考 jobs board 交互结构，使用三栏工作台展示每个项目。",
    backHome: "← 返回首页",
    listLabel: "作品列表",
    headline: ["以 Jobs Board 的方式", "浏览项目与案例。"],
    intro:
      "每个项目都对应一个可浏览的“职位卡位”，你可以像筛选招聘信息一样快速查看，并在右侧实时预览与展开细节。",
    board: {
      pageTitle: "Work",
      pageSubtitle: "用 jobs 风格浏览项目，悬停左侧列表即可联动右侧预览并查看完整细节。",
      backHome: "← 返回首页",
      boardTag: "Work Jobs",
      boardTitle: "Work",
      searchPlaceholder: "搜索项目、分类、标签或挑战关键词...",
      searchHint: "CMD + K",
      filterCategory: "Category",
      filterStatus: "Status",
      filterRole: "Role",
      filterStack: "Stack",
      allOption: "全部",
      closeDetail: "ESC",
      clearFilters: "清空筛选",
      noResultTitle: "没有匹配到项目",
      noResultHint: "你可以清空搜索词或切回“全部”状态。",
      openCase: "打开完整案例",
      openCaseMeta: "查看完整上下文与实施细节",
      visitSite: "访问线上站点",
      visitSiteMeta: "外部链接",
      challengeLabel: "挑战与约束",
      solutionLabel: "方案",
      impactLabel: "影响",
      outcomeLabel: "结果",
      previewLabel: "视觉预览",
      prev: "上一个",
      next: "下一个",
      readWritings: "查看文章 →",
    },
    projectStats: (all, launched) => [`${all} 个项目`, `${launched} 个已上线`, `${all - launched} 个进行中 / 内部`],
  },
  en: {
    title: "Work",
    description: "Work page redesigned as a jobs-board workspace with a three-column layout and motion transitions.",
    backHome: "← Back to home",
    listLabel: "Work list",
    headline: ["Browse Work", "In A Jobs Board Flow."],
    intro:
      "Each project is treated like a browsable job entry. Scan quickly, preview on the right, and open the full implementation context.",
    board: {
      pageTitle: "Work",
      pageSubtitle: "Browse projects in a jobs-style board. Hover the list and inspect each case in context.",
      backHome: "← Back to home",
      boardTag: "Work Jobs",
      boardTitle: "Work",
      searchPlaceholder: "Search by project title, category, tags, or challenge...",
      searchHint: "CMD + K",
      filterCategory: "Category",
      filterStatus: "Status",
      filterRole: "Role",
      filterStack: "Stack",
      allOption: "All",
      closeDetail: "ESC",
      clearFilters: "Clear filters",
      noResultTitle: "No projects match the filter",
      noResultHint: "Try clearing the keyword or switching back to All status.",
      openCase: "Open case file",
      openCaseMeta: "Read full context and implementation details",
      visitSite: "Visit live website",
      visitSiteMeta: "External link",
      challengeLabel: "Challenge & constraints",
      solutionLabel: "Solution",
      impactLabel: "Impact",
      outcomeLabel: "Outcome",
      previewLabel: "Visual Preview",
      prev: "Prev",
      next: "Next",
      readWritings: "Read writings →",
    },
    projectStats: (all, launched) => [`${all} projects`, `${launched} launched`, `${all - launched} in progress / internal`],
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
  const launchedCount = projects.filter((project) => project.status === "已上线").length;
  const [totalStat, launchedStat, inProgressStat] = copy.projectStats(localizedProjects.length, launchedCount);

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
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
        </section>

        <div className="mt-12">
          <WorkJobsBoard
            locale={locale}
            copy={copy.board}
            projects={localizedProjects}
            stats={{ totalStat, launchedStat, inProgressStat }}
          />
        </div>
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
