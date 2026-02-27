"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogPost } from "@/lib/blog-posts";

type BlogPageContentProps = {
  blogPosts: BlogPost[];
};

export default function BlogPageContent({ blogPosts }: BlogPageContentProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category")?.trim() || "";
  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts;
  const [featuredPost, ...otherPosts] = filteredPosts;
  const categories = [...new Set(blogPosts.map((post) => post.category))];

  return (
    <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.22fr_0.78fr]">
      <div className="space-y-6">
        {featuredPost ? (
          <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white/82 fade-up dark:border-zinc-800 dark:bg-zinc-900/72">
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 860px, 100vw"
                  className="h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/56 via-black/12 to-transparent" />
                <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/20 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-white">
                  Featured Writing
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                  <span>{featuredPost.category}</span>
                  <span className="text-zinc-300 dark:text-zinc-600">•</span>
                  <span>{featuredPost.publishedAt}</span>
                  <span className="text-zinc-300 dark:text-zinc-600">•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">{featuredPost.excerpt}</p>
                <span className="mt-6 inline-flex rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1px] group-hover:border-zinc-500 group-hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:group-hover:border-zinc-500 dark:group-hover:text-zinc-100">
                  Read article
                </span>
              </div>
            </Link>
          </article>
        ) : (
          <article className="rounded-3xl border border-zinc-200 bg-white/82 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/72 dark:text-zinc-300">
            当前分类下暂无文章。
          </article>
        )}

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 divide-y divide-zinc-200/80 fade-up dark:border-zinc-800 dark:bg-zinc-900/58 dark:divide-zinc-800/90">
          {otherPosts.map((post) => (
            <article key={post.slug} className="group p-4 sm:p-5">
              <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 gap-4 sm:grid-cols-[136px_1fr] sm:items-start">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 140px, 100vw"
                    className="h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                    <span>{post.category}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span>{post.publishedAt}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display mt-2 text-lg leading-tight font-semibold tracking-tight text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <aside className="fade-up">
        <div className="lg:sticky lg:top-24 space-y-4">
          <section className="rounded-2xl border border-zinc-200 bg-white/82 p-5 dark:border-zinc-800 dark:bg-zinc-900/72">
            <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Categories</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                  selectedCategory
                    ? "border-zinc-300 bg-zinc-100 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:border-zinc-500"
                    : "border-zinc-900 bg-zinc-900 text-zinc-100 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                }`}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                    selectedCategory === category
                      ? "border-zinc-900 bg-zinc-900 text-zinc-100 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:border-zinc-500"
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/82 p-5 dark:border-zinc-800 dark:bg-zinc-900/72">
            <h2 className="font-display text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">Need Deep Dive</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              如果你想看完整文章或对应项目背景，我可以把这篇内容和相关案例一起发你，方便直接评估是否可复用。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="mailto:xwtaidev@gmail.com"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-100 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                xwtaidev@gmail.com
              </a>
              <Link
                href="/work"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              >
                Browse work
              </Link>
            </div>
          </section>
        </div>
      </aside>
    </section>
  );
}
