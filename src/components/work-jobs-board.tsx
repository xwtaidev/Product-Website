"use client";

import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { type SupportedLocale, withLocalePath } from "@/lib/i18n";
import { getProjectStatusLabel } from "@/lib/localized-content";
import type { Project } from "@/lib/projects";

export type WorkJobsCopy = {
  backHome: string;
  boardTag: string;
  boardTitle: string;
  searchPlaceholder: string;
  searchHint: string;
  filterCategory: string;
  filterStatus: string;
  filterRole: string;
  filterStack: string;
  allOption: string;
  openCase: string;
  openCaseMeta: string;
  visitSite: string;
  visitSiteMeta: string;
  challengeLabel: string;
  solutionLabel: string;
  impactLabel: string;
  outcomeLabel: string;
  closeDetail: string;
  clearFilters: string;
  noResultTitle: string;
  noResultHint: string;
  previewLabel: string;
  prev: string;
  next: string;
  readWritings: string;
};

export type WorkJobsStats = {
  totalStat: string;
  launchedStat: string;
  inProgressStat: string;
};

type WorkJobsBoardProps = {
  locale: SupportedLocale;
  copy: WorkJobsCopy;
  stats: WorkJobsStats;
  projects: Project[];
};

type DetailLane = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  external?: boolean;
};

const previewPalettes = [
  ["rgba(197, 183, 157, 0.42)", "rgba(157, 170, 169, 0.31)", "rgba(237, 236, 231, 0.9)"],
  ["rgba(187, 173, 148, 0.37)", "rgba(134, 152, 153, 0.3)", "rgba(236, 235, 229, 0.9)"],
  ["rgba(173, 163, 146, 0.34)", "rgba(133, 145, 161, 0.26)", "rgba(236, 236, 231, 0.88)"],
  ["rgba(178, 168, 149, 0.35)", "rgba(146, 160, 147, 0.28)", "rgba(236, 236, 231, 0.9)"],
] as const;

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function truncateText(value: string, max = 88) {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max).trimEnd()}...`;
}

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <path d="M6 3.5L10.5 8L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function DownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <path d="M4.2 6.2L8 10L11.8 6.2" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <path d="M5.5 4.5H11.5V10.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M11.5 4.5L4.5 11.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

export default function WorkJobsBoard({ locale, copy, stats, projects }: WorkJobsBoardProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "all">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [stackFilter, setStackFilter] = useState("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isHoveringPreviewRef = useRef(false);
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: -10, y: 0, baseY: 0 });

  const categoryOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))).sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const roleOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.role))).sort((a, b) => a.localeCompare(b)),
    [projects],
  );
  const stackOptions = useMemo(
    () =>
      Array.from(
        new Set(
          projects.flatMap((project) =>
            project.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [projects],
  );

  const statusOptions: Array<{ value: Project["status"] | "all"; label: string }> = [
    { value: "all", label: copy.filterStatus },
    { value: "已上线", label: getProjectStatusLabel("已上线", locale) },
    { value: "持续迭代", label: getProjectStatusLabel("持续迭代", locale) },
    { value: "内部使用", label: getProjectStatusLabel("内部使用", locale) },
  ];

  const filteredProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return projects.filter((project) => {
      if (categoryFilter !== "all" && project.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }
      if (roleFilter !== "all" && project.role !== roleFilter) {
        return false;
      }
      if (stackFilter !== "all" && !project.tags.includes(stackFilter)) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const statusText = getProjectStatusLabel(project.status, locale);
      const textPool = [
        project.title,
        project.category,
        project.summary,
        project.overview,
        project.challenge,
        project.role,
        project.tags.join(" "),
        statusText,
      ]
        .join(" ")
        .toLowerCase();

      return textPool.includes(keyword);
    });
  }, [categoryFilter, locale, projects, query, roleFilter, stackFilter, statusFilter]);

  const resolvedActiveSlug = useMemo(() => {
    if (activeSlug && filteredProjects.some((project) => project.slug === activeSlug)) {
      return activeSlug;
    }
    return filteredProjects[0]?.slug ?? null;
  }, [activeSlug, filteredProjects]);

  const selectedProject = useMemo(
    () => filteredProjects.find((project) => project.slug === resolvedActiveSlug) ?? null,
    [filteredProjects, resolvedActiveSlug],
  );

  const previewProject = selectedProject ?? filteredProjects[0] ?? projects[0] ?? null;
  const mode = isDetailOpen && selectedProject ? "detail" : "list";

  const selectedIndex = selectedProject ? filteredProjects.findIndex((project) => project.slug === selectedProject.slug) : -1;
  const canGoPrev = selectedIndex > 0;
  const canGoNext = selectedIndex >= 0 && selectedIndex < filteredProjects.length - 1;

  const detailLanes = useMemo<DetailLane[]>(() => {
    if (!selectedProject) {
      return [];
    }

    const lanes: DetailLane[] = [
      {
        id: `${selectedProject.slug}-case`,
        title: copy.openCase,
        detail: copy.openCaseMeta,
        href: withLocalePath(locale, `/projects/${selectedProject.slug}`),
      },
    ];

    if (selectedProject.websiteUrl) {
      lanes.push({
        id: `${selectedProject.slug}-site`,
        title: copy.visitSite,
        detail: `${copy.visitSiteMeta} · ${getHost(selectedProject.websiteUrl)}`,
        href: selectedProject.websiteUrl,
        external: true,
      });
    }

    lanes.push({
      id: `${selectedProject.slug}-challenge`,
      title: copy.challengeLabel,
      detail: truncateText(selectedProject.challenge),
    });

    selectedProject.solution.slice(0, 2).forEach((item, index) => {
      lanes.push({
        id: `${selectedProject.slug}-solution-${index}`,
        title: `${copy.solutionLabel} ${index + 1}`,
        detail: truncateText(item),
      });
    });

    selectedProject.impact.slice(0, 2).forEach((item, index) => {
      lanes.push({
        id: `${selectedProject.slug}-impact-${index}`,
        title: `${copy.impactLabel} ${index + 1}`,
        detail: truncateText(item),
      });
    });

    selectedProject.outcomes.slice(0, 2).forEach((item, index) => {
      lanes.push({
        id: `${selectedProject.slug}-outcome-${index}`,
        title: `${copy.outcomeLabel} ${index + 1}`,
        detail: truncateText(item),
      });
    });

    return lanes;
  }, [copy, locale, selectedProject]);

  const previewPalette = useMemo(() => {
    if (!previewProject) {
      return previewPalettes[0];
    }
    return previewPalettes[hashString(previewProject.slug) % previewPalettes.length];
  }, [previewProject]);

  const previewStyle = {
    "--work-preview-a": previewPalette[0],
    "--work-preview-b": previewPalette[1],
    "--work-preview-c": previewPalette[2],
    "--cylinder-rot-x": "-10deg",
    "--cylinder-rot-y": "0deg",
  } as CSSProperties;
  const cylinderProjects = projects;

  const listCountLabel = locale === "zh-CN" ? `${filteredProjects.length} 个项目` : `${filteredProjects.length} projects`;
  const laneCountLabel = locale === "zh-CN" ? `${detailLanes.length} 条线索` : `${detailLanes.length} threads`;

  const handleSelectProject = (slug: string) => {
    setActiveSlug(slug);
    setIsDetailOpen(true);
  };

  const handlePrev = () => {
    if (!canGoPrev || selectedIndex <= 0) {
      return;
    }
    const prevProject = filteredProjects[selectedIndex - 1];
    if (!prevProject) {
      return;
    }
    setActiveSlug(prevProject.slug);
    setIsDetailOpen(true);
  };

  const handleNext = () => {
    if (!canGoNext || selectedIndex < 0) {
      return;
    }
    const nextProject = filteredProjects[selectedIndex + 1];
    if (!nextProject) {
      return;
    }
    setActiveSlug(nextProject.slug);
    setIsDetailOpen(true);
  };

  const handleClearFilters = () => {
    setQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setRoleFilter("all");
    setStackFilter("all");
    setIsDetailOpen(false);
  };

  const handlePreviewMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    pointerOffsetRef.current = {
      x: Math.max(-40, Math.min(40, x * 86)),
      y: Math.max(-10, Math.min(10, y * 24)),
    };
  };

  const handlePreviewMouseEnter = () => {
    isHoveringPreviewRef.current = true;
  };

  const handlePreviewMouseLeave = () => {
    isHoveringPreviewRef.current = false;
  };

  useEffect(() => {
    const animate = () => {
      const previewNode = previewRef.current;
      if (previewNode) {
        const rotation = rotationRef.current;

        if (isHoveringPreviewRef.current) {
          rotation.baseY += 0.06;
        } else {
          rotation.baseY += 0.14;
          pointerOffsetRef.current.x *= 0.9;
          pointerOffsetRef.current.y *= 0.9;
        }

        const targetY = rotation.baseY + pointerOffsetRef.current.x;
        const targetX = -10 + pointerOffsetRef.current.y;

        rotation.y += (targetY - rotation.y) * 0.08;
        rotation.x += (targetX - rotation.x) * 0.08;

        previewNode.style.setProperty("--cylinder-rot-y", `${rotation.y.toFixed(2)}deg`);
        previewNode.style.setProperty("--cylinder-rot-x", `${rotation.x.toFixed(2)}deg`);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="fade-up">
      <div className="work-jobs-meta">
        <div className="flex items-center gap-3">
          <Link
            href={withLocalePath(locale, "/")}
            className="text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {copy.backHome}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">{copy.boardTag}</span>
        </div>
        <Link
          href={withLocalePath(locale, "/blog")}
          className="text-xs tracking-[0.12em] uppercase text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {copy.readWritings}
        </Link>
      </div>

      <div className="work-jobs-controls">
        <label className="work-jobs-search">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-zinc-500 dark:text-zinc-400">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12.5 12.5L16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
          />
          <span className="work-jobs-search-hint">{copy.searchHint}</span>
        </label>

        <label className="work-jobs-select">
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">{copy.filterCategory}</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="work-jobs-select-arrow">
            <DownIcon />
          </span>
        </label>

        <label className="work-jobs-select">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as Project["status"] | "all")}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="work-jobs-select-arrow">
            <DownIcon />
          </span>
        </label>

        <label className="work-jobs-select">
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">{copy.filterRole}</option>
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="work-jobs-select-arrow">
            <DownIcon />
          </span>
        </label>

        <label className="work-jobs-select">
          <select value={stackFilter} onChange={(event) => setStackFilter(event.target.value)}>
            <option value="all">{copy.filterStack}</option>
            {stackOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="work-jobs-select-arrow">
            <DownIcon />
          </span>
        </label>
      </div>

      <div className="work-jobs-stats">
        <span>{stats.totalStat}</span>
        <span>{stats.launchedStat}</span>
        <span>{stats.inProgressStat}</span>
      </div>

      <div className="work-jobs-board">
        <div className="work-jobs-grid" data-mode={mode}>
          <aside className="work-jobs-left">
            <header className="work-jobs-header">
              <h2 className="font-display text-xl tracking-tight">{copy.boardTitle}</h2>
              <button
                type="button"
                onClick={() => {
                  if (filteredProjects[0]) {
                    setActiveSlug(filteredProjects[0].slug);
                    setIsDetailOpen(true);
                  }
                }}
                className="work-jobs-plus"
                aria-label={copy.openCase}
              >
                <svg aria-hidden="true" viewBox="0 0 18 18" className="h-4 w-4">
                  <path d="M9 3.5V14.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                  <path d="M3.5 9H14.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="work-jobs-scroll">
              {filteredProjects.map((project, index) => {
                const active = isDetailOpen && project.slug === resolvedActiveSlug;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => handleSelectProject(project.slug)}
                    className={`work-jobs-row ${active ? "is-active" : ""}`}
                    style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
                  >
                    <span className="work-jobs-row-logo">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="30px"
                        className={project.imageFit === "contain" ? "object-contain p-[2px]" : "object-cover"}
                      />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="work-jobs-row-title">{project.title}</span>
                      <span className="work-jobs-row-subtitle">{project.category}</span>
                    </span>
                    <span className="work-jobs-row-arrow" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </button>
                );
              })}

              {filteredProjects.length === 0 ? (
                <div className="work-jobs-empty">
                  <h3>{copy.noResultTitle}</h3>
                  <p>{copy.noResultHint}</p>
                  <button type="button" onClick={handleClearFilters}>
                    {copy.clearFilters}
                  </button>
                </div>
              ) : null}
            </div>

            <footer className="work-jobs-left-footer">
              <span>{listCountLabel}</span>
            </footer>
          </aside>

          <section className="work-jobs-middle">
            <div className="work-jobs-middle-content">
              {selectedProject ? (
                <>
                  <header className="work-jobs-middle-header">
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.1em] uppercase text-zinc-500 dark:text-zinc-400">
                        {getProjectStatusLabel(selectedProject.status, locale)}
                      </p>
                      <h3 className="font-display mt-1 truncate text-[1.35rem] tracking-tight">{selectedProject.title}</h3>
                    </div>
                    <button type="button" onClick={() => setIsDetailOpen(false)} className="work-jobs-esc">
                      {copy.closeDetail}
                    </button>
                  </header>

                  <div className="work-jobs-middle-scroll">
                    <p className="text-base leading-8 text-zinc-700 dark:text-zinc-300">{selectedProject.overview}</p>

                    <ul className="mt-8 space-y-1">
                      {detailLanes.map((lane) => {
                        const laneContent = (
                          <>
                            <span className="min-w-0">
                              <span className="work-jobs-lane-title">{lane.title}</span>
                              <span className="work-jobs-lane-detail">{lane.detail}</span>
                            </span>
                            <span className="work-jobs-lane-arrow" aria-hidden="true">
                              {lane.external ? <ExternalArrowIcon /> : <ArrowIcon />}
                            </span>
                          </>
                        );

                        return (
                          <li key={lane.id}>
                            {lane.href ? (
                              lane.external ? (
                                <a href={lane.href} target="_blank" rel="noreferrer" className="work-jobs-lane">
                                  {laneContent}
                                </a>
                              ) : (
                                <Link href={lane.href} className="work-jobs-lane">
                                  {laneContent}
                                </Link>
                              )
                            ) : (
                              <div className="work-jobs-lane is-static">
                                <span className="min-w-0">
                                  <span className="work-jobs-lane-title">{lane.title}</span>
                                  <span className="work-jobs-lane-detail">{lane.detail}</span>
                                </span>
                                <span className="work-jobs-lane-arrow" aria-hidden="true">
                                  <ArrowIcon />
                                </span>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <footer className="work-jobs-middle-footer">
                    <span>{laneCountLabel}</span>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={handlePrev} disabled={!canGoPrev} className="work-jobs-nav-btn">
                        {copy.prev}
                      </button>
                      <button type="button" onClick={handleNext} disabled={!canGoNext} className="work-jobs-nav-btn">
                        {copy.next}
                      </button>
                    </div>
                  </footer>
                </>
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  {copy.noResultHint}
                </div>
              )}
            </div>
          </section>

          <section className="work-jobs-right">
            <div
              ref={previewRef}
              className="work-jobs-preview"
              style={previewStyle}
              data-mode={mode}
              onMouseMove={handlePreviewMouseMove}
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handlePreviewMouseLeave}
            >
              <div className="work-preview-noise" />
              <div className="work-cylinder-stage">
                <div className="work-cylinder">
                  {cylinderProjects.map((project, index) => {
                    const angle = (360 / cylinderProjects.length) * index;
                    const isActive = previewProject?.slug === project.slug;
                    const itemStyle = { "--item-angle": `${angle}deg` } as CSSProperties;

                    return (
                      <button
                        key={project.slug}
                        type="button"
                        className={`work-cylinder-item ${isActive ? "is-active" : ""}`}
                        style={itemStyle}
                        onClick={() => handleSelectProject(project.slug)}
                        aria-label={project.title}
                      >
                        <span className="work-cylinder-item-inner">
                          <span className="work-cylinder-image-wrap">
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              fill
                              sizes="180px"
                              className={project.imageFit === "contain" ? "object-contain p-2.5" : "object-cover"}
                            />
                          </span>
                          <span className="work-cylinder-title">{project.title}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {previewProject ? (
                <div className="work-preview-meta">
                  <span>{copy.previewLabel}</span>
                  <p>{previewProject.title}</p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
