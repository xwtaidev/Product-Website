"use client";

import type { CSSProperties, PointerEvent } from "react";
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

function normalizeAngle(value: number) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

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
  const rotationTargetRef = useRef(0);
  const tiltTargetRef = useRef(-2);
  const isDraggingRef = useRef(false);
  const movedDuringDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotationRef = useRef(0);
  const [ringRotation, setRingRotation] = useState(0);
  const [ringTilt, setRingTilt] = useState(-2);
  const [viewerSize, setViewerSize] = useState({ width: 0, height: 0 });

  const categoryOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))),
    [projects],
  );
  const roleOptions = useMemo(
    () => Array.from(new Set(projects.map((project) => project.role))),
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
      ),
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
  } as CSSProperties;
  const cylinderProjects = projects;
  const cylinderGeometry = useMemo(() => {
    const width = viewerSize.width || 760;
    const height = viewerSize.height || 700;
    const ratio = 2.17;
    const phoneHFromWidth = Math.min(660, width * 0.78);
    const phoneH = Math.max(320, Math.min(phoneHFromWidth, height * 0.9));
    const phoneW = Math.max(128, phoneH / ratio);
    const radius = Math.max(260, Math.min(760, width * 0.875));
    return { phoneW, phoneH, radius };
  }, [viewerSize.height, viewerSize.width]);

  const cylinderCards = useMemo(() => {
    if (cylinderProjects.length === 0) {
      return [];
    }

    const step = 360 / cylinderProjects.length;
    return cylinderProjects.map((project, index) => {
      const angle = normalizeAngle(index * step + ringRotation);
      const absAngle = Math.abs(angle);

      let scale = 1;
      if (absAngle <= 30) {
        scale = 1 - (absAngle / 30) * 0.04;
      } else if (absAngle <= 60) {
        scale = 0.96 - ((absAngle - 30) / 30) * 0.07;
      } else if (absAngle <= 90) {
        scale = 0.89 - ((absAngle - 60) / 30) * 0.03;
      } else {
        scale = 0.86;
      }

      let brightness = 1;
      if (absAngle <= 30) {
        brightness = 1 - (absAngle / 30) * 0.15;
      } else if (absAngle <= 60) {
        brightness = 0.85 - ((absAngle - 30) / 30) * 0.15;
      } else if (absAngle <= 90) {
        brightness = 0.7 - ((absAngle - 60) / 30) * 0.1;
      } else {
        brightness = 0.6;
      }

      let opacity = 1;
      if (absAngle > 72) {
        opacity = Math.max(0, 1 - (absAngle - 72) / 20);
      }
      if (absAngle > 95) {
        opacity = 0;
      }

      const itemStyle = {
        width: `${cylinderGeometry.phoneW.toFixed(2)}px`,
        height: `${cylinderGeometry.phoneH.toFixed(2)}px`,
        top: `${(-cylinderGeometry.phoneH / 2).toFixed(2)}px`,
        left: `${(-cylinderGeometry.phoneW / 2).toFixed(2)}px`,
        opacity: opacity.toFixed(3),
        transform: `translateX(0px) rotateY(${angle.toFixed(2)}deg) translateZ(${cylinderGeometry.radius.toFixed(2)}px) scale(${scale.toFixed(3)})`,
        filter: `brightness(${brightness.toFixed(3)})`,
        pointerEvents: opacity > 0.04 ? "auto" : "none",
        willChange: "transform, opacity",
      } as CSSProperties;

      return {
        project,
        itemStyle,
        isActive: previewProject?.slug === project.slug,
      };
    });
  }, [cylinderGeometry.phoneH, cylinderGeometry.phoneW, cylinderGeometry.radius, cylinderProjects, previewProject?.slug, ringRotation]);

  useEffect(() => {
    if (!previewProject || cylinderProjects.length === 0 || isDraggingRef.current) {
      return;
    }
    const selectedIndexInCylinder = cylinderProjects.findIndex((project) => project.slug === previewProject.slug);
    if (selectedIndexInCylinder < 0) {
      return;
    }
    const step = 360 / cylinderProjects.length;
    rotationTargetRef.current = -selectedIndexInCylinder * step;
  }, [cylinderProjects, previewProject]);

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

  const handlePreviewPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    movedDuringDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartRotationRef.current = rotationTargetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePreviewPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      movedDuringDragRef.current = true;
    }
    rotationTargetRef.current = dragStartRotationRef.current + deltaX * 0.42;
    tiltTargetRef.current = -2;
  };

  const handlePreviewPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      suppressClickRef.current = movedDuringDragRef.current;
      movedDuringDragRef.current = false;
    }
  };

  const handlePreviewPointerLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      suppressClickRef.current = movedDuringDragRef.current;
      movedDuringDragRef.current = false;
    }
  };

  const handlePreviewCardClick = (slug: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    handleSelectProject(slug);
  };

  useEffect(() => {
    const updateMetrics = () => {
      if (!previewRef.current) {
        return;
      }
      const rect = previewRef.current.getBoundingClientRect();
      setViewerSize({ width: rect.width, height: rect.height });
    };

    updateMetrics();
    const observer = new ResizeObserver(() => updateMetrics());
    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let currentRotation = 0;
    let currentTilt = -2;

    const animate = () => {
      currentRotation += (rotationTargetRef.current - currentRotation) * 0.12;
      currentTilt += (tiltTargetRef.current - currentTilt) * 0.12;
      setRingRotation(currentRotation);
      setRingTilt(currentTilt);

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
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={handlePreviewPointerUp}
              onPointerCancel={handlePreviewPointerUp}
              onPointerLeave={handlePreviewPointerLeave}
            >
              <div className="work-preview-noise" />
              <div className="work-cylinder-viewer">
                <div className="work-cylinder-layer">
                  <div className="work-cylinder-ring" style={{ "--ring-tilt": `${ringTilt.toFixed(2)}deg` } as CSSProperties}>
                    {cylinderCards.map(({ project, itemStyle, isActive }) => (
                      <button
                        key={project.slug}
                        type="button"
                        className={`work-cylinder-post ${isActive ? "is-active" : ""}`}
                        style={itemStyle}
                        onClick={() => handlePreviewCardClick(project.slug)}
                        aria-label={project.title}
                      >
                        <span className="work-cylinder-post-inner">
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            sizes="304px"
                            className={project.imageFit === "contain" ? "object-contain p-4" : "object-cover"}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
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
