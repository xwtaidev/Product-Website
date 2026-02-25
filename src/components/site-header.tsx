"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

const navItems = [
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

function isActiveNavItem(pathname: string, href: string) {
  if (href === "/work") {
    return pathname === "/work" || pathname.startsWith("/projects/");
  }

  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }

  return false;
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[var(--header-bg)] backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-zinc-950 dark:text-zinc-100"
          onClick={() => setMenuOpen(false)}
        >
          WAYNE XU.
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main navigation" className="font-display hidden items-center gap-1 text-[11px] tracking-[0.12em] uppercase sm:flex">
            {navItems.map((item) => {
              const isActive = isActiveNavItem(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle className="ml-1 sm:ml-3" />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-950 sm:hidden dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-main-nav" className="border-t border-zinc-200/80 px-4 py-3 sm:hidden dark:border-zinc-800/80">
          <nav aria-label="Mobile navigation" className="font-display grid gap-1 text-[11px] tracking-[0.12em] uppercase text-zinc-700 dark:text-zinc-300">
            {navItems.map((item) => {
              const isActive = isActiveNavItem(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-2 py-2.5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                      : "hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
