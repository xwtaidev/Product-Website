export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  overview: string;
  coverImage: string;
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
    slug: "wishvault",
    title: "WishVault 心愿库",
    category: "iOS Product",
    summary: "面向个人与家庭的礼物/心愿管理体验，重点优化记录、提醒与共享场景。",
    overview:
      "针对“想要但总是忘记”的场景，构建了从心愿采集、状态跟踪到节日提醒的完整闭环，提升持续使用意愿。",
    coverImage: "https://picsum.photos/seed/wishvault-showcase/1200/840",
    tags: ["iOS", "SwiftUI", "SwiftData"],
    impact: ["次日留存 +18%", "创建心愿耗时 -37%"],
    status: "已上线",
    role: "产品设计 + iOS 端实现",
    timeline: "2025 Q1 - 至今",
    challenge: "用户会零散记录愿望，但缺少统一管理与提醒机制，导致信息沉没和错过关键时机。",
    solution: [
      "设计“快速记录 + 标签归类 + 状态追踪”的轻量流程",
      "引入提醒系统与节日节点推荐，降低回访成本",
      "优化家庭共享视图，减少多人协作中的信息重复",
    ],
    outcomes: ["记录转化率显著提升", "分享场景使用率提升", "用户反馈“更有仪式感”"],
  },
  {
    slug: "personal-showcase",
    title: "Personal Showcase",
    category: "Web Platform",
    summary: "一个以案例叙事为核心的个人网站，帮助访客快速理解能力与方法论。",
    overview: "通过“问题-方案-结果”的项目叙事结构重构网站，强化可信度与联系转化。",
    coverImage: "https://picsum.photos/seed/personal-showcase-cover/1200/840",
    tags: ["Next.js", "Tailwind", "SEO"],
    impact: ["首屏加载 < 1.8s", "联系转化 +24%"],
    status: "持续迭代",
    role: "产品策略 + UX + 前端实现",
    timeline: "2025 Q1 - 至今",
    challenge: "访客能看到作品，但难在短时间理解你的方法能力和项目价值。",
    solution: [
      "重构信息架构，突出项目价值与流程方法",
      "增加结果指标与状态标签，提升内容说服力",
      "补齐可访问性与 SEO 基础能力",
    ],
    outcomes: ["跳出率下降", "页面停留时长上升", "合作咨询增长"],
  },
  {
    slug: "design-sprint-kit",
    title: "Design Sprint Kit",
    category: "Design System",
    summary: "将需求澄清、信息架构与视觉规范沉淀为可复用模板，减少团队重复沟通。",
    overview: "为跨职能团队搭建统一的产品冲刺模板，缩短从需求到原型再到交付的链路。",
    coverImage: "https://picsum.photos/seed/sprint-kit-cover/1200/840",
    tags: ["Product", "UX", "System"],
    impact: ["需求对齐周期 -42%", "交付一致性显著提升"],
    status: "内部使用",
    role: "产品负责人 + 设计系统搭建",
    timeline: "2024 Q4 - 2025 Q1",
    challenge: "不同团队对需求定义和设计标准不统一，导致评审成本高、返工频繁。",
    solution: [
      "定义需求澄清模板与统一评审清单",
      "沉淀 IA 和视觉规则为可复用模块",
      "建立版本化协作流程，保证迭代可追踪",
    ],
    outcomes: ["沟通成本显著降低", "返工率下降", "跨团队协作效率提升"],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
