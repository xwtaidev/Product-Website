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
  {
    slug: "mooddiary",
    title: "MoodDiary",
    category: "iOS Wellness App",
    summary:
      "一款低负担的心情记录应用：用五档情绪快速打卡，可选备注与语音输入，帮助用户以最少操作完成每日情绪留存。",
    overview:
      "围绕“轻量记录 + 可回看趋势”设计三栏核心结构（My Mood / Overview / Settings）。在单次输入路径上支持语音转文字与当日草稿自动保存，在分析路径上提供周/月情绪日历视图并可回看单日记录；数据层以本地 SwiftData 为主，CloudKit 默认关闭并提供内存存储兜底配置。",
    coverImage: "/projects/mooddiary-cover.svg",
    imageFit: "cover",
    tags: ["SwiftUI", "SwiftData", "Speech to Text", "CloudKit", "iOS"],
    impact: ["降低日记记录负担", "提升每日情绪打卡连续性", "支持周期性情绪回顾"],
    status: "持续迭代",
    role: "产品设计 + iOS 开发 + 本地数据架构",
    timeline: "2026 Q1 - 至今",
    challenge:
      "情绪记录类应用容易在数日后流失，核心问题是记录路径冗长、输入阻力高、回看价值弱，用户难以形成持续使用习惯。",
    solution: [
      "以五档情绪作为主入口，缩短“打开到记录完成”的操作链路，并将备注设为可选步骤",
      "为 My Mood 增加语音转文字输入与当日草稿自动保存，降低输入成本与中断损耗",
      "在 Overview 提供周/月日历切换与单日详情回看，强化情绪变化的可解释性",
      "采用本地 SwiftData 持久化，CloudKit 默认关闭并保留手动同步入口，同时提供内存存储兜底配置",
    ],
    outcomes: [
      "形成“快速记录 - 周期回看 - 设置可控同步”的闭环体验",
      "在保持功能完整度的同时，维持轻量界面与低认知负担",
      "为后续情绪洞察与个性化提醒能力预留稳定数据基础",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
