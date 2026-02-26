"use client";

import { useEffect, useMemo, useState } from "react";

type TocHeading = {
  id: string;
  text: string;
  level: number;
};

type BlogTocProps = {
  headings: TocHeading[];
};

const ACTIVE_OFFSET = 128;

export default function BlogToc({ headings }: BlogTocProps) {
  const tocHeadings = useMemo(
    () => headings.filter((heading) => heading.level >= 2 && heading.level <= 4),
    [headings],
  );
  const [activeId, setActiveId] = useState<string>(tocHeadings[0]?.id ?? "");

  useEffect(() => {
    if (tocHeadings.length === 0) {
      setActiveId("");
      return;
    }

    const updateActiveHeading = () => {
      let currentId = tocHeadings[0].id;

      for (const heading of tocHeadings) {
        const element = document.getElementById(heading.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          currentId = heading.id;
          continue;
        }

        break;
      }

      setActiveId((previousId) => (previousId === currentId ? previousId : currentId));
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [tocHeadings]);

  if (tocHeadings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-zinc-200 bg-white/82 p-4 dark:border-zinc-800 dark:bg-zinc-900/72">
          <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-500 dark:text-zinc-400">On This Page</p>
          <nav aria-label="Table of contents" className="mt-3 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <ol className="space-y-1.5">
              {tocHeadings.map((heading) => {
                const isActive = heading.id === activeId;
                const indentClassName = heading.level === 2 ? "pl-2" : heading.level === 3 ? "pl-5" : "pl-8";
                const itemClassName = isActive
                  ? "border-zinc-900 bg-zinc-100/80 text-zinc-950 dark:border-zinc-100 dark:bg-zinc-800/85 dark:text-zinc-100"
                  : "border-transparent text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100/70 hover:text-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/75 dark:hover:text-zinc-200";

                return (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`block rounded-md border-l-2 py-1.5 pr-2 text-sm leading-6 transition ${indentClassName} ${itemClassName}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </aside>
  );
}
