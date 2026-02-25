import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog-posts";

type Props = {
  params: Promise<{ slug: string }>;
};

const articleBodies: Record<string, string[]> = {
  "research-to-decision": [
    "用户访谈最怕的不是样本少，而是结论散。团队把大量洞察写成文档后，如果没有一个决策结构，最终仍然只能靠经验拍板。",
    "我通常会把访谈结论整理成三层：问题强度（频次+影响）、机会窗口（业务可行动性）、实施成本（时间与依赖）。只有三层都成立的议题，才进入下一版规划。",
    "这样做的好处是，决策讨论从“谁说得更有道理”变成“哪条链路最值得优先解决”，节省跨团队对齐成本。",
  ],
  "swiftui-nextjs-system": [
    "跨端设计系统的关键不是组件长得像，而是语义一致。比如 spacing、radius、text styles 的命名是否能跨端映射，这直接决定维护成本。",
    "我会先定义 token 规则，再处理组件边界：哪些是平台共享语义，哪些是平台特有实现。这样可以避免后期因为“一点点差异”出现大量分叉。",
    "发布上建议采用版本化策略：token 先行，小步更新，组件逐步跟进。每次改动都附带迁移说明，降低团队理解门槛。",
  ],
  "scope-by-kpi": [
    "MVP 范围失控，通常是因为先讨论了功能而不是目标。先定义 KPI，能反向推导哪些路径必须上线、哪些功能可以延后。",
    "例如目标是提升转化率，就优先保证注册/支付路径顺畅；如果目标是留存，就优先打磨首次价值达成与提醒机制。",
    "当每个功能都能明确关联到指标时，取舍会更客观，团队也更容易在有限资源下达成共识。",
  ],
  "delivery-playbook": [
    "高频迭代团队需要的不是更快做事，而是更稳定地做对事。交付节奏必须有固定结构：探索、定义、实现、复盘。",
    "我会为每个阶段设定清晰产物和节奏门槛，例如探索阶段必须输出风险清单，发布阶段必须附带关键指标回看。",
    "这种 playbook 能减少返工，并让新人快速进入同一协作语境。团队规模越大，流程的价值越明显。",
  ],
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "文章不存在" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = articleBodies[slug] ?? [post.excerpt];

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <Link
          href="/blog"
          className="text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to blog
        </Link>

        <article className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white/82 dark:border-zinc-800 dark:bg-zinc-900/72">
          <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
            <Image src={post.coverImage} alt={post.title} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
              {post.category}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
              <span>{post.publishedAt}</span>
              <span className="text-zinc-300 dark:text-zinc-600">•</span>
              <span>{post.readTime}</span>
            </div>

            <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 space-y-5 text-base leading-8 text-zinc-700 dark:text-zinc-300">
              {paragraphs.map((paragraph, index) => (
                <p key={`${post.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.08em] uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} Wayne Xu
      </footer>
    </div>
  );
}
