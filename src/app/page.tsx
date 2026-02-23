const projects = [
  {
    title: "WishVault 心愿库",
    summary: "面向个人与家庭的礼物/心愿管理体验，强调归属、状态与仪式感。",
    tags: ["iOS", "SwiftUI", "SwiftData"],
    href: "#",
  },
  {
    title: "Personal Showcase",
    summary: "一个以内容为中心的个人产品展示网站，突出案例、方法与结果。",
    tags: ["Next.js", "Tailwind", "SEO"],
    href: "#",
  },
  {
    title: "Design Sprint Kit",
    summary: "将需求澄清、信息架构与视觉规范打包成可复用工作流。",
    tags: ["Product", "UX", "System"],
    href: "#",
  },
];

const navItems = [
  { label: "项目", href: "#projects" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-sm font-semibold tracking-tight">
            YourName
          </a>
          <nav className="flex items-center gap-5 text-sm text-zinc-600">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-zinc-900">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-24 lg:pb-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium text-zinc-500">Product Designer · Builder</p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              以简洁的产品体验，
              <br className="hidden sm:block" />
              解决真实问题。
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              我专注于从 0 到 1 的产品设计与实现，擅长将复杂需求拆解为清晰、可落地、可增长的体验。
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
        </section>

        <section id="projects" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">产品项目</h2>
            <span className="text-sm text-zinc-500">{projects.length} 个项目</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
              >
                <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">{project.summary}</p>
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

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">关于我</h2>
              <p className="mt-4 text-base leading-8 text-zinc-600">
                我关注用户需求、业务目标与实现成本之间的平衡。习惯先定义问题，再设计路径，最后通过迭代验证价值。
              </p>
            </div>
            <ul className="space-y-3 rounded-2xl border border-black/5 bg-white p-6 text-sm text-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <li>• Product Strategy / Information Architecture</li>
              <li>• UX Writing / Interaction Design</li>
              <li>• SwiftUI / Next.js Prototype & Delivery</li>
              <li>• Data-driven Iteration</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-4 pt-2 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">联系我</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              欢迎合作、交流或产品讨论。你可以通过以下方式联系我。
            </p>
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
