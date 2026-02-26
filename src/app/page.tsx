import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getBlogPosts } from "@/lib/blog-posts";
import { projects } from "@/lib/projects";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/xwtaidev" },
  { label: "X(Twitter)", href: "https://x.com/xwtaidev" },
  { label: "Email", href: "mailto:xwtaidev@gmail.com" },
];

const services = [
  {
    title: "Product Strategy",
    description:
      "定义用户场景、业务目标和验证指标，把方向不清的问题收敛成可执行方案。",
  },
  {
    title: "Experience Design",
    description:
      "设计信息架构和关键交互路径，确保产品在复杂场景下依旧清晰可用。",
  },
  {
    title: "Frontend Delivery",
    description:
      "使用 SwiftUI 与 Next.js 实现高保真界面，建立长期可维护的组件体系。",
  },
  {
    title: "Iteration Systems",
    description:
      "以数据和反馈驱动迭代节奏，让产品优化持续发生而不是一次性交付。",
  },
];

const approach = [
  {
    title: "Define",
    detail: "先明确目标用户和成功指标，避免在错误方向里做高质量执行。",
  },
  {
    title: "Validate",
    detail: "通过低成本原型与快速测试验证关键假设，减少上线风险。",
  },
  {
    title: "Scale",
    detail: "把有效方案沉淀成组件和规则，支撑团队持续迭代。",
  },
];

const headline = [
  "Designing and shipping",
  "digital products",
  "with measurable",
  "business outcomes.",
];

export default function Home() {
  const blogPosts = getBlogPosts();
  const featuredBlogPost = blogPosts[0];
  const sideBlogPosts = blogPosts.slice(1, 4);
  const getSideExcerpt = (excerpt: string) => (excerpt.length > 52 ? `${excerpt.slice(0, 52).trimEnd()}...` : excerpt);

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-zinc-100 dark:focus:text-zinc-950"
      >
        Skip to main content
      </a>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <section className="fade-up">
          <p className="text-xs tracking-[0.14em] uppercase text-zinc-600 dark:text-zinc-400">Product Designer & Frontend Builder</p>
          <div className="mt-5 space-y-1 text-zinc-950 dark:text-zinc-100">
            {headline.map((line) => (
              <h1
                key={line}
                className="font-display text-4xl leading-none font-semibold tracking-tight sm:text-6xl lg:text-7xl"
              >
                {line}
              </h1>
            ))}
          </div>

          <p className="mt-8 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
            我把产品策略、体验设计和前端实现放在同一条链路里推进，聚焦核心路径的用户价值和业务结果。下面是近期的代表项目、服务范围与协作方式。
          </p>

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
              <span className="text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">{projects.length} selected projects</span>
              <Link
                href="/work"
                className="text-xs tracking-[0.14em] uppercase text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                View all →
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <article key={project.slug} className={index === 0 ? "md:col-span-2" : ""}>
                <Link href={`/projects/${project.slug}`} className="group block">
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
                      className="h-full w-full object-cover opacity-92 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                      {project.status}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.category}</p>
                        <h3 className="font-display mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          {project.title}
                        </h3>
                      </div>
                      <span className="text-xs tracking-[0.08em] uppercase text-zinc-100">Case</span>
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
                {blogPosts.length} latest writings
              </span>
              <Link
                href="/blog"
                className="text-xs tracking-[0.14em] uppercase text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                View all →
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
                    Featured
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
                      href={`/blog/${featuredBlogPost.slug}`}
                      className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {featuredBlogPost.title}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-[64ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
                    {featuredBlogPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredBlogPost.slug}`}
                    className="mt-6 inline-flex w-fit rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100 lg:mt-auto"
                  >
                    阅读该文章
                  </Link>
                </div>
              </article>
            ) : (
              <article className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 lg:h-full">
                暂无博客内容。
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
                          href={`/blog/${post.slug}`}
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
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Services.</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {services.map((service, index) => (
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
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">About.</h2>
              <p className="mt-6 max-w-[60ch] text-xl leading-9 text-zinc-700 dark:text-zinc-300 sm:text-2xl sm:leading-10">
                我关注复杂产品中的核心交互路径，擅长把模糊需求转成可验证的设计与工程方案。目标是让团队在更短周期里交付更稳定、可持续演进的体验。
              </p>
            </div>
            <div className="space-y-4">
              {approach.map((item, index) => (
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
          <p className="text-xs tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">Contact.</p>
          <h2 className="font-display mt-4 text-4xl leading-none font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-6xl lg:text-7xl">
            LET&apos;S BUILD
            <br />
            SOMETHING CLEAR.
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
            如果你正在做 0 到 1 产品，或者希望重构关键体验路径，欢迎联系我。我们可以从一次聚焦目标与优先级的讨论开始。
          </p>
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
