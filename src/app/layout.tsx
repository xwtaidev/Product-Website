import type { Metadata } from "next";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const storageKey = "theme-preference";
    const storedTheme = window.localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  } catch {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "YourName · 个人产品展示",
    template: "%s | YourName",
  },
  description: "聚焦产品设计与实现的个人作品集：案例、方法与可量化结果。",
  keywords: ["产品设计", "作品集", "UX", "Next.js", "Portfolio"],
  openGraph: {
    title: "YourName · 个人产品展示",
    description: "聚焦产品设计与实现的个人作品集：案例、方法与可量化结果。",
    url: "https://example.com",
    siteName: "Personal Showcase",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourName · 个人产品展示",
    description: "聚焦产品设计与实现的个人作品集：案例、方法与可量化结果。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
