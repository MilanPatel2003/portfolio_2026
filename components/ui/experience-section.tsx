import Image from "next/image";
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import { ArchitectureDrawer } from "@/components/ui/architecture-drawer";
import { SkillJumpButton } from "@/components/ui/skill-jump-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TechBadge } from "@/components/ui/tech-icon";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import { skillGroups, workExperience } from "@/data/data";
import { toDeliverableId } from "@/lib/events";

const KNOWN_SKILLS = new Set(
  skillGroups.flatMap((group) => group.items.map((item) => item.toLowerCase())),
);

const METRIC_PATTERN =
  /(30,000\+|\b3 plans\b|\b8 Stripe webhook event types\b|\bup to 3 times\b|\bfull and partial refunds\b|\bOFFSET\/LIMIT\b|\bwithout creating duplicate records\b)/gi;

function renderHighlightedBullet(text: string) {
  return text.split(METRIC_PATTERN).map((part, idx) =>
    idx % 2 === 1 ? (
      <span
        key={idx}
        className="font-semibold text-foreground underline decoration-brand/55 decoration-2 underline-offset-4"
      >
        {part}
      </span>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

export function ExperienceSection() {
  return (
    <WorkspaceFile
      id="experience"
      title="Work Experience"
      filename="experience.log"
      type="LOG"
      action={
        <span className="font-space-mono text-[11px] text-muted-foreground">
          {workExperience.length} roles · production timeline
        </span>
      }
    >
      <div className="relative p-4 sm:p-7">
        {/* Vertical timeline spine */}
        <div
          aria-hidden="true"
          className="absolute top-10 bottom-10 left-[29px] hidden w-px bg-border sm:left-[37px] sm:block"
        />

        <div className="space-y-8">
          {workExperience.map((job, jobIndex) => (
            <article
              key={`${job.company}-${job.role}`}
              className="relative sm:pl-9"
            >
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className={`absolute top-4 left-0 hidden h-5 w-5 items-center justify-center border sm:flex ${
                  job.current
                    ? "border-brand bg-brand/15 shadow-[0_0_0_4px_var(--background)]"
                    : "border-border bg-background shadow-[0_0_0_4px_var(--background)]"
                }`}
              >
                {job.current && (
                  <span className="absolute inset-0 animate-ping bg-brand/35 motion-reduce:hidden" />
                )}
                <span
                  className={`relative h-2 w-2 ${
                    job.current ? "bg-brand" : "bg-muted-foreground/60"
                  }`}
                />
              </span>

              {/* Role Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3.5">
                  {job.logo ? (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-white p-1.5 shadow-xs">
                      <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        width={36}
                        height={36}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-muted/40">
                      <Briefcase className="h-5 w-5 text-brand" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-space-mono text-xs text-brand">
                        {String(jobIndex + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                        {job.role}
                      </h3>
                      {job.current && (
                        <span className="border border-brand bg-brand/10 px-2 py-0.5 font-space-mono text-[10px] font-bold uppercase tracking-wider text-brand">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {job.companyUrl ? (
                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/co inline-flex items-center gap-1 font-medium text-foreground/90 underline-offset-4 hover:text-brand hover:underline"
                        >
                          <span>{job.company}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/co:translate-x-0.5 group-hover/co:-translate-y-0.5" />
                        </a>
                      ) : (
                        <span className="font-medium text-foreground/90">
                          {job.company}
                        </span>
                      )}
                      <span className="text-border">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="shrink-0 border border-border/70 bg-muted/25 px-2.5 py-1 font-space-mono text-xs font-medium text-muted-foreground self-start">
                  {job.period}
                </p>
              </div>

              {/* Balanced Deliverables Grid */}
              <div
                className={`mt-5 grid gap-4 ${
                  job.deliverables.length > 1
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {job.deliverables.map((item) => (
                  <SpotlightCard
                    key={item.name}
                    id={toDeliverableId(item.name)}
                    className="deliverable-anchor p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {item.logo && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-white p-0.5">
                            <Image
                              src={item.logo}
                              alt={`${item.name} logo`}
                              width={24}
                              height={24}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        <h4 className="text-base font-semibold text-foreground">
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.architecture && (
                          <ArchitectureDrawer
                            deliverableName={item.name}
                            companyName={job.company}
                            liveUrl={item.liveUrl}
                            architecture={item.architecture}
                          />
                        )}
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/live inline-flex items-center gap-1 border border-brand/40 bg-brand/10 px-2 py-0.5 font-space-mono text-[11px] font-medium text-brand transition-all duration-150 hover:bg-brand hover:text-brand-foreground active:scale-95"
                          >
                            <span>Live Site</span>
                            <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.stack.map((tech) =>
                        KNOWN_SKILLS.has(tech.toLowerCase()) ? (
                          <SkillJumpButton key={tech} skill={tech}>
                            <TechBadge name={tech} interactive />
                          </SkillJumpButton>
                        ) : (
                          <TechBadge key={tech} name={tech} />
                        ),
                      )}
                    </div>

                    <ul className="mt-3.5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {item.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand"
                          />
                          <span>{renderHighlightedBullet(bullet)}</span>
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </WorkspaceFile>
  );
}
