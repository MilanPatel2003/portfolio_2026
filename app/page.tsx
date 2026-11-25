import { ArrowUpRight } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ContactSection } from "@/components/ui/contact-section";
import { EducationSection } from "@/components/ui/education-section";
import { ExperienceSection } from "@/components/ui/experience-section";
import { GitHubActivity } from "@/components/ui/github-activity";
import { HeroSection } from "@/components/ui/hero-section";
import { InteractiveAvatar } from "@/components/ui/interactive-avatar";
import { IntroCurtain } from "@/components/ui/intro-curtain";
import { PortfolioNav } from "@/components/ui/portfolio-nav";
import { ProjectsSection } from "@/components/ui/projects-section";
import { QuickDock } from "@/components/ui/quick-dock";
import { SkillsSection } from "@/components/ui/skills-section";
import { TechIcon } from "@/components/ui/tech-icon";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import { hero } from "@/data/data";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <IntroCurtain />
      <BGPattern
        className="portfolio-grid-background pointer-events-none fixed inset-0 h-dvh w-full opacity-75"
        variant="grid"
        mask="none"
        size={40}
        fill="var(--grid-fill)"
      />

      <PortfolioNav />

      <main className="mx-auto max-w-6xl space-y-10 px-4 pb-12 sm:space-y-12 sm:px-6 sm:pb-16 lg:px-8">
        <HeroSection />

        <ExperienceSection />

        <ProjectsSection />

        <SkillsSection />

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <EducationSection />
          </div>

          <div className="lg:col-span-7">
            <WorkspaceFile
              id="activity"
              title="GitHub Activity"
              filename="github.log"
              type="GIT"
              className="flex h-full flex-col"
              action={
                <a
                  href={`https://github.com/${site.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-space-mono text-[11px] text-brand hover:underline"
                >
                  <TechIcon name="GitHub" className="h-3.5 w-3.5" />
                  <span>@{site.githubUsername}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              }
            >
              <div className="p-4 sm:p-5">
                <GitHubActivity fit />
              </div>
            </WorkspaceFile>
          </div>
        </div>

        <ContactSection />
      </main>

      <footer className="relative w-full border-t border-border/80 font-space-mono text-xs text-muted-foreground">
        {/* Full-bleed atmospheric stage behind interactive avatar */}
        <div className="relative flex w-full flex-col items-center justify-end overflow-hidden bg-[radial-gradient(ellipse_60%_90%_at_bottom,color-mix(in_oklch,var(--brand)_16%,transparent),transparent_72%)] px-4 pt-10 text-center">
          <p className="mb-1 font-display text-sm font-medium tracking-tight text-foreground sm:text-base">
            &ldquo;Building clean systems, shipping fast.&rdquo;
          </p>
          <InteractiveAvatar />
        </div>

        {/* Full-width bottom bar flush at document end */}
        <div className="w-full border-t border-border/80 bg-muted/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-x-5 gap-y-1.5 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} {hero.name} · {hero.location}
            </p>
            <span aria-hidden="true" className="hidden text-border sm:inline">
              |
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span>Press ⌘K for command palette &amp; lo-fi audio</span>
              <a href="#top" className="text-brand hover:underline">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      <QuickDock />
    </div>
  );
}
