import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import WorkJobsBoard, { type WorkJobsCopy } from "@/components/work-jobs-board";
import { defaultLocale, type SupportedLocale } from "@/lib/i18n";
import { getLocalizedProject } from "@/lib/localized-content";
import { projects } from "@/lib/projects";

type WorkPageViewProps = {
  locale?: SupportedLocale;
};

type WorkCopy = {
  title: string;
  description: string;
  board: WorkJobsCopy;
  projectStats: (all: number, launched: number) => [string, string, string];
};

const workCopyByLocale: Record<SupportedLocale, WorkCopy> = {
  "zh-CN": {
    title: "作品",
    description: "作品页：参考 jobs board 交互结构，使用三栏工作台展示每个项目。",
    board: {
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
    board: {
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
        <WorkJobsBoard
          locale={locale}
          copy={copy.board}
          projects={localizedProjects}
          stats={{ totalStat, launchedStat, inProgressStat }}
        />
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
