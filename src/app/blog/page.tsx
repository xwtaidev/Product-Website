import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import BlogPageContent from "@/components/blog-page-content";
import SiteHeader from "@/components/site-header";
import { getBlogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "文章列表页：围绕 AI 架构、Agent/RAG 工程、系统稳定性与交付流程的实践复盘。",
};

export default function BlogPage() {
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-[100dvh] bg-background text-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-glow hero-glow-top" />
        <div className="hero-glow hero-glow-bottom" />
      </div>

      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-18">
        <section className="fade-up">
          <Link
            href="/"
            className="inline-flex text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← 返回首页
          </Link>
          <p className="mt-4 text-xs tracking-[0.14em] uppercase text-zinc-600 dark:text-zinc-400">Blog List</p>
          <h1 className="font-display mt-4 text-4xl leading-none font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Writing Notes
            <br />
            From Real Delivery.
          </h1>
          <p className="mt-7 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-300">
            这些文章聚焦 AI 工程落地中的真实问题：如何做架构取舍、构建 Agent/RAG 流程、保障生产稳定性，并把结论转化为可执行的下一步。
          </p>
        </section>

        <Suspense fallback={<div className="mt-12 text-sm text-zinc-500 dark:text-zinc-400">Loading blog list...</div>}>
          <BlogPageContent blogPosts={blogPosts} />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-xs tracking-[0.08em] uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        © {new Date().getFullYear()} Wayne Xu
      </footer>
    </div>
  );
}
