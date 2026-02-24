export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverImage: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "research-to-decision",
    title: "把用户访谈结果转成可执行的产品决策",
    excerpt:
      "当访谈素材变多时，团队最常见的问题不是信息不够，而是无法把结论收敛为版本策略。本文分享我常用的三步方法。",
    category: "Product Research",
    readTime: "8 min",
    publishedAt: "2026.02.12",
    coverImage: "https://picsum.photos/seed/blog-research-decision/1200/800",
  },
  {
    slug: "swiftui-nextjs-system",
    title: "SwiftUI 与 Next.js 的跨端设计系统同步",
    excerpt:
      "从 Token 命名、组件边界到版本发布流程，如何让移动端与 Web 端在迭代中保持一致且可维护。",
    category: "Design System",
    readTime: "6 min",
    publishedAt: "2026.01.30",
    coverImage: "https://picsum.photos/seed/blog-swiftui-nextjs/1200/800",
  },
  {
    slug: "scope-by-kpi",
    title: "用 KPI 反推 MVP 范围，避免做完才发现方向错误",
    excerpt:
      "在资源有限的阶段，与其讨论功能清单，不如先锚定要影响的指标，再反向定义必须上线的关键路径。",
    category: "Product Strategy",
    readTime: "5 min",
    publishedAt: "2026.01.18",
    coverImage: "https://picsum.photos/seed/blog-scope-kpi/1200/800",
  },
  {
    slug: "delivery-playbook",
    title: "高频迭代团队的交付节奏设计：一份可复用 Playbook",
    excerpt:
      "把探索、设计、开发与复盘拆成可度量的节奏单元，减少返工，并持续提高发布质量与协作效率。",
    category: "Team Workflow",
    readTime: "7 min",
    publishedAt: "2025.12.27",
    coverImage: "https://picsum.photos/seed/blog-delivery-playbook/1200/800",
  },
];
