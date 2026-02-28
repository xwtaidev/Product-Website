export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  overview: string;
  coverImage: string;
  imageFit?: "cover" | "contain";
  websiteUrl?: string;
  tags: string[];
  impact: string[];
  status: "已上线" | "持续迭代" | "内部使用";
  role: string;
  timeline: string;
  challenge: string;
  solution: string[];
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "clawtips",
    title: "ClawTips",
    category: "Knowledge Platform",
    summary:
      "面向 OpenClaw 用户的社区实战技巧知识库，把 GitHub Release、Reddit 等渠道的碎片经验整理为可执行 playbook。",
    overview:
      "聚焦排障、升级迁移与稳定性治理，将社区一线经验沉淀为“可复制命令 + 验证步骤 + 风险回滚点”的操作条目，帮助用户更快、更稳地把事做成。",
    coverImage: "/blog/ClawTips.png",
    imageFit: "contain",
    websiteUrl: "https://clawtips.xyz",
    tags: ["OpenClaw", "Runbook", "Knowledge Base", "Community Ops"],
    impact: ["排障定位效率提升", "升级迁移风险前置", "新手上手闭环更短"],
    status: "已上线",
    role: "产品规划 + 信息架构 + 内容运营",
    timeline: "2026 Q1 - 至今",
    challenge:
      "OpenClaw 生态更新快、信息源分散，真实有价值的实操技巧常散落在 Release 说明与社区讨论中，难检索、难复现、难沉淀。",
    solution: [
      "建立统一条目结构：问题场景、前置条件、操作步骤、关键命令、验证方式、风险与回滚点",
      "聚合 GitHub、Reddit 等多源内容并保留 sourceUrl，支持回溯原始语境与交叉核验",
      "采用增量追加与去重策略，尽量保留历史有效技巧，避免知识被更新覆盖",
    ],
    outcomes: [
      "形成偏实战的操作手册库，而非单纯资讯站",
      "覆盖快速排障、版本升级迁移、安全与稳定性加固等高频场景",
      "为个人用户与团队提供可复用的 OpenClaw 执行 SOP",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
