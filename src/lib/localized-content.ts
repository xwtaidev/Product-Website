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
