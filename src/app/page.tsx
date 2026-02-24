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
  "rounded-3xl border border-white/15 bg-white/8 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/30";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070b14] text-zinc-100 selection:bg-cyan-300 selection:text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute top-[35%] -left-10 h-[280px] w-[280px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[260px] w-[260px] rounded-full bg-fuchsia-400/20 blur-3xl" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-zinc-900"
      >
        跳到主要内容
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-sm font-semibold tracking-tight text-white">
            YourName
          </a>
          <nav className="flex items-center gap-4 text-sm text-zinc-300 sm:gap-5" aria-label="主导航">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="pt-12 sm:pt-14 lg:pt-16">
          <div className="grid auto-rows-[minmax(160px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            <article className={`${bentoCard} md:col-span-4 md:row-span-2 bg-gradient-to-br from-cyan-400/15 via-white/5 to-violet-400/15`}>
              <p className="text-sm font-medium text-cyan-100/90">Product Designer · Builder</p>
              <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                不只是展示作品，
                <br className="hidden sm:block" />
                而是展示你如何创造结果。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-200/90 sm:text-lg">
                我专注从 0 到 1 的产品设计与实现，把复杂目标拆解为可验证、可交付、可增长的用户体验。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                >
                  查看项目
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  联系我
                </a>
              </div>
            </article>

            <article className={`${bentoCard} md:col-span-2`}>
              <p className="text-xs font-medium tracking-wide text-zinc-300 uppercase">当前状态</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">3 个活跃项目</p>
              <p className="mt-2 text-sm text-zinc-300">覆盖 iOS 产品、Web 作品集与内部设计流程系统。</p>
            </article>

            <article className={`${bentoCard} md:col-span-2`}>
              <p className="text-xs font-medium tracking-wide text-zinc-300 uppercase">近期结果</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                <li>• 次日留存 <span className="font-semibold text-cyan-200">+18%</span></li>
                <li>• 联系转化 <span className="font-semibold text-cyan-200">+24%</span></li>
                <li>• 对齐周期 <span className="font-semibold text-cyan-200">-42%</span></li>
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" className="pt-14" aria-label="项目列表">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">精选项目</h2>
            <span className="text-sm text-zinc-300">{projects.length} 个项目</span>
          </div>

          <div className="grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={`${bentoCard} ${index === 0 ? "md:col-span-4" : "md:col-span-2"} flex h-full flex-col`}
              >
                <div className="mb-3 inline-flex w-fit rounded-full bg-white/12 px-2.5 py-1 text-xs font-medium text-zinc-100">
                  {project.status}
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-300">{project.summary}</p>

                <div className="mt-4 space-y-1.5 text-xs text-zinc-300">
                  {project.impact.map((item) => (
                    <p key={`${project.title}-${item}`}>{item}</p>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={`${project.title}-${tag}`} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-zinc-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-5 inline-flex text-sm font-medium text-cyan-200 underline-offset-4 hover:underline"
                >
                  查看详情
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="pt-14" aria-label="工作方法">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">我的工作方法</h2>
          </div>
          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            {process.map((step, index) => (
              <article key={step.title} className={`${bentoCard} md:col-span-2`}>
                <p className="text-xs font-medium tracking-wide text-zinc-300 uppercase">STEP {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="pt-14">
          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6 lg:gap-5">
            <article className={`${bentoCard} md:col-span-4`}>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">关于我</h2>
              <p className="mt-4 text-base leading-8 text-zinc-300">
                我关注用户价值、业务目标与实现成本之间的平衡。习惯先定义成功标准，再对齐路径，最后通过迭代拿到结果。
              </p>
            </article>
            <ul className={`${bentoCard} md:col-span-2 space-y-3 text-sm text-zinc-200`}>
              <li>• Product Strategy / IA</li>
              <li>• UX Writing / Interaction</li>
              <li>• SwiftUI / Next.js Delivery</li>
              <li>• Data-informed Iteration</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="pt-14">
          <article className={`${bentoCard} bg-gradient-to-r from-white/10 via-cyan-400/10 to-violet-400/10`}>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">联系我</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-200">欢迎合作、交流或产品讨论。24 小时内回复。</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <a className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900" href="mailto:hello@example.com">
                hello@example.com
              </a>
              <a
                className="rounded-full border border-white/30 px-4 py-2 text-zinc-100 hover:bg-white/15"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="rounded-full border border-white/30 px-4 py-2 text-zinc-100 hover:bg-white/15"
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

      <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} YourName. All rights reserved.
      </footer>
    </div>
  );
}
