"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, Layers, Search, Sparkles, X } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TechIcon } from "@/components/ui/tech-icon";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import { projects, skillGroups, workExperience } from "@/data/data";
import {
  focusDeliverableCard,
  selectAndScrollToProject,
  toDeliverableId,
} from "@/lib/events";

const CORE_DRIVERS = [
  { name: "TypeScript", role: "Primary Language" },
  { name: "React", role: "Frontend UI" },
  { name: "Node.js", role: "Server & Serverless" },
  { name: "PostgreSQL", role: "Primary Database" },
  { name: "NestJS", role: "API Architecture" },
  { name: "Stripe", role: "Payments & Billing" },
] as const;

const LAYER_DESCRIPTIONS: Record<string, string> = {
  Languages: "Typed, scripting & query syntax",
  Frontend: "UI architecture, state & server cache",
  Backend: "APIs, event brokers & worker queues",
  Databases: "Relational, NoSQL & ORMs",
  "Payments & CRM": "Billing, webhooks & customer portals",
  Testing: "Unit, integration & E2E coverage",
  Other: "Search indexing, containers & flows",
};

const SKILL_NOTES: Record<string, string> = {
  JavaScript: "Core language across frontend apps, serverless handlers, and interactive DOM tooling.",
  TypeScript: "Strict typing across React frontends, Node.js APIs, NestJS services, and open-source NPM packages.",
  Python: "Scripting, backend automation, and data workflows.",
  SQL: "Complex queries, transactional migrations, indexing, and server-side pagination.",
  React: "Component systems, subscription & coupon checkout UIs, AI SaaS dashboards, and reusable animation libraries.",
  "Next.js": "App Router, server-rendered metadata/JSON-LD, static pre-rendering, and full-stack SEO architecture.",
  "Redux Toolkit": "Predictable client state management for multi-step commerce and cart workflows.",
  "TanStack Query": "Declarative server-state caching, background syncing, and optimistic updates.",
  "Tailwind CSS": "Utility-first responsive layouts, design-token theming, and accessible component styling.",
  HTML: "Semantic markup, accessibility structure, and SEO-friendly document architecture.",
  CSS: "Responsive layouts, CSS variables, custom micro-interactions, and modern grid systems.",
  "Node.js": "High-throughput serverless webhooks, REST services, and event-driven workers.",
  "Express.js": "Lightweight REST APIs, middleware pipelines, and webhook receivers.",
  NestJS: "Modular backend architecture using DI, controllers, services, guards, pipes, and DTOs.",
  "REST APIs": "Paginated, idempotent, schema-validated HTTP endpoints and external CRM integrations.",
  Redis: "Low-latency caching and backing store for high-frequency queues.",
  RabbitMQ: "Stripe webhook consumers with duplicate event ID checks, retries, and dead-letter queues.",
  BullMQ: "Redis-backed background job scheduling, retries, and asynchronous task queues.",
  PostgreSQL: "Relational schemas, versioned migrations, coupon & refund persistence, and OFFSET/LIMIT pagination.",
  MySQL: "Relational database modeling, joins, and CRUD backend services.",
  MongoDB: "Document schema design for real-time MERN applications and chat histories.",
  Sequelize: "Versioned PostgreSQL migrations, model associations, and schema management.",
  TypeORM: "Entity modeling, repository patterns, and TypeScript-first SQL migrations.",
  Prisma: "Type-safe database client, schema modeling, and rapid query composition.",
  Stripe: "Subscription upgrade/downgrade/cancellation flows with proration, coupons, refunds, and webhook syncing.",
  Razorpay: "Payment gateway integration and order checkout verification workflows.",
  "HubSpot CRM": "Serverless webhook ingestion (30,000+/mo) with batch cursor checkpointing and hash caching.",
  Jest: "Unit and integration test suites for APIs, business logic, and state.",
  Playwright: "End-to-end browser verification across critical user and checkout journeys.",
  Elasticsearch: "Full-text indexing, structured filtering, and fast search retrieval.",
  Algolia: "Instant hosted search experiences and typo-tolerant catalog indexing.",
  Docker: "Containerized local environments and reproducible service deployments.",
  n8n: "Workflow automation connecting APIs, webhooks, and operational pipelines.",
  LLM: "Generative AI workflows, content-hash response caching, and integrations across OpenAI, Gemini, and LangChain.",
};

type UsageRef = {
  label: string;
  context: string;
  href: string;
  projectTitle?: string;
};

function getSkillUsages(skill: string): UsageRef[] {
  const target = skill.toLowerCase();
  const usages: UsageRef[] = [];

  for (const job of workExperience) {
    for (const item of job.deliverables) {
      const matched = item.stack.some((s) => s.toLowerCase() === target);
      if (matched) {
        usages.push({
          label: item.name,
          context: job.company,
          href: `#${toDeliverableId(item.name)}`,
        });
      }
    }
  }

  for (const project of projects) {
    const matched = project.tags.some((t) => t.toLowerCase() === target);
    if (matched) {
      usages.push({
        label: project.title,
        context: project.category,
        href: "#projects",
        projectTitle: project.title,
      });
    }
  }

  return usages;
}

export function SkillsSection() {
  const [query, setQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("TypeScript");
  const normalized = query.trim().toLowerCase();

  useEffect(() => {
    const onSelectSkill = (event: CustomEvent<{ skill?: string }>) => {
      const requested = event.detail?.skill?.trim().toLowerCase();
      if (!requested) return;
      const matched = skillGroups
        .flatMap((g) => g.items)
        .find((item) => item.toLowerCase() === requested);
      if (!matched) return;
      setQuery("");
      setSelectedSkill(matched);
    };
    window.addEventListener(
      "portfolio:select-skill",
      onSelectSkill as EventListener,
    );
    return () =>
      window.removeEventListener(
        "portfolio:select-skill",
        onSelectSkill as EventListener,
      );
  }, []);

  const totalSkills = skillGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  const matchingCount = normalized
    ? skillGroups.reduce(
        (sum, group) =>
          sum +
          group.items.filter((item) => item.toLowerCase().includes(normalized))
            .length,
        0,
      )
    : totalSkills;

  const usageMap = useMemo(() => {
    const map = new Map<string, UsageRef[]>();
    for (const group of skillGroups) {
      for (const item of group.items) {
        map.set(item, getSkillUsages(item));
      }
    }
    return map;
  }, []);

  const selectedUsages = usageMap.get(selectedSkill) ?? [];

  const selectedCategory = useMemo(
    () =>
      skillGroups.find((g) => g.items.includes(selectedSkill))?.category ??
      "Technical Stack",
    [selectedSkill],
  );

  return (
    <WorkspaceFile
      id="skills"
      title="Technical Skills"
      filename="toolbox.json"
      type="JSON"
      action={
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
          <div className="relative flex min-w-0 flex-1 items-center sm:flex-initial">
            <Search className="pointer-events-none absolute left-2 h-3 w-3 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && normalized) {
                  const first = skillGroups
                    .flatMap((g) => g.items)
                    .find((item) => item.toLowerCase().includes(normalized));
                  if (first) setSelectedSkill(first);
                } else if (event.key === "Escape" && query) {
                  setQuery("");
                }
              }}
              placeholder="Filter stack..."
              aria-label="Filter technical skills"
              className="h-8 w-full border border-border bg-background pr-6 pl-7 font-mono text-[11px] text-foreground transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none sm:h-7 sm:w-36 sm:focus:w-44"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear skill filter"
                className="absolute right-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {normalized
              ? `${matchingCount}/${totalSkills} matched`
              : `${skillGroups.length} layers · ${totalSkills} tools`}
          </span>
        </div>
      }
    >
      <div className="divide-y divide-border">
        {/* Top Ribbon: Primary Daily Production Stack */}
        <div className="p-4 sm:px-6 sm:py-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Core Production Stack
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              <span className="sm:hidden">Tap any skill to inspect</span>
              <span className="hidden sm:inline">
                Click any skill below to inspect usage
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {CORE_DRIVERS.map((driver) => {
              const active = selectedSkill === driver.name;
              return (
                <button
                  key={driver.name}
                  type="button"
                  onClick={() => setSelectedSkill(driver.name)}
                  aria-pressed={active}
                  className="w-full text-left transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none"
                >
                  <SpotlightCard
                    className={`p-3 transition-all duration-150 ${
                      active
                        ? "border-brand bg-brand/8 shadow-xs"
                        : "hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-background">
                        <TechIcon name={driver.name} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs font-bold text-foreground">
                          {driver.name}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {driver.role}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Clean Edge-to-Edge Architecture Layers (zero empty card gaps) */}
        <div className="divide-y divide-border/70">
          {matchingCount === 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/25 px-4 py-3 font-mono text-xs sm:px-6 animate-in fade-in-0 duration-150">
              <span className="text-muted-foreground">
                No stack items matched &ldquo;{query.trim()}&rdquo;.
              </span>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="border border-brand/50 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground active:scale-95"
              >
                Reset filter
              </button>
            </div>
          )}
          {skillGroups.map((group, idx) => {
            const Icon = group.icon;
            const groupMatched =
              !normalized ||
              group.items.some((item) =>
                item.toLowerCase().includes(normalized),
              );

            return (
              <div
                key={group.category}
                className={`flex flex-col gap-3 px-4 py-3.5 transition-opacity duration-200 sm:px-6 md:flex-row md:items-center md:gap-6 ${
                  groupMatched ? "opacity-100" : "opacity-35"
                }`}
              >
                {/* Layer Label Column */}
                <div className="flex shrink-0 items-center gap-3 md:w-64">
                  <span className="font-mono text-[11px] text-brand tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted/30">
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                      {group.category}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      {LAYER_DESCRIPTIONS[group.category] ?? ""}
                    </p>
                  </div>
                </div>

                {/* Interactive Skill Chips */}
                <div className="flex flex-1 flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected = selectedSkill === item;
                    const isSearchMatch = Boolean(
                      normalized && item.toLowerCase().includes(normalized),
                    );
                    const isDimmed = Boolean(normalized && !isSearchMatch);
                    const hasProjects = (usageMap.get(item)?.length ?? 0) > 0;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedSkill(item)}
                        aria-pressed={isSelected}
                        className={`group/chip inline-flex items-center gap-2 border px-3 py-2 font-mono text-xs transition-all duration-150 active:scale-95 focus-visible:outline-1 focus-visible:outline-brand sm:py-1.5 ${
                          isSelected
                            ? "border-brand bg-brand/12 text-foreground shadow-[2px_2px_0_var(--brand)]"
                            : isSearchMatch
                              ? "border-brand bg-brand/10 text-foreground"
                              : "border-border bg-background/85 text-foreground/90 hover:-translate-y-0.5 hover:border-brand/70 hover:bg-muted/40"
                        } ${isDimmed ? "opacity-30" : "opacity-100"}`}
                      >
                        <TechIcon
                          name={item}
                          className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover/chip:scale-110"
                        />
                        <span>{item}</span>
                        {hasProjects && (
                          <span
                            title="Used in shipped experience or projects"
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? "bg-brand" : "bg-brand/45"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: Live Skill Context Inspector */}
        <div
          key={selectedSkill}
          aria-live="polite"
          className="flex flex-col justify-between gap-3 bg-muted/25 px-4 py-3.5 animate-in fade-in-0 duration-150 sm:px-6 lg:flex-row lg:items-center"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-brand/50 bg-background">
              <TechIcon name={selectedSkill} className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="font-bold text-foreground">
                  {selectedSkill}
                </span>
                <span className="text-border">·</span>
                <span className="text-brand">{selectedCategory}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {SKILL_NOTES[selectedSkill] ??
                  `Applied across ${selectedCategory.toLowerCase()} workflows.`}
              </p>
            </div>
          </div>

          {selectedUsages.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
              <span className="mr-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3 w-3 text-brand" />
                Shipped in:
              </span>
              {selectedUsages.map((usage) => (
                <a
                  key={`${usage.label}-${usage.context}`}
                  href={usage.href}
                  onClick={(event) => {
                    event.preventDefault();
                    if (usage.projectTitle) {
                      selectAndScrollToProject(usage.projectTitle);
                    } else {
                      focusDeliverableCard(usage.label);
                    }
                  }}
                  className="inline-flex items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground transition-all duration-150 hover:border-brand hover:text-brand active:scale-95"
                >
                  <span>{usage.label}</span>
                  <ArrowDownRight className="h-3 w-3 text-brand" />
                </a>
              ))}
            </div>
          ) : (
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              Production engineering toolkit
            </span>
          )}
        </div>
      </div>
    </WorkspaceFile>
  );
}
