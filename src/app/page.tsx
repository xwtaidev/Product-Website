import Link from "next/link";
import { projects } from "@/lib/projects";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const process = [
  {
    title: "01 Define",
    desc: "Align user goals, business constraints, and success metrics before proposing any interface.",
  },
  {
    title: "02 Validate",
    desc: "Prototype fast, test key flows early, and keep only what creates measurable value.",
  },
  {
    title: "03 Deliver",
    desc: "Ship with reusable components and iterate through evidence, not assumptions.",
  },
];

const cardBase =
  "rounded-2xl border border-zinc-200 bg-white p-5 transition duration-200 hover:border-zinc-400";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f4f2] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-[#f4f4f2]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="text-sm font-semibold tracking-[0.08em] uppercase">
            YOURNAME
          </a>
          <nav className="flex items-center gap-4 text-xs tracking-[0.08em] uppercase text-zinc-600 sm:gap-5" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-zinc-900">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="pt-10 sm:pt-12">
          <div className="grid auto-rows-[minmax(140px,auto)] gap-3 md:grid-cols-12">
            <article className="rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-zinc-100 md:col-span-8 md:row-span-2">
              <p className="text-xs tracking-[0.08em] uppercase text-zinc-400">Product Design Portfolio</p>
              <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                Structured work.
                <br className="hidden sm:block" />
                Measurable outcomes.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-300">
                I design and build digital products from 0 to 1. The focus is always the same: clear problems,
                practical systems, and results you can track.
              </p>
              <div className="mt-7 flex flex-wrap gap-2 text-xs tracking-[0.08em] uppercase">
                <a href="#projects" className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900">
                  View Projects
                </a>
                <a href="#contact" className="rounded-full border border-white/30 px-4 py-2 text-zinc-200 hover:bg-white/10">
                  Contact
                </a>
              </div>
            </article>

            <article className={`${cardBase} md:col-span-4`}>
              <p className="text-[11px] tracking-[0.08em] uppercase text-zinc-500">Active</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">3 Projects</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">iOS product, portfolio platform, and internal design toolkit.</p>
            </article>

            <article className={`${cardBase} md:col-span-4`}>
              <p className="text-[11px] tracking-[0.08em] uppercase text-zinc-500">Highlights</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>+18% D1 retention</li>
                <li>+24% contact conversion</li>
                <li>-42% requirement alignment time</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" className="pt-12" aria-label="Projects">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Projects Index</h2>
            <span className="text-xs tracking-[0.08em] uppercase text-zinc-500">{projects.length} entries</span>
          </div>

          <div className="grid auto-rows-[minmax(180px,auto)] gap-3 md:grid-cols-12">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className={`${cardBase} ${index === 0 ? "md:col-span-6" : "md:col-span-3"} flex h-full flex-col justify-between`}
              >
                <div>
                  <div className="mb-3 inline-flex w-fit rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] tracking-[0.06em] uppercase text-zinc-600">
                    {project.status}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{project.summary}</p>
                  <div className="mt-3 space-y-1 text-xs text-zinc-500">
                    {project.impact.map((item) => (
                      <p key={`${project.title}-${item}`}>{item}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={`${project.title}-${tag}`} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/projects/${project.slug}`} className="text-xs font-medium tracking-[0.06em] uppercase text-zinc-800 hover:underline">
                    Open
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="pt-12" aria-label="Process">
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Process</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {process.map((step) => (
              <article key={step.title} className={cardBase}>
                <h3 className="text-sm font-semibold tracking-[0.06em] uppercase text-zinc-700">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="pt-12">
          <div className="grid gap-3 md:grid-cols-12">
            <article className={`${cardBase} md:col-span-8`}>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">About</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
                I work across product strategy, UX writing, interaction design, and front-end implementation. My core
                principle is to keep systems simple and outcomes explicit.
              </p>
            </article>
            <ul className={`${cardBase} md:col-span-4 space-y-2 text-sm text-zinc-700`}>
              <li>Product Strategy / IA</li>
              <li>UX Writing / Interaction</li>
              <li>SwiftUI / Next.js Delivery</li>
              <li>Data-informed Iteration</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="pt-12">
          <article className="rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-zinc-100">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Open for collaborations, consulting, and product design projects.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs tracking-[0.06em] uppercase">
              <a className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900" href="mailto:hello@example.com">
                hello@example.com
              </a>
              <a className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10" href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10"
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

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.06em] uppercase text-zinc-500">
        © {new Date().getFullYear()} YourName
      </footer>
    </div>
  );
}
