import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="min-h-[100dvh] bg-background px-4 py-8 text-zinc-950 sm:px-6 lg:px-8 lg:py-12">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/#work"
          className="inline-flex text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-900"
        >
          ← Back to work
        </Link>

        <article className="mt-6 rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-[0_24px_70px_-42px_rgba(24,24,27,0.55)] sm:p-10">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900">
            <div className="relative aspect-[16/8]">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
              {project.status}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.category}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{project.title}</h1>
              </div>
              <span className="text-xs tracking-[0.1em] uppercase text-zinc-100/80">{project.timeline}</span>
            </div>
          </div>

          <p className="mt-8 max-w-[68ch] text-base leading-8 text-zinc-600">{project.overview}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
            <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 md:col-span-4">
              <h2 className="text-xs tracking-[0.12em] uppercase text-zinc-500">Role</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-700">{project.role}</p>
            </section>
            <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 md:col-span-8">
              <h2 className="text-xs tracking-[0.12em] uppercase text-zinc-500">Challenge</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-700">{project.challenge}</p>
            </section>
          </div>

          <section className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="text-xs tracking-[0.12em] uppercase text-zinc-500">Solution</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700">
              {project.solution.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="text-xs tracking-[0.12em] uppercase text-zinc-500">Outcome</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-700">
              {project.impact.map((item) => (
                <li key={item}>• {item}</li>
              ))}
              {project.outcomes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-t border-zinc-200 pt-6">
            <h2 className="text-xs tracking-[0.12em] uppercase text-zinc-500">Stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-700">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
