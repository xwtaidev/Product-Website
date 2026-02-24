import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const navItems = [
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[var(--header-bg)] backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-zinc-950 dark:text-zinc-100">
          YOURNAME.
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            aria-label="Main navigation"
            className="font-display flex items-center gap-3 text-[11px] tracking-[0.12em] uppercase text-zinc-600 sm:gap-5 dark:text-zinc-400"
          >
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-zinc-950 dark:hover:text-zinc-100">
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle className="ml-2 sm:ml-3" />
        </div>
      </div>
    </header>
  );
}
