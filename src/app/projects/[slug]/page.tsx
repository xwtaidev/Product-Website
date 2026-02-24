import type { Metadata } from "next";
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
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          ← 返回项目列表
        </Link>

        <article className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">{project.status}</span>
            <span className="text-xs text-zinc-500">{project.timeline}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{project.title}</h1>
          <p className="mt-4 text-base leading-8 text-zinc-600">{project.overview}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4">
              <h2 className="text-sm font-semibold tracking-tight">角色</h2>
              <p className="mt-2 text-sm text-zinc-600">{project.role}</p>
            </section>
            <section className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4">
              <h2 className="text-sm font-semibold tracking-tight">核心挑战</h2>
              <p className="mt-2 text-sm text-zinc-600">{project.challenge}</p>
            </section>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight">解决方案</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-600">
              {project.solution.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight">结果与影响</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-600">
              {project.impact.map((item) => (
                <li key={item}>• {item}</li>
              ))}
              {project.outcomes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold tracking-tight">技术标签</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
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
