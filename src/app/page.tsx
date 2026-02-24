const projects = [
  {
    title: "WishVault 心愿库",
    summary: "面向个人与家庭的礼物/心愿管理体验，重点优化记录、提醒与共享场景。",
    tags: ["iOS", "SwiftUI", "SwiftData"],
    impact: ["次日留存 +18%", "创建心愿耗时 -37%"],
    href: "#",
    status: "已上线",
  },
  {
    title: "Personal Showcase",
    summary: "一个以案例叙事为核心的个人网站，帮助访客快速理解能力与方法论。",
    tags: ["Next.js", "Tailwind", "SEO"],
    impact: ["首屏加载 < 1.8s", "联系转化 +24%"],
    href: "#",
    status: "持续迭代",
  },
  {
    title: "Design Sprint Kit",
    summary: "将需求澄清、信息架构与视觉规范沉淀为可复用模板，减少团队重复沟通。",
    tags: ["Product", "UX", "System"],
    impact: ["需求对齐周期 -42%", "交付一致性显著提升"],
    href: "#",
    status: "内部使用",
  },
];

const navItems = [
  { label: "项目", href: "#projects" },
  { label: "方法", href: "#process" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

const process = [
  {
    title: "定义问题",
    desc: "明确用户目标、业务约束和成功指标，避免做“看起来很忙”的功能。",
  },
  {
    title: "设计与验证",
    desc: "先低成本验证信息架构与交互路径，再推进视觉细化与原型测试。",
  },
  {
    title: "实现与迭代",
    desc: "与开发共建组件与埋点，发布后持续基于数据和反馈优化。",
  },
];

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

      <main id="main-content">
        <section className="mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-medium text-zinc-500">Product Designer · Builder</p>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                把复杂需求，
                <br className="hidden sm:block" />
                变成可增长的产品体验。
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
                我专注于从 0 到 1 的产品设计与实现，擅长把“模糊目标”拆解为清晰路径，并在真实使用中持续迭代。
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
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
            </div>

            <aside className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <p className="text-sm font-medium text-zinc-500">最近成果</p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                <li>• 3 个产品项目持续维护</li>
                <li>• 平均交付周期缩短 40%+</li>
                <li>• 可访问性默认按 WCAG AA 设计</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="projects" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12" aria-label="项目列表">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">精选项目</h2>
            <span className="text-sm text-zinc-500">{projects.length} 个项目</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
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

                <a
                  href={project.href}
                  className="mt-5 inline-flex text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
                >
                  查看详情
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8" aria-label="工作方法">
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">我的工作方法</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {process.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-500">STEP {index + 1}</p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">关于我</h2>
              <p className="mt-4 text-base leading-8 text-zinc-600">
                我关注用户价值、业务目标与实现成本之间的平衡。习惯先定义成功标准，再对齐路径，最后通过迭代拿到结果。
              </p>
            </div>
            <ul className="space-y-3 rounded-2xl border border-black/5 bg-white p-6 text-sm text-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <li>• Product Strategy / Information Architecture</li>
              <li>• UX Writing / Interaction Design</li>
              <li>• SwiftUI / Next.js Prototype & Delivery</li>
              <li>• Data-informed Iteration</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
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
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} YourName. All rights reserved.
      </footer>
    </div>
  );
}
