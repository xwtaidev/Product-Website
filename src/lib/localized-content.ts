import type { Project } from "@/lib/projects";
import type { SupportedLocale } from "@/lib/i18n";

const projectStatusLabels: Record<Project["status"], Record<SupportedLocale, string>> = {
  已上线: {
    "zh-CN": "已上线",
    en: "Launched",
  },
  持续迭代: {
    "zh-CN": "持续迭代",
    en: "Iterating",
  },
  内部使用: {
    "zh-CN": "内部使用",
    en: "Internal",
  },
};

const projectOverrides: Partial<
  Record<
    SupportedLocale,
    Record<
      string,
      Partial<Pick<Project, "summary" | "overview" | "role" | "timeline" | "challenge" | "solution" | "impact" | "outcomes">>
    >
  >
> = {
  en: {
    clawtips: {
      summary:
        "A practical knowledge hub for OpenClaw users, organizing fragmented insights from GitHub Releases, Reddit, and community threads into executable playbooks.",
      overview:
        "Focused on troubleshooting, upgrade migration, and reliability hardening. Community field experience is converted into reusable action entries with commands, validation steps, and rollback points.",
      role: "Product planning + information architecture + content operations",
      timeline: "Q1 2026 - Present",
      challenge:
        "The OpenClaw ecosystem evolves quickly and information is fragmented. High-value practical tips are scattered across release notes and community discussions, making them hard to discover and reproduce.",
      solution: [
        "Standardized every entry with scenario, prerequisites, step-by-step actions, key commands, validation, and rollback points",
        "Aggregated multi-source content from GitHub, Reddit, and more with source URLs for traceability and cross-checking",
        "Applied incremental updates and de-duplication to retain proven historical tips instead of losing them to new updates",
      ],
      impact: [
        "Faster issue triage and troubleshooting",
        "Earlier visibility into upgrade and migration risks",
        "Shorter onboarding loop for new users",
      ],
      outcomes: [
        "Built a practical operations playbook library rather than a generic news feed",
        "Covered high-frequency scenarios: troubleshooting, upgrades, migration, and security/reliability hardening",
        "Provided reusable OpenClaw execution SOPs for individuals and teams",
      ],
    },
    mooddiary: {
      summary:
        "A low-friction mood journaling app: capture daily mood in five levels with optional notes and voice-to-text input.",
      overview:
        "Designed around a lightweight record-and-review loop with three tabs (My Mood / Overview / Settings). The input path supports voice dictation and same-day draft auto-save; the review path offers weekly/monthly mood calendar views with daily record drill-down. Data is primarily stored locally with SwiftData, while CloudKit is off by default and backed by an in-memory fallback configuration.",
      role: "Product design + iOS development + local data architecture",
      timeline: "Q1 2026 - Present",
      challenge:
        "Mood tracking products often lose users after a few days because recording takes too much effort and historical data is hard to revisit meaningfully.",
      solution: [
        "Made five-level mood selection the primary entry point to shorten time-to-record, with notes as an optional step",
        "Added voice-to-text and same-day draft auto-save in My Mood to reduce typing friction and interruption loss",
        "Implemented weekly/monthly mood calendar switching in Overview with per-day detail viewing for trend readability",
        "Used local SwiftData persistence as default, kept CloudKit disabled by default with a manual sync entry, and added an in-memory fallback store configuration",
      ],
      impact: [
        "Lower daily journaling friction",
        "Improved continuity of mood check-ins",
        "Enabled periodic emotional trend review",
      ],
      outcomes: [
        "Delivered a closed loop experience from quick logging to periodic review with controllable sync behavior",
        "Preserved low cognitive load while keeping the core feature set complete",
        "Built a stable data foundation for future insights and personalized reminder features",
      ],
    },
    agentdesk: {
      summary:
        "An operations console for multi-agent systems, unifying queue monitoring, execution traces, retries, and human takeover.",
      overview:
        "Built around observability, replayability, and controllability. A unified timeline links prompts, tool calls, and external API responses, while step-level replay and retry flows help teams locate failures quickly in complex workflows.",
      role: "System architecture + frontend implementation + operations flow design",
      timeline: "Q4 2025 - Q1 2026",
      challenge:
        "When multiple agents run concurrently, failures scatter across prompts, tools, and third-party services, making traditional logs insufficient for fast incident response.",
      solution: [
        "Introduced a unified event model to archive input, reasoning, tool calls, and outputs on a shared timeline",
        "Added step-level replay and retry entry points for both granular and end-to-end reruns",
        "Configured workflow-level alert thresholds and on-call rules to reduce noisy notifications",
      ],
      impact: [
        "Shorter failure diagnosis time",
        "Standardized human intervention workflows",
        "More stable task success rates",
      ],
      outcomes: [
        "Established executable runbooks and on-call SOPs for agent operations",
        "Enabled non-engineering operators to handle first-line troubleshooting",
        "Prepared structured data for future root-cause automation",
      ],
    },
    ragwatch: {
      summary:
        "A continuous quality testing platform for RAG systems, covering retrieval hit rate, citation accuracy, answer consistency, and regression checks.",
      overview:
        "Connected offline evaluation directly to release gates. Any change in knowledge base or retrieval strategy triggers benchmark runs and trend comparisons, helping teams catch degradations before production rollout.",
      role: "Evaluation framework design + data engineering + visualization",
      timeline: "Q1 2026 - Present",
      challenge:
        "RAG failures are often discovered after release, and diagnosis requires checking retrieval, reranking, generation, and citations together, which is costly and slow.",
      solution: [
        "Curated layered benchmark sets and defined dimension-based scoring standards",
        "Automated regression detection for retrieval hit rate, citation coverage, and answer consistency",
        "Integrated quality thresholds into the release pipeline as deployment gates",
      ],
      impact: [
        "Lower release regression risk",
        "Higher answer explainability",
        "Shared quality baseline across teams",
      ],
      outcomes: [
        "Detected most high-risk degradations before launch",
        "Turned static evaluation documents into continuous operational dashboards",
        "Built a reusable RAG iteration and acceptance cadence",
      ],
    },
    signalhub: {
      summary:
        "A social signal intelligence system that aggregates Reddit, X, and forum signals to surface trends, risk narratives, and high-value feedback.",
      overview:
        "Designed with multi-source ingestion, semantic deduplication, and traceable references. Discussions are organized into topic clusters with source links, timestamps, and weighted scores so teams can extract actionable insights from noisy channels.",
      role: "Requirement modeling + data ingestion + backend architecture",
      timeline: "Q3 2025 - Q4 2025",
      challenge:
        "Community conversations are high-volume and repetitive; manual curation is slow and often misses weak early signals and cross-platform links.",
      solution: [
        "Built incremental ingestion and semantic clustering to remove duplicates while preserving key viewpoints",
        "Designed topic heat and risk index models for time-window trend tracking",
        "Added one-click source trace-back in dashboard views for verification",
      ],
      impact: [
        "Faster market feedback cycles",
        "Lower noise in decision input",
        "Higher hit rate for roadmap prioritization",
      ],
      outcomes: [
        "Enabled product teams to prioritize by topic severity and momentum",
        "Shifted sentiment monitoring from reactive to early-stage detection",
        "Accumulated long-term cross-platform user signal assets",
      ],
    },
    pipelineforge: {
      summary:
        "A team-oriented LLM delivery pipeline that standardizes prompt versioning, offline evaluation, canary rollout, and rollback.",
      overview:
        "Elevated model strategy changes from ad-hoc experiments to a traceable release workflow. Every change is linked to version snapshots, evaluation records, and rollout batches, with cross-environment comparison and fast rollback support.",
      role: "Platform planning + backend engineering + DevOps",
      timeline: "Q4 2025 - Q1 2026",
      challenge:
        "Prompt and strategy updates were frequent but lacked a unified release discipline, making experiments hard to reproduce and rollback paths unclear.",
      solution: [
        "Created a strategy version repository with approval flow tied to evaluation outcomes",
        "Implemented canary rollout controls with real-time quality monitoring",
        "Added one-click rollback and incident review templates to speed recovery",
      ],
      impact: [
        "Shorter policy release cycles",
        "Smaller blast radius during release incidents",
        "Better cross-team collaboration efficiency",
      ],
      outcomes: [
        "Achieved auditable, reproducible, and rollback-safe LLM strategy delivery",
        "Clarified ownership boundaries across collaborating teams",
        "Prepared a shared foundation for multi-model parallel release",
      ],
    },
    briefgenie: {
      summary:
        "An automation studio for weekly summaries and project briefs, with multi-source aggregation, structured templates, and human-in-the-loop editing.",
      overview:
        "Focused on a three-step content pipeline: aggregate, generate, and review. The system pulls updates from PM, monitoring, and documentation tools, drafts structured reports, and highlights sections that require manual confirmation.",
      role: "Product design + prompt engineering + frontend development",
      timeline: "Q1 2026 - Present",
      challenge:
        "Weekly reporting draws from multiple tools with inconsistent formats, creating repetitive manual work and frequent omissions of key changes.",
      solution: [
        "Connected multi-source collectors and normalized data into a structured event stream",
        "Built a configurable template engine that adjusts granularity by audience",
        "Added human review flow with diff markers for controllable final output",
      ],
      impact: [
        "Reduced recurring reporting effort",
        "Improved information consistency across teams",
        "Increased stability of report structure and quality",
      ],
      outcomes: [
        "Compressed weekly report production from hours to minutes",
        "Improved visibility of key metrics and risk updates in reports",
        "Established a reusable organization-level content automation workflow",
      ],
    },
    opsbeacon: {
      summary:
        "A unified alert routing and on-call collaboration platform for application, model, and infrastructure incidents.",
      overview:
        "Designed to reduce alert noise while improving response speed. Events are normalized into a single alert model, auto-routed by service severity, and recorded into incident timelines for postmortems.",
      role: "Backend architecture + alert strategy design + operations governance",
      timeline: "Q3 2025 - Q4 2025",
      challenge:
        "Inconsistent rules across monitoring systems caused duplicate alerts, unclear ownership, and notification storms during incidents.",
      solution: [
        "Built a unified alert model and rules engine for multi-source ingestion and standard severity levels",
        "Added mute windows, deduplication, and throttling to suppress noisy alerts",
        "Provided incident timelines and collaboration templates for retrospective optimization",
      ],
      impact: [
        "Lower noisy alert interruptions",
        "Shorter mean time to recovery",
        "Higher on-call collaboration efficiency",
      ],
      outcomes: [
        "Consolidated incident handling into a single operational entry point",
        "Standardized and auditable on-call response paths",
        "Created a continuous improvement loop for monitoring rules",
      ],
    },
    promptlab: {
      summary:
        "A prompt experimentation toolkit for product and model teams with version comparison, A/B tests, and benchmark-based evaluation.",
      overview:
        "Moved prompt tuning from scattered docs into a traceable workflow. Teams compare outputs across versions on shared datasets and use visual diffs to identify quality shifts quickly.",
      role: "Product definition + frontend engineering + evaluation process design",
      timeline: "Q1 2026 - Present",
      challenge:
        "Prompt iterations were manually tracked without shared context, making results hard to align and conclusions difficult to reproduce.",
      solution: [
        "Implemented prompt version trees and side-by-side diff views",
        "Added batch evaluation on fixed benchmark sets with dimension scores",
        "Generated experiment reports with parameter and output snapshots",
      ],
      impact: [
        "Faster strategy iteration",
        "Lower experiment communication overhead",
        "Stronger reproducibility",
      ],
      outcomes: [
        "Shifted iteration discussions from subjective feedback to measurable signals",
        "Improved traceability of prompt changes",
        "Lowered collaboration barriers across roles",
      ],
    },
    vectorgate: {
      summary:
        "A high-availability vector retrieval gateway that manages multi-index routing, tenant isolation, tiered storage, and query auditing.",
      overview:
        "Provides a unified retrieval entry for multiple business lines. Query profiles dynamically choose index strategies while monitoring recall quality, latency, and cost in real time.",
      role: "Backend engineering + architecture governance + performance optimization",
      timeline: "Q4 2025 - Q1 2026",
      challenge:
        "Teams maintained separate retrieval services with inconsistent policies, causing duplicated costs and reliability risks.",
      solution: [
        "Abstracted tenant, index, and access-control models behind a unified gateway",
        "Applied tiered storage and cache strategies to balance cost and latency",
        "Added query audit trails and metrics dashboards for planning and diagnosis",
      ],
      impact: [
        "Reduced repeated infrastructure investment",
        "Stabilized query latency",
        "Improved resource utilization",
      ],
      outcomes: [
        "Upgraded retrieval from project-level capability to platform-level capability",
        "Lowered onboarding cost for new teams",
        "Enabled continuous cost-performance optimization",
      ],
    },
    taskpulse: {
      summary:
        "An automation engine for multi-step workflow orchestration with end-to-end status tracking.",
      overview:
        "Supports full lifecycle automation from trigger to execution and callback via configurable nodes and retry policies, with visual task tracing and compensation flows for failures.",
      role: "Engine design + platform development + operations integration",
      timeline: "Q2 2025 - Q4 2025",
      challenge:
        "Business flows were split across scripts and manual actions, resulting in low visibility, weak recoverability, and high handoff cost.",
      solution: [
        "Designed a workflow DSL and executors with conditional branching and parallel steps",
        "Implemented task state machines with visual tracing and step-level logs",
        "Added compensation and retry queues for robust execution",
      ],
      impact: [
        "Reduced repetitive manual operations",
        "Improved process controllability",
        "Raised completion rates for critical flows",
      ],
      outcomes: [
        "Increased automation coverage across teams",
        "Strengthened failure recovery capability",
        "Created reusable orchestration primitives for multiple domains",
      ],
    },
    "noteflow-ai": {
      summary:
        "An assistant that turns meeting notes, docs, and chats into searchable knowledge cards with auto summaries and action extraction.",
      overview:
        "Built around an input-to-structure experience: unstructured content is segmented into topic cards with source links, enabling quick context recall and iterative editing for long-term knowledge accumulation.",
      role: "Product design + full-stack development + UX optimization",
      timeline: "Q1 2026 - Present",
      challenge:
        "Communication content is produced at high frequency but remains poorly structured, making retrieval and retrospection inefficient.",
      solution: [
        "Implemented content slicing and topic clustering to generate knowledge cards",
        "Combined summarization with action-item extraction to surface executable info",
        "Added source traceability and editing workflows for accuracy and maintainability",
      ],
      impact: [
        "Higher information capture efficiency",
        "Fewer missed action items",
        "Better knowledge reuse across teams",
      ],
      outcomes: [
        "Shifted knowledge management from passive recording to active curation",
        "Improved post-meeting execution alignment",
        "Established a scalable personal/team knowledge base foundation",
      ],
    },
    "guardrail-studio": {
      summary:
        "A policy platform for configuring and testing AI safety guardrails, including sensitive content detection, permission checks, and output constraints.",
      overview:
        "Unifies safety, permission context, and business rules in one policy orchestrator. Supports online replay and hit-path explanations for pre-release risk checks and fast policy tuning.",
      role: "Policy design + backend engineering + compliance integration",
      timeline: "Q4 2025 - Q1 2026",
      challenge:
        "Safety rules were distributed across systems with opaque matching logic, making debugging difficult and slowing release cycles.",
      solution: [
        "Standardized policy definition format with orchestration, priority, and short-circuit support",
        "Added replay and hit-path explanations to diagnose false positives and misses",
        "Integrated policy testing into pre-release checks to reduce production trial-and-error",
      ],
      impact: [
        "Lower high-risk output probability",
        "Better policy explainability",
        "Faster rule iteration cycles",
      ],
      outcomes: [
        "Moved safety policy management from ad-hoc to engineering discipline",
        "Made policy change impact predictable and verifiable",
        "Improved collaboration efficiency between compliance and engineering",
      ],
    },
  },
};

export function getProjectStatusLabel(status: Project["status"], locale: SupportedLocale) {
  return projectStatusLabels[status][locale];
}

export function getLocalizedProject(project: Project, locale: SupportedLocale): Project {
  const override = projectOverrides[locale]?.[project.slug];
  if (!override) {
    return project;
  }

  return {
    ...project,
    ...override,
  };
}
