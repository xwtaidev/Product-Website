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
