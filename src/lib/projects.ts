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
  {
    slug: "agentdesk",
    title: "AgentDesk",
    category: "AI Ops Console",
    summary:
      "面向运营团队的 Agent 运行控制台，统一查看任务队列、执行轨迹、失败重试与人工接管，降低多 Agent 协作的可观测性成本。",
    overview:
      "围绕“可观测、可回放、可接管”设计操作中枢。通过事件流时间线串联 Prompt、工具调用和外部 API 响应，并提供失败任务重跑与步骤级回放能力，帮助团队在复杂工作流下快速定位异常。",
    coverImage: "/blog/image_wMRumuk6xe.png",
    imageFit: "cover",
    websiteUrl: "https://example.com/agentdesk",
    tags: ["Agent", "Observability", "Workflow", "Retry", "Ops"],
    impact: ["异常定位时间缩短", "人工介入路径标准化", "任务成功率稳定提升"],
    status: "已上线",
    role: "系统架构 + 前端实现 + 运维流程设计",
    timeline: "2025 Q4 - 2026 Q1",
    challenge:
      "多个 Agent 并发执行时，失败点分散在 Prompt、工具调用和三方服务之间，传统日志难以支撑快速排障与复盘。",
    solution: [
      "建立统一事件模型，将输入、推理、工具调用与输出按时间轴归档",
      "提供步骤级回放和失败重跑入口，支持单步重试与整链路重放",
      "配置按工作流维度的告警阈值与值班规则，减少无效通知",
    ],
    outcomes: [
      "形成可执行的 Agent 运行 runbook 与值班 SOP",
      "运营同学可在不依赖研发的情况下完成基础排障",
      "为后续自动化根因分析打下结构化数据基础",
    ],
  },
  {
    slug: "ragwatch",
    title: "RAGWatch",
    category: "RAG Quality Platform",
    summary:
      "用于持续评估 RAG 系统质量的测试平台，覆盖检索命中、引用准确性、答案一致性与回归检测。",
    overview:
      "将离线评测与发布门禁打通：每次知识库更新或检索策略变更都会触发基准集评测，并生成可比较的趋势面板，帮助团队在上线前识别质量退化。",
    coverImage: "/blog/七个RAG工程应用中的常见故障点.png",
    imageFit: "cover",
    tags: ["RAG", "Evaluation", "Regression", "Retrieval", "Guardrail"],
    impact: ["减少上线回归风险", "提升答案可解释性", "建立质量基线共识"],
    status: "持续迭代",
    role: "评测体系设计 + 数据工程 + 可视化",
    timeline: "2026 Q1 - 至今",
    challenge:
      "RAG 的问题往往在上线后才暴露，且定位需要同时检查召回、重排、生成与引用链路，成本高且响应慢。",
    solution: [
      "沉淀分层评测集（事实问答、长上下文、冲突信息）并定义维度化评分标准",
      "对检索命中率、引用覆盖率与答案一致性建立自动回归检测",
      "把评测结果接入发布流水线，设置质量阈值作为上线门禁",
    ],
    outcomes: [
      "上线前即可发现多数高风险退化项",
      "评测报告从一次性文档转为持续运营面板",
      "团队形成可复用的 RAG 迭代节奏与验收标准",
    ],
  },
  {
    slug: "signalhub",
    title: "SignalHub",
    category: "Social Signal Intelligence",
    summary:
      "聚合 Reddit、X 与社区论坛信号的洞察系统，自动抽取趋势主题、风险舆情和高价值反馈，支持产品与运营决策。",
    overview:
      "以“多源聚合 + 语义去重 + 可追溯引用”为核心。系统按主题簇组织讨论脉络，并保留原始链接、时间与权重评分，帮助团队从噪声中提取可行动的信息。",
    coverImage: "/blog/image_wYSiRVVbj5.png",
    imageFit: "cover",
    websiteUrl: "https://example.com/signalhub",
    tags: ["NLP", "Community", "Trend Analysis", "Dashboard", "Automation"],
    impact: ["缩短市场反馈收集周期", "降低信息噪声干扰", "提升选题与迭代命中率"],
    status: "已上线",
    role: "需求建模 + 数据采集 + 后台架构",
    timeline: "2025 Q3 - 2025 Q4",
    challenge:
      "社区讨论量大且重复度高，人工筛选不仅耗时，还容易错过早期弱信号与跨平台关联信息。",
    solution: [
      "构建增量采集与语义聚类流程，去除重复内容并保留核心观点",
      "设计主题热度与风险指数模型，支持按时间窗追踪变化",
      "在面板中提供一键回溯原文与上下文链接，保证结论可验证",
    ],
    outcomes: [
      "产品团队可按主题优先级快速决策",
      "舆情预警从被动响应转向早期识别",
      "沉淀跨平台用户声音的长期知识资产",
    ],
  },
  {
    slug: "pipelineforge",
    title: "PipelineForge",
    category: "LLM Delivery Pipeline",
    summary:
      "面向团队协作的 LLM 发布流水线，标准化 Prompt 版本管理、离线评测、灰度发布与回滚策略。",
    overview:
      "将模型策略迭代从“手工试验”提升为“可追踪发布流程”。每次变更都有版本快照、评测记录与发布批次，支持跨环境对比和异常快速回滚。",
    coverImage: "/blog/image_Gp9yLtxkMI.png",
    imageFit: "cover",
    tags: ["LLM", "CI/CD", "Evaluation", "Release", "Rollback"],
    impact: ["缩短策略上线周期", "降低发布事故影响面", "提升跨团队协同效率"],
    status: "内部使用",
    role: "平台规划 + 后端开发 + DevOps",
    timeline: "2025 Q4 - 2026 Q1",
    challenge:
      "Prompt 和策略更新频繁，但缺少统一发布规范，导致实验结果不可复现、回滚流程不清晰、协作成本高。",
    solution: [
      "设计策略版本仓与变更审批流，绑定评测结果与发布批次",
      "建立灰度发布机制，支持按流量比例逐步放量并实时监测质量",
      "提供一键回滚与事故复盘模板，缩短故障恢复时间",
    ],
    outcomes: [
      "LLM 策略迭代具备可审计、可复现、可回滚能力",
      "跨团队协作边界清晰，责任链路明确",
      "为后续多模型并行发布提供统一底座",
    ],
  },
  {
    slug: "briefgenie",
    title: "BriefGenie",
    category: "Content Automation Studio",
    summary:
      "自动生成周报与项目简报的内容工作台，支持多数据源汇总、结构化模板输出与人工二次编辑。",
    overview:
      "聚焦“先汇总、再生成、最后审校”的内容生产流程。系统可从项目管理、监控与文档系统抓取关键变更，自动生成初稿并高亮待确认段落，降低团队例行汇报成本。",
    coverImage: "/blog/image_O7SgC-9DND.png",
    imageFit: "cover",
    websiteUrl: "https://example.com/briefgenie",
    tags: ["Automation", "Summarization", "Template", "Reporting", "Workflow"],
    impact: ["减少例行汇报耗时", "提高跨团队信息一致性", "增强输出结构稳定性"],
    status: "持续迭代",
    role: "产品设计 + 提示工程 + 前端开发",
    timeline: "2026 Q1 - 至今",
    challenge:
      "周报内容来自多个系统且格式不统一，人工整理重复劳动重，容易遗漏关键变更并导致沟通偏差。",
    solution: [
      "接入多源数据抓取器并统一为结构化事件流",
      "构建可配置模板引擎，按受众自动调整摘要层级与表述风格",
      "加入人工审校流程与差异标注，确保输出可控可信",
    ],
    outcomes: [
      "将周报生产从小时级压缩到分钟级",
      "关键指标与风险信息在汇报中稳定露出",
      "形成可复用的组织级内容自动化流程",
    ],
  },
  {
    slug: "opsbeacon",
    title: "OpsBeacon",
    category: "Reliability Monitoring",
    summary:
      "统一告警分发与值班协同平台，聚合应用、模型与基础设施告警，提供分级路由、静默窗口与事故时间线。",
    overview:
      "目标是降低告警噪声并提升响应效率。系统将监控事件归一化为统一告警模型，按服务等级自动路由到值班人，并在事故面板中沉淀完整处置时间线与复盘素材。",
    coverImage: "/blog/image_Q2CFbCBspe.png",
    imageFit: "cover",
    tags: ["Observability", "Alerting", "Incident", "SRE", "Ops"],
    impact: ["减少无效告警打扰", "缩短平均恢复时间", "提升值班协同效率"],
    status: "已上线",
    role: "后端架构 + 告警策略设计 + 运营治理",
    timeline: "2025 Q3 - 2025 Q4",
    challenge:
      "多套监控系统规则不一致，导致重复告警、责任不清与通知风暴，值班同学难以快速定位真实故障。",
    solution: [
      "构建统一告警事件模型与规则引擎，支持多源接入和标准化分级",
      "加入静默窗口、去重合并与节流策略，降低告警噪声",
      "提供事故时间线与协作记录模板，支持事后复盘与规则迭代",
    ],
    outcomes: [
      "告警处理流程从分散工具切换到统一入口",
      "值班响应路径标准化并可审计",
      "监控规则进入持续优化闭环",
    ],
  },
  {
    slug: "promptlab",
    title: "PromptLab",
    category: "Prompt Engineering Toolkit",
    summary:
      "面向产品与算法协作的 Prompt 实验平台，支持版本对比、A/B 实验、样例集评估与结果归档。",
    overview:
      "将 Prompt 调优从零散文档迁移到可追踪流程。团队可以基于同一测试集比较多版本输出，并通过可视化差异面板快速识别质量变化与风险点。",
    coverImage: "/blog/image_8soPl6UkVj.png",
    imageFit: "cover",
    tags: ["Prompt", "Experiment", "A/B Test", "LLM", "Evaluation"],
    impact: ["提高策略迭代效率", "降低实验沟通成本", "强化结果可复现性"],
    status: "持续迭代",
    role: "产品定义 + 前端开发 + 评测流程设计",
    timeline: "2026 Q1 - 至今",
    challenge:
      "Prompt 迭代依赖人工记录，缺少统一版本与实验语境，导致结果难对齐、结论难复现。",
    solution: [
      "实现 Prompt 版本树与对比视图，清晰展示改动影响",
      "接入固定样例集进行批量评测并输出维度分数",
      "沉淀实验报告模板，自动记录参数、输入与输出快照",
    ],
    outcomes: [
      "实验讨论从主观描述转向数据对齐",
      "策略迭代节奏更稳定且可追溯",
      "跨角色协作门槛显著降低",
    ],
  },
  {
    slug: "vectorgate",
    title: "VectorGate",
    category: "Knowledge Retrieval Service",
    summary:
      "高可用向量检索网关，统一管理多索引路由、租户隔离、冷热分层与查询审计。",
    overview:
      "为多业务线提供统一检索入口，通过查询画像动态选择索引策略，并对召回质量、延迟与成本进行实时监控，兼顾效果与资源开销。",
    coverImage: "/blog/image_kv6HiU5ENj.png",
    imageFit: "cover",
    tags: ["Vector DB", "Retrieval", "Multi-tenant", "Gateway", "Performance"],
    impact: ["降低检索基础设施重复建设", "稳定查询延迟", "提升资源利用率"],
    status: "内部使用",
    role: "服务端开发 + 架构治理 + 性能优化",
    timeline: "2025 Q4 - 2026 Q1",
    challenge:
      "多团队各自维护检索服务，索引策略与权限模型不统一，带来成本浪费和稳定性风险。",
    solution: [
      "建立统一检索网关并抽象租户、索引与权限模型",
      "引入冷热数据分层与缓存策略，平衡成本与时延",
      "增加查询审计与指标看板，支持容量规划和异常排查",
    ],
    outcomes: [
      "检索能力从项目级资产升级为平台级能力",
      "跨团队接入成本显著下降",
      "性能与成本指标可持续优化",
    ],
  },
  {
    slug: "taskpulse",
    title: "TaskPulse",
    category: "Workflow Orchestration",
    summary:
      "支持多步骤任务编排与状态追踪的自动化引擎，适用于内容生产、客服工单与数据处理场景。",
    overview:
      "通过可配置流程节点与重试策略，实现从触发、执行到回执的全链路自动化。平台提供任务可视化追踪和失败补偿机制，减少人工反复操作。",
    coverImage: "/blog/image_i1iRmH1OvI.png",
    imageFit: "cover",
    websiteUrl: "https://example.com/taskpulse",
    tags: ["Workflow", "Automation", "Queue", "Retry", "Platform"],
    impact: ["减少重复人工操作", "提升流程可控性", "提高任务完成率"],
    status: "已上线",
    role: "流程引擎设计 + 平台开发 + 运维接入",
    timeline: "2025 Q2 - 2025 Q4",
    challenge:
      "业务流程分散在脚本和人工步骤中，状态不可见、失败不可追、交接成本高。",
    solution: [
      "设计流程 DSL 与节点执行器，支持条件分支和并行任务",
      "实现任务状态机与可视化追踪面板，提供步骤级日志",
      "加入失败补偿与重试队列，确保关键流程稳定执行",
    ],
    outcomes: [
      "流程自动化覆盖率持续提升",
      "任务失败恢复能力增强",
      "平台化编排能力可复用于多个业务域",
    ],
  },
  {
    slug: "noteflow-ai",
    title: "NoteFlow AI",
    category: "Knowledge Assistant",
    summary:
      "将会议纪要、文档与聊天记录整理为可检索知识卡片的助手应用，支持自动摘要与行动项提取。",
    overview:
      "以“输入即整理”为核心体验，自动将非结构化内容切分为主题卡片并关联来源，用户可快速回看上下文并继续编辑，逐步形成团队知识资产。",
    coverImage: "/blog/image_nsFtRfav8d.png",
    imageFit: "cover",
    tags: ["Knowledge", "Summarization", "Search", "Productivity", "AI Assistant"],
    impact: ["提高信息沉淀效率", "减少遗漏行动项", "增强团队知识复用"],
    status: "持续迭代",
    role: "产品设计 + 全栈开发 + 体验优化",
    timeline: "2026 Q1 - 至今",
    challenge:
      "会议与沟通内容高频产生但难以结构化沉淀，后续检索和复盘效率低。",
    solution: [
      "实现内容切片与主题聚合流程，自动生成知识卡片",
      "结合摘要与行动项抽取，突出可执行信息",
      "提供来源追溯与二次编辑能力，保证准确性与可维护性",
    ],
    outcomes: [
      "团队知识沉淀从被动记录转为主动管理",
      "会后执行对齐效率明显提升",
      "形成可扩展的个人与团队知识库基座",
    ],
  },
  {
    slug: "guardrail-studio",
    title: "Guardrail Studio",
    category: "AI Safety & Policy",
    summary:
      "用于配置和测试 AI 安全策略的规则平台，支持敏感内容识别、权限校验与输出约束编排。",
    overview:
      "通过策略编排器把内容安全、权限上下文和业务规则统一执行，提供在线回放与策略命中解释，帮助团队在上线前评估风险并快速修正规则。",
    coverImage: "/blog/image_RgnDd9mVe_.png",
    imageFit: "cover",
    tags: ["Safety", "Policy", "Compliance", "Guardrail", "Risk Control"],
    impact: ["降低高风险输出概率", "提升策略可解释性", "缩短规则迭代周期"],
    status: "内部使用",
    role: "策略设计 + 后台开发 + 合规对接",
    timeline: "2025 Q4 - 2026 Q1",
    challenge:
      "安全规则分散在不同系统中，命中逻辑不透明且难调试，影响上线速度与风险控制质量。",
    solution: [
      "统一策略定义格式并支持规则编排、优先级与短路机制",
      "提供请求回放与命中链路解释，便于快速定位误杀或漏拦截",
      "将策略测试纳入发布前检查流程，减少线上试错成本",
    ],
    outcomes: [
      "安全策略从经验驱动转向工程化管理",
      "规则变更影响范围可预测、可验证",
      "合规与研发协作效率提升",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
