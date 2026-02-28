import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { getProjectBySlug, projects } from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "项目不存在 | Personal Showcase",
    };
  }

  return {
    title: `${project.title} | Personal Showcase`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader />

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-center gap-3">
            <Link
              href="/work"
              className="inline-flex text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ← Back to work
            </Link>
          </div>

          <article className="mt-6 rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-[0_24px_70px_-42px_rgba(24,24,27,0.55)] sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/75 dark:shadow-[0_30px_80px_-52px_rgba(0,0,0,0.85)]">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 dark:border-zinc-700">
              <div className="relative aspect-[16/8]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className={`h-full w-full opacity-90 ${
                    project.imageFit === "contain" ? "object-contain bg-zinc-950 p-2" : "object-cover"
                  }`}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                {project.status}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.category}</p>
                  <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{project.title}</h1>
                </div>
                <span className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.timeline}</span>
              </div>
            </div>

            <p className="mt-8 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">{project.overview}</p>
            {project.websiteUrl ? (
              <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Website</h2>
                    <p className="mt-2 break-all text-sm leading-7 text-zinc-700 dark:text-zinc-300">{project.websiteUrl}</p>
                  </div>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs tracking-[0.08em] uppercase text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Visit Website ↗
                  </a>
                </div>
              </section>
            ) : null}

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
              <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 md:col-span-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Role</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{project.role}</p>
              </section>
              <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 md:col-span-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Challenge</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{project.challenge}</p>
              </section>
            </div>

            <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Solution</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {project.solution.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Outcome</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {project.impact.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
                {project.outcomes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>

            <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
