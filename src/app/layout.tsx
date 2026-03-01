import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  title: {
    default: "Wayne Xu · AI 架构工程师",
    template: "%s | Wayne Xu",
  },
  description: "AI 架构工程师个人网站：聚焦 AI 系统架构、实战案例、工程化方法与技术博客。",
  keywords: ["AI架构工程师", "AI系统设计", "LLM", "Agent", "RAG", "OpenClaw", "技术博客", "Portfolio"],
  openGraph: {
    title: "Wayne Xu · AI 架构工程师",
    description: "AI 架构工程师个人网站：聚焦 AI 系统架构、实战案例、工程化方法与技术博客。",
    url: "https://example.com",
    siteName: "Personal Showcase",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wayne Xu · AI 架构工程师",
    description: "AI 架构工程师个人网站：聚焦 AI 系统架构、实战案例、工程化方法与技术博客。",
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
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
