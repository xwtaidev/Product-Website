import Link from "next/link";
import { projects } from "@/lib/projects";

const navItems = [
  { label: "项目", href: "#projects" },
  { label: "方法", href: "#process" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

const process = [
  {
    title: "定义问题",
    desc: "明确用户目标、业务约束和成功指标，避免做看起来很忙但不产生价值的功能。",
  },
  {
    title: "设计与验证",
    desc: "先低成本验证信息架构与关键流程，再推进视觉细化与可用性测试。",
  },
  {
    title: "实现与迭代",
    desc: "和开发共建组件与埋点，发布后用数据持续优化体验与转化。",
  },
];

const bentoCard =
  "rounded-3xl border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)]";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        跳到主要内容
      </a>

      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-sm font-semibold tracking-tight">
            YourName
          </a>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 sm:gap-5" aria-label="主导航">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-zinc-900">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="pt-12 sm:pt-14 lg:pt-16">
          <div className="grid auto-rows-[minmax(160px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            <article className={`${bentoCard} md:col-span-4 md:row-span-2`}>
              <p className="text-sm font-medium text-zinc-500">Product Designer · Builder</p>
              <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                用 Bento 风格叙事，
                <br className="hidden sm:block" />
                把你的能力讲得更清楚。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
                我专注于从 0 到 1 的产品设计与实现，把复杂目标拆解为可验证、可交付、可增长的用户体验。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                  查看项目
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
                >
                  联系我
                </a>
              </div>
            </article>

            <article className={`${bentoCard} md:col-span-2`}>
              <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">当前状态</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">3 个活跃项目</p>
              <p className="mt-2 text-sm text-zinc-600">覆盖 iOS 产品、Web 作品集与内部设计流程系统。</p>
            </article>

            <article className={`${bentoCard} md:col-span-2`}>
              <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">近期结果</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• 次日留存 +18%</li>
                <li>• 联系转化 +24%</li>
                <li>• 需求对齐周期 -42%</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" className="pt-14" aria-label="项目列表">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">精选项目</h2>
            <span className="text-sm text-zinc-500">{projects.length} 个项目</span>
          </div>

          <div className="grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={`${bentoCard} ${index === 0 ? "md:col-span-4" : "md:col-span-2"} flex h-full flex-col`}
              >
                <div className="mb-3 inline-flex w-fit rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {project.status}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">{project.summary}</p>

                <div className="mt-4 space-y-1.5 text-xs text-zinc-600">
                  {project.impact.map((item) => (
                    <p key={`${project.title}-${item}`}>{item}</p>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={`${project.title}-${tag}`}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-5 inline-flex text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
                >
                  查看详情
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="pt-14" aria-label="工作方法">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">我的工作方法</h2>
          </div>
          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            {process.map((step, index) => (
              <article key={step.title} className={`${bentoCard} md:col-span-2`}>
                <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">STEP {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="pt-14">
          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            <article className={`${bentoCard} md:col-span-4`}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">关于我</h2>
              <p className="mt-4 text-base leading-8 text-zinc-600">
                我关注用户价值、业务目标与实现成本之间的平衡。习惯先定义成功标准，再对齐路径，最后通过迭代拿到结果。
              </p>
            </article>
            <ul className={`${bentoCard} md:col-span-2 space-y-3 text-sm text-zinc-700`}>
              <li>• Product Strategy / IA</li>
              <li>• UX Writing / Interaction</li>
              <li>• SwiftUI / Next.js Delivery</li>
              <li>• Data-informed Iteration</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="pt-14">
          <article className={bentoCard}>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">联系我</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">欢迎合作、交流或产品讨论。24 小时内回复。</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a className="rounded-full bg-zinc-900 px-4 py-2 text-white" href="mailto:hello@example.com">
                hello@example.com
              </a>
              <a
                className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800 hover:bg-zinc-100"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800 hover:bg-zinc-100"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </article>
        </section>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} YourName. All rights reserved.
      </footer>
    </div>
  );
}
