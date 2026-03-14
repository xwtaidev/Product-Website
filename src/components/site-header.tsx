"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import {
  defaultLocale,
  getOtherLocale,
  type SupportedLocale,
  switchLocalePath,
  stripLocalePrefix,
  withLocalePath,
} from "@/lib/i18n";

type SiteHeaderProps = {
  locale?: SupportedLocale;
};

function isActiveNavItem(pathname: string, canonicalHref: string) {
  if (canonicalHref === "/work") {
    return pathname === "/work" || pathname.startsWith("/projects/");
  }

  if (canonicalHref === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }

  return false;
}

export default function SiteHeader({ locale = defaultLocale }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const canonicalPathname = stripLocalePrefix(pathname).pathname;
  const targetLocale = getOtherLocale(locale);
  const languageSwitchHref = switchLocalePath(pathname, targetLocale);

  const copy =
    locale === "en"
      ? {
          nav: [
            { label: "Work", canonicalHref: "/work" },
            { label: "Blog", canonicalHref: "/blog" },
            { label: "Services", canonicalHref: "/#services" },
            { label: "About", canonicalHref: "/#about" },
            { label: "Contact", canonicalHref: "/#contact" },
          ],
          openMenu: "Open menu",
          closeMenu: "Close menu",
          menu: "Menu",
          languageText: "简中",
          languageLabel: "Switch language to Chinese",
        }
      : {
          nav: [
            { label: "作品", canonicalHref: "/work" },
            { label: "博客", canonicalHref: "/blog" },
            { label: "服务", canonicalHref: "/#services" },
            { label: "关于", canonicalHref: "/#about" },
            { label: "联系", canonicalHref: "/#contact" },
          ],
          openMenu: "打开菜单",
          closeMenu: "关闭菜单",
          menu: "菜单",
          languageText: "EN",
          languageLabel: "切换到英文",
        };

  const navItems = copy.nav.map((item) => ({
    label: item.label,
    href: withLocalePath(locale, item.canonicalHref),
    canonicalHref: item.canonicalHref,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[var(--header-bg)] backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={withLocalePath(locale, "/")}
          className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-zinc-950 dark:text-zinc-100"
          onClick={() => setMenuOpen(false)}
        >
          WAYNE XU.
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main navigation" className="font-display hidden items-center gap-1 text-[11px] tracking-[0.12em] uppercase sm:flex">
            {navItems.map((item) => {
              const isActive = isActiveNavItem(canonicalPathname, item.canonicalHref);

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

          <Link
            href={languageSwitchHref}
            aria-label={copy.languageLabel}
            className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] tracking-[0.08em] uppercase text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            {copy.languageText}
          </Link>

          <ThemeToggle className="ml-1 sm:ml-3" />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-950 sm:hidden dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">{copy.menu}</span>
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
              const isActive = isActiveNavItem(canonicalPathname, item.canonicalHref);

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
            <Link
              href={languageSwitchHref}
              className="rounded-lg px-2 py-2.5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              onClick={() => setMenuOpen(false)}
            >
              {copy.languageLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
