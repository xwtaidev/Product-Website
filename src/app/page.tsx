import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getBlogPosts } from "@/lib/blog-posts";
import { defaultLocale, type SupportedLocale, withLocalePath } from "@/lib/i18n";
import { getLocalizedProject, getProjectStatusLabel } from "@/lib/localized-content";
import { projects } from "@/lib/projects";

type HomePageViewProps = {
  locale?: SupportedLocale;
};

type HomeCopy = {
  skipToMain: string;
  roleLabel: string;
  intro: string;
  headline: string[];
  workSelectedProjects: (count: number) => string;
  blogLatestWritings: (count: number) => string;
  viewAll: string;
  caseLabel: string;
  featured: string;
  readArticle: string;
  noBlog: string;
  servicesTitle: string;
  services: Array<{ title: string; description: string }>;
  aboutTitle: string;
  aboutIntro: string;
  approach: Array<{ title: string; detail: string }>;
  contactTitle: string;
  contactHeadline: [string, string];
  contactIntro: string;
};

const socialLinks = [
  { label: "GitHub", href: "https://github.com/xwtaidev" },
  { label: "X(Twitter)", href: "https://x.com/xwtaidev" },
  { label: "Email", href: "mailto:xwtaidev@gmail.com" },
];

const homeCopyByLocale: Record<SupportedLocale, HomeCopy> = {
  "zh-CN": {
    skipToMain: "跳转到主要内容",
    roleLabel: "AI 架构工程师",
    intro:
      "我专注于 AI 系统架构与工程落地，把模型能力、业务流程和生产稳定性放在同一条交付链路里推进。下面是近期案例、技术文章与可协作方向。",
    headline: ["架构并交付", "可落地的 AI 系统", "让能力稳定", "进入真实业务。"],
    workSelectedProjects: (count) => `${count} 个精选项目`,
    blogLatestWritings: (count) => `${count} 篇最新文章`,
    viewAll: "查看全部 →",
    caseLabel: "案例",
    featured: "精选",
    readArticle: "阅读该文章",
    noBlog: "暂无博客内容。",
    servicesTitle: "服务方向",
    services: [
      {
        title: "AI 架构设计",
        description: "从业务目标反推模型、数据、检索与工具链路，设计可演进的 AI 系统架构。",
      },
      {
        title: "LLM 与 Agent 工程",
        description: "围绕 Agent、RAG、提示策略与工作流编排，构建可上线的智能能力闭环。",
      },
      {
        title: "可靠性与安全",
        description: "补齐权限、Secrets、限流、观测与回滚机制，降低 AI 系统在生产环境的风险。",
      },
      {
        title: "AI 交付流水线",
        description: "建立评测基线、发布流程和反馈回路，让 AI 能力从 PoC 稳定走向持续迭代。",
      },
    ],
    aboutTitle: "关于我",
    aboutIntro:
      "我关注 AI 应用中的核心系统路径，擅长把模糊需求转成可验证的架构与工程方案。目标是在更短周期内交付更稳定、可观测、可持续演进的 AI 能力。",
    approach: [
      {
        title: "Architect",
        detail: "先定义系统边界、关键路径和技术取舍，确保方案可落地、可维护。",
      },
      {
        title: "Validate",
        detail: "通过离线评测与灰度验证关键假设，减少模型与流程上线的不确定性。",
      },
      {
        title: "Operate",
        detail: "把有效实践沉淀为 runbook、告警与 SOP，支撑团队规模化运行。",
      },
    ],
    contactTitle: "联系",
    contactHeadline: ["一起搭建", "清晰可持续的系统。"],
    contactIntro:
      "如果你正在搭建 Agent / RAG 系统，或希望重构现有 AI 架构与发布流程，欢迎联系我。我们可以从一次聚焦目标、约束与优先级的技术讨论开始。",
  },
  en: {
    skipToMain: "Skip to main content",
    roleLabel: "AI Architect Engineer",
    intro:
      "I focus on AI system architecture and production delivery, aligning model capability, business workflow, and operational reliability into one execution path.",
    headline: ["Architecting and shipping", "AI systems", "for reliable", "real-world delivery."],
    workSelectedProjects: (count) => `${count} selected projects`,
    blogLatestWritings: (count) => `${count} latest writings`,
    viewAll: "View all →",
    caseLabel: "Case",
    featured: "Featured",
    readArticle: "Read article",
    noBlog: "No blog posts yet.",
    servicesTitle: "Services",
    services: [
      {
        title: "AI Architecture Design",
        description:
          "Design evolvable AI systems by mapping business goals to models, data, retrieval, and tool orchestration.",
      },
      {
        title: "LLM & Agent Engineering",
        description:
          "Build production-grade Agent and RAG workflows with prompt strategy and workflow orchestration.",
      },
      {
        title: "Reliability & Security",
        description:
          "Add guardrails for permissions, secrets, rate limits, observability, and rollback to reduce production risk.",
      },
      {
        title: "AI Delivery Pipeline",
        description:
          "Establish evaluation baselines, release flow, and feedback loops so AI capability can iterate continuously.",
      },
    ],
    aboutTitle: "About",
    aboutIntro:
      "I focus on core system paths in AI products and turn ambiguous requirements into verifiable architecture and engineering plans.",
    approach: [
      {
        title: "Architect",
        detail: "Define system boundaries, critical paths, and tradeoffs first so the solution is buildable and maintainable.",
      },
      {
        title: "Validate",
        detail: "Use offline evaluation and staged rollout to validate key assumptions before broad release.",
      },
      {
        title: "Operate",
        detail: "Convert effective practices into runbooks, alerts, and SOPs for reliable team-scale operations.",
      },
    ],
    contactTitle: "Contact",
    contactHeadline: ["LET'S BUILD", "SOMETHING CLEAR."],
    contactIntro:
      "If you're building an Agent or RAG system, or refactoring an existing AI architecture and release flow, let's talk.",
  },
};

export function HomePageView({ locale = defaultLocale }: HomePageViewProps) {
  const copy = homeCopyByLocale[locale];
  const blogPosts = getBlogPosts();
  const featuredBlogPost = blogPosts[0];
  const sideBlogPosts = blogPosts.slice(1, 4);
  const localizedProjects = projects.map((project) => getLocalizedProject(project, locale));
  const getSideExcerpt = (excerpt: string) => (excerpt.length > 52 ? `${excerpt.slice(0, 52).trimEnd()}...` : excerpt);

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-zinc-100 dark:focus:text-zinc-950"
      >
        {copy.skipToMain}
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader locale={locale} />

      <main id="main-content" className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <section className="fade-up">
          <p className="text-xs tracking-[0.14em] uppercase text-zinc-600 dark:text-zinc-400">{copy.roleLabel}</p>
          <div className="mt-5 space-y-1 text-zinc-950 dark:text-zinc-100">
            {copy.headline.map((line) => (
              <h1
                key={line}
                className="font-display text-4xl leading-none font-semibold tracking-tight sm:text-6xl lg:text-7xl"
              >
                {line}
              </h1>
            ))}
          </div>

          <p className="mt-8 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">{copy.intro}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section id="work" className="mt-20 fade-up" aria-label="Work">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Work.</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">
                {copy.workSelectedProjects(localizedProjects.length)}
              </span>
              <Link
                href={withLocalePath(locale, "/work")}
                className="text-xs tracking-[0.14em] uppercase text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {copy.viewAll}
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {localizedProjects.map((project, index) => (
              <article key={project.slug} className={index === 0 ? "md:col-span-2" : ""}>
                <Link href={withLocalePath(locale, `/projects/${project.slug}`)} className="group block">
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 ${
                      index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"
                    } dark:border-zinc-800`}
                  >
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      priority={index === 0}
                      sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className={`h-full w-full opacity-92 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        project.imageFit === "contain"
                          ? "object-contain bg-zinc-950 p-2 group-hover:scale-[1.01]"
                          : "object-cover group-hover:scale-[1.03]"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                      {getProjectStatusLabel(project.status, locale)}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.category}</p>
                        <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          {project.title}
                        </h3>
                      </div>
                      <span className="text-xs tracking-[0.08em] uppercase text-zinc-100">{copy.caseLabel}</span>
                    </div>
                  </div>
                </Link>

                <p className="mt-4 max-w-[62ch] text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className="mt-20 fade-up" aria-label="Blog">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Blog.</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">
                {copy.blogLatestWritings(blogPosts.length)}
              </span>
              <Link
                href={withLocalePath(locale, "/blog")}
                className="text-xs tracking-[0.14em] uppercase text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {copy.viewAll}
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:h-[40rem] lg:grid-cols-[1.28fr_0.92fr]">
            {featuredBlogPost ? (
              <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/70 lg:h-full">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200 dark:border-zinc-800 lg:h-[53%] lg:aspect-auto">
                  <Image
                    src={featuredBlogPost.coverImage}
                    alt={featuredBlogPost.title}
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    className="h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                    {copy.featured}
                  </div>
                </div>

                <div className="p-6 lg:flex lg:h-[47%] lg:flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                    <span>{featuredBlogPost.category}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span>{featuredBlogPost.publishedAt}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span>{featuredBlogPost.readTime}</span>
                  </div>
                  <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-100">
                    <Link
                      href={withLocalePath(locale, `/blog/${featuredBlogPost.slug}`)}
                      className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {featuredBlogPost.title}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-[64ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">{featuredBlogPost.excerpt}</p>
                  <Link
                    href={withLocalePath(locale, `/blog/${featuredBlogPost.slug}`)}
                    className="mt-6 inline-flex w-fit rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100 lg:mt-auto"
                  >
                    {copy.readArticle}
                  </Link>
                </div>
              </article>
            ) : (
              <article className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 lg:h-full">
                {copy.noBlog}
              </article>
            )}

            <div className="rounded-2xl border border-zinc-200 bg-white/65 divide-y divide-zinc-200/80 dark:border-zinc-800 dark:bg-zinc-900/55 dark:divide-zinc-800/90 lg:flex lg:h-full lg:flex-col">
              {sideBlogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group overflow-hidden px-4 py-3.5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] first:rounded-t-2xl last:rounded-b-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/95 sm:px-5 lg:flex-1 lg:min-h-0"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[124px_1fr] sm:items-start lg:grid-cols-[118px_1fr] lg:items-start lg:gap-3">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 220px, (min-width: 640px) 136px, 100vw"
                        className="h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                        <span>{post.category}</span>
                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                        <span>{post.publishedAt}</span>
                        <span className="text-zinc-300 dark:text-zinc-600">•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-display mt-2 text-lg leading-tight font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        <Link
                          href={withLocalePath(locale, `/blog/${post.slug}`)}
                          className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{getSideExcerpt(post.excerpt)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="mt-20 fade-up">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{copy.servicesTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {copy.services.map((service, index) => (
              <article
                key={service.title}
                className="rounded-2xl border border-zinc-200 bg-white/80 p-6 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-600"
              >
                <p className="text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{service.title}</h3>
                <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="mt-20 fade-up">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{copy.aboutTitle}</h2>
              <p className="mt-6 max-w-[60ch] text-xl leading-9 text-zinc-700 dark:text-zinc-300 sm:text-2xl sm:leading-10">{copy.aboutIntro}</p>
            </div>
            <div className="space-y-4">
              {copy.approach.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="font-display mt-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mt-20 border-t border-zinc-200 pt-12 fade-up dark:border-zinc-800">
          <p className="text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">{copy.contactTitle}</p>
          <h2 className="font-display mt-4 text-4xl leading-none font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-6xl lg:text-7xl">
            {copy.contactHeadline[0]}
            <br />
            {copy.contactHeadline[1]}
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">{copy.contactIntro}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="mailto:xwtaidev@gmail.com"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              xwtaidev@gmail.com
            </a>
            <a
              href="https://github.com/xwtaidev"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
            <a
              href="https://x.com/xwtaidev"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
            >
              X(Twitter)
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.08em] uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} Wayne Xu
      </footer>
    </div>
  );
}

export default function Home() {
  return <HomePageView locale={defaultLocale} />;
}
