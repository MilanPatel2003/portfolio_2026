"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  Globe,
  LayoutGrid,
  Layers,
  Maximize2,
  Package,
  PanelLeft,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { SkillJumpButton } from "@/components/ui/skill-jump-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TechBadge, TechIcon } from "@/components/ui/tech-icon";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import {
  projects,
  skillGroups,
  type Project,
  type ProjectCategory,
} from "@/data/data";

type FilterCategory = "All" | ProjectCategory;
type ViewMode = "showcase" | "grid";

const CATEGORIES: FilterCategory[] = [
  "All",
  "AI & SaaS",
  "Full-Stack",
  "Freelance",
  "NPM Library",
  "Frontend & 3D",
];

const KNOWN_SKILLS = new Set(
  skillGroups.flatMap((group) => group.items.map((item) => item.toLowerCase())),
);

function CategoryIcon({ category }: { category: ProjectCategory }) {
  switch (category) {
    case "AI & SaaS":
      return <Sparkles className="h-3.5 w-3.5 text-brand" />;
    case "Full-Stack":
      return <Layers className="h-3.5 w-3.5 text-brand" />;
    case "Freelance":
      return <Globe className="h-3.5 w-3.5 text-brand" />;
    case "NPM Library":
      return <Package className="h-3.5 w-3.5 text-brand" />;
    case "Frontend & 3D":
      return <Box className="h-3.5 w-3.5 text-brand" />;
  }
}

function ProjectTagList({
  tags,
  size = "sm",
}: {
  tags: string[];
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) =>
        KNOWN_SKILLS.has(tag.toLowerCase()) ? (
          <SkillJumpButton key={tag} skill={tag}>
            <TechBadge name={tag} size={size} interactive />
          </SkillJumpButton>
        ) : (
          <TechBadge key={tag} name={tag} size={size} />
        ),
      )}
    </div>
  );
}

function ProjectPreviewImage({
  src,
  alt,
  compact,
}: {
  src: string;
  alt: string;
  compact: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-muted/40"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        sizes={
          compact
            ? "(max-width: 768px) 100vw, 420px"
            : "(max-width: 1024px) 100vw, 680px"
        }
        className={`object-cover object-top transition-[transform,opacity] duration-300 ease-out group-hover/frame:scale-[1.03] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

function ProjectPreviewFrame({
  project,
  compact = false,
  onExpand,
}: {
  project: Project;
  compact?: boolean;
  onExpand?: () => void;
}) {
  const displayUrl = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "local / client-build";

  return (
    <div className="group/frame overflow-hidden border border-border bg-background">
      {/* Browser Address Bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-brand/70" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </span>
        <span className="min-w-0 flex-1 truncate border border-border/70 bg-background/80 px-2 py-0.5 text-[10px]">
          {displayUrl}
        </span>
        {project.previewImage && onExpand && (
          <button
            type="button"
            onClick={onExpand}
            title={`Enlarge ${project.title} preview`}
            aria-label={`Enlarge ${project.title} screenshot`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-brand active:scale-90"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} in new tab`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Visual Canvas */}
      <div className="relative min-h-[215px] w-full overflow-hidden bg-muted/20 sm:aspect-[16/9] sm:min-h-0">
        {project.previewImage ? (
          <>
            <button
              type="button"
              onClick={onExpand}
              aria-label={`Expand ${project.title} screenshot`}
              className="relative block h-full min-h-[215px] w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-brand sm:min-h-0"
            >
              <ProjectPreviewImage
                key={project.previewImage}
                src={project.previewImage}
                alt={`${project.title} preview screenshot`}
                compact={compact}
              />
            </button>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 border border-border bg-background/95 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground opacity-100 shadow-md transition-all duration-200 hover:border-brand hover:text-brand active:scale-95 sm:opacity-0 sm:group-hover/frame:opacity-100"
              >
                <span>Open {project.liveLabel || "Live"}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--brand)_14%,transparent),transparent_60%)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                <Globe className="h-3 w-3" />
                Live Client Website
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {project.period}
              </span>
            </div>

            <div className="my-auto space-y-3">
              <p className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {project.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 border border-border bg-background/90 px-2.5 py-1">
                  <TechIcon name="React" className="h-3.5 w-3.5" />
                  React Frontend
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-brand" />
                <span className="inline-flex items-center gap-1.5 border border-border bg-background/90 px-2.5 py-1">
                  <TechIcon name="Google Sheets API" className="h-3.5 w-3.5" />
                  Sheets API Ops
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-brand" />
                <span className="inline-flex items-center gap-1.5 border border-border bg-background/90 px-2.5 py-1">
                  <TechIcon name="SEO" className="h-3.5 w-3.5" />
                  SEO &amp; Workflows
                </span>
              </div>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 font-mono text-xs font-medium text-brand hover:underline"
              >
                <span>Visit innovateaccountingsolutions.com</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("showcase");
  const [activeTitle, setActiveTitle] = useState<string>(projects[0].title);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const mobileChipsRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    const onSelectProject = (event: CustomEvent<{ title?: string }>) => {
      const target = event.detail?.title;
      if (!target || !projects.some((p) => p.title === target)) return;
      setViewMode("showcase");
      setSelectedCategory("All");
      setActiveTitle(target);
    };
    window.addEventListener(
      "portfolio:select-project",
      onSelectProject as EventListener,
    );
    return () =>
      window.removeEventListener(
        "portfolio:select-project",
        onSelectProject as EventListener,
      );
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (viewMode !== "showcase") return;
    const container = mobileChipsRef.current;
    if (!container) return;
    const activeChip = container.querySelector<HTMLElement>(
      '[aria-current="true"]',
    );
    activeChip?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTitle, viewMode]);

  const visibleProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const activeIndex = Math.max(
    0,
    visibleProjects.findIndex((p) => p.title === activeTitle),
  );
  const currentProject = visibleProjects[activeIndex] ?? visibleProjects[0];

  const countFor = (cat: FilterCategory) =>
    cat === "All"
      ? projects.length
      : projects.filter((p) => p.category === cat).length;

  function stepProject(delta: number) {
    if (visibleProjects.length === 0) return;
    const nextIdx =
      (activeIndex + delta + visibleProjects.length) % visibleProjects.length;
    setActiveTitle(visibleProjects[nextIdx].title);
  }

  function inspectInShowcase(title: string) {
    setActiveTitle(title);
    setViewMode("showcase");
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <WorkspaceFile
      id="projects"
      title="Projects"
      filename={`projects.ts (${visibleProjects.length})`}
      type="TS"
      action={
        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {/* Category Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-visible sm:pb-0"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    const nextList =
                      category === "All"
                        ? projects
                        : projects.filter((p) => p.category === category);
                    if (
                      nextList.length > 0 &&
                      !nextList.some((p) => p.title === activeTitle)
                    ) {
                      setActiveTitle(nextList[0].title);
                    }
                  }}
                  className={`shrink-0 border px-2.5 py-1.5 font-mono text-[11px] transition-all duration-150 active:scale-95 sm:px-2 sm:py-1 ${
                    active
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  {category}{" "}
                  <span className="text-[9px] opacity-70">
                    ({countFor(category)})
                  </span>
                </button>
              );
            })}
          </div>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-border sm:inline-block"
          />

          {/* Showcase / Grid Mode Toggle */}
          <div
            role="group"
            aria-label="Project layout mode"
            className="inline-flex border border-border bg-background p-0.5 font-mono text-[11px]"
          >
            <button
              type="button"
              onClick={() => setViewMode("showcase")}
              aria-pressed={viewMode === "showcase"}
              className={`inline-flex items-center gap-1 px-2 py-0.5 transition-all duration-150 active:scale-95 ${
                viewMode === "showcase"
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PanelLeft className="h-3 w-3 text-brand" />
              <span>Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`inline-flex items-center gap-1 px-2 py-0.5 transition-all duration-150 active:scale-95 ${
                viewMode === "grid"
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3 w-3 text-brand" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      }
    >
      {viewMode === "showcase" && currentProject ? (
        <div
          key="showcase"
          className="grid grid-cols-1 divide-y divide-border animate-in fade-in-0 duration-200 lg:grid-cols-12 lg:divide-x lg:divide-y-0"
        >
          {/* Desktop Left Index Rail */}
          <div
            className="hidden flex-col justify-between lg:col-span-5 lg:flex"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                stepProject(1);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                stepProject(-1);
              }
            }}
          >
            <div className="divide-y divide-border/70">
              {visibleProjects.map((project, index) => {
                const isActive = project.title === currentProject.title;
                return (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => setActiveTitle(project.title)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group/item relative flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.99] focus-visible:outline-1 focus-visible:outline-brand sm:px-5 ${
                      isActive ? "bg-brand/8" : "hover:bg-muted/30"
                    }`}
                  >
                    {/* Animated active left bar */}
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 bottom-0 left-0 w-[3px] origin-center bg-brand transition-transform duration-200 ${
                        isActive ? "scale-y-100" : "scale-y-0"
                      }`}
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span
                          className={
                            isActive
                              ? "font-bold text-brand"
                              : "text-muted-foreground"
                          }
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <CategoryIcon category={project.category} />
                        <span className="text-muted-foreground">
                          {project.category}
                        </span>
                        {project.featured && (
                          <Star
                            aria-label="Featured"
                            className="h-3 w-3 fill-brand text-brand"
                          />
                        )}
                      </div>

                      <p
                        className={`font-display text-sm font-bold tracking-tight transition-colors sm:text-base ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground/85 group-hover/item:text-foreground"
                        }`}
                      >
                        {project.title}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5 font-mono text-[11px] text-muted-foreground">
                      <span>{project.period}</span>
                      {project.liveUrl && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-brand">
                          live <ArrowUpRight className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pager Bar */}
            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5 font-mono text-[11px] text-muted-foreground sm:px-5">
              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(visibleProjects.length).padStart(2, "0")} selected
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => stepProject(-1)}
                  aria-label="Previous project"
                  className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => stepProject(1)}
                  aria-label="Next project"
                  className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Showcase Stage */}
          <div className="flex min-w-0 flex-col justify-between gap-5 p-4 sm:p-6 lg:col-span-7">
            {/* Mobile & Tablet Horizontal Switcher */}
            <div className="space-y-2.5 lg:hidden">
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                <span>
                  Project {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(visibleProjects.length).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepProject(-1)}
                    aria-label="Previous project"
                    className="inline-flex h-8 w-8 items-center justify-center border border-border bg-background transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepProject(1)}
                    aria-label="Next project"
                    className="inline-flex h-8 w-8 items-center justify-center border border-border bg-background transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={mobileChipsRef}
                className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1"
              >
                {visibleProjects.map((project, index) => {
                  const isActive = project.title === currentProject.title;
                  return (
                    <button
                      key={project.title}
                      type="button"
                      onClick={() => setActiveTitle(project.title)}
                      aria-current={isActive ? "true" : undefined}
                      className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] transition-all duration-150 active:scale-95 ${
                        isActive
                          ? "border-brand bg-brand/12 font-semibold text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={isActive ? "text-brand" : "opacity-65"}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{project.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              key={currentProject.title}
              className="flex flex-1 flex-col justify-between gap-5 animate-in fade-in-0 duration-200"
            >
              <div className="space-y-5">
                <ProjectPreviewFrame
                  project={currentProject}
                  onExpand={
                    currentProject.previewImage
                      ? () => setLightboxProject(currentProject)
                      : undefined
                  }
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="inline-flex items-center gap-1 text-brand">
                          <CategoryIcon category={currentProject.category} />
                          {currentProject.category}
                        </span>
                        <span className="text-border">·</span>
                        <span className="text-muted-foreground">
                          {currentProject.period}
                        </span>
                        {currentProject.featured && (
                          <>
                            <span className="text-border">·</span>
                            <span className="inline-flex items-center gap-1 text-brand">
                              <Star className="h-3 w-3 fill-current" />
                              Featured
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {currentProject.title}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {currentProject.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      {currentProject.liveUrl && (
                        <a
                          href={currentProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/live inline-flex items-center gap-1.5 border border-brand bg-brand px-3 py-1.5 font-semibold text-brand-foreground transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none"
                        >
                          <span>{currentProject.liveLabel || "Live Site"}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                        </a>
                      )}
                      {currentProject.githubUrl && (
                        <a
                          href={currentProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/gh inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-foreground transition-all duration-150 hover:border-brand hover:text-brand active:scale-95"
                        >
                          <FolderGit2 className="h-3.5 w-3.5" />
                          <span>GitHub</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                    {currentProject.summary}
                  </p>

                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {currentProject.highlights.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-border/70 pt-4">
                <ProjectTagList tags={currentProject.tags} size="md" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode: All projects at once with visual thumbnails */
        <div
          key="grid"
          className={`grid gap-4 p-4 animate-in fade-in-0 duration-200 sm:p-6 ${
            visibleProjects.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {visibleProjects.map((project, index) => (
            <SpotlightCard
              key={project.title}
              className="p-4 hover:-translate-y-0.5 sm:p-5"
            >
              <article className="flex h-full flex-col justify-between gap-4">
                <div className="space-y-4">
                  <ProjectPreviewFrame
                    project={project}
                    compact
                    onExpand={
                      project.previewImage
                        ? () => setLightboxProject(project)
                        : undefined
                    }
                  />

                  <div>
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1.5 font-bold text-brand">
                        <CategoryIcon category={project.category} />
                        <span>
                          {String(index + 1).padStart(2, "0")} ·{" "}
                          {project.category}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        {project.period}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => inspectInShowcase(project.title)}
                      className="mt-2 block text-left text-lg font-bold tracking-tight text-foreground transition-colors hover:text-brand"
                    >
                      {project.title}
                    </button>
                    <p className="font-mono text-xs text-muted-foreground">
                      {project.subtitle}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border/70 pt-3.5">
                  <ProjectTagList tags={project.tags} />

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border border-brand/50 bg-brand/10 px-2.5 py-1 font-medium text-brand transition-all duration-150 hover:bg-brand hover:text-brand-foreground active:scale-95"
                      >
                        <span>{project.liveLabel || "Live Site"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border border-border bg-background px-2.5 py-1 text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-95"
                      >
                        <FolderGit2 className="h-3.5 w-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => inspectInShowcase(project.title)}
                      className="ml-auto inline-flex items-center gap-1 border border-border bg-background px-2.5 py-1 text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-95"
                    >
                      <PanelLeft className="h-3 w-3 text-brand" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Full-Resolution Screenshot Lightbox */}
      <DialogPrimitive.Root
        open={lightboxProject !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxProject(null);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-border bg-popover font-space-mono text-popover-foreground shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            {lightboxProject && (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/85 px-4 py-2.5 backdrop-blur-md">
                  <div className="min-w-0">
                    <DialogPrimitive.Title className="truncate font-display text-sm font-bold text-foreground sm:text-base">
                      {lightboxProject.title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="truncate text-[11px] text-muted-foreground">
                      {lightboxProject.subtitle} · {lightboxProject.period}
                    </DialogPrimitive.Description>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {lightboxProject.liveUrl && (
                      <a
                        href={lightboxProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 border border-brand/50 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
                      >
                        <span>{lightboxProject.liveLabel || "Live"}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                    <DialogPrimitive.Close
                      aria-label="Close screenshot preview"
                      className="inline-flex h-8 w-8 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-brand hover:text-foreground active:scale-90"
                    >
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  </div>
                </div>

                {lightboxProject.previewImage && (
                  <div className="relative bg-muted/20 p-2 sm:p-4">
                    <Image
                      src={lightboxProject.previewImage}
                      alt={`${lightboxProject.title} full screenshot`}
                      width={1600}
                      height={957}
                      className="mx-auto max-h-[75vh] w-auto border border-border object-contain"
                    />
                  </div>
                )}
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </WorkspaceFile>
  );
}
