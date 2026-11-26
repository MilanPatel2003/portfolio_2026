import Image from "next/image";
import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TechIcon } from "@/components/ui/tech-icon";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import { certificates, education } from "@/data/data";

export function EducationSection() {
  return (
    <WorkspaceFile
      id="education"
      title="Education & Certificates"
      filename="education.md"
      type="MD"
      className="flex h-full flex-col"
    >
      <div className="divide-y divide-border">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center gap-2 font-space-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-brand" />
            <span>Academic Degrees</span>
          </div>

          <div className="space-y-3">
            {education.map((edu) => (
              <SpotlightCard key={edu.degree} className="p-3.5 hover:-translate-y-0.5">
                <div className="flex flex-col items-start justify-between gap-2.5 sm:flex-row">
                  <div className="flex min-w-0 items-start gap-3">
                    {edu.logo && (
                      <div className="mt-0.5 flex h-9 w-12 shrink-0 items-center justify-center border border-border bg-white p-1">
                        <Image
                          src={edu.logo}
                          alt={`${edu.school} logo`}
                          width={44}
                          height={28}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground sm:text-base">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.school}
                      </p>
                      <p className="mt-1 font-space-mono text-xs text-muted-foreground">
                        {edu.period}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 self-start border border-brand/50 bg-brand/10 px-2 py-0.5 font-space-mono text-[11px] font-semibold text-brand">
                    CGPA: {edu.cgpa}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center gap-2 font-space-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Award className="h-4 w-4 text-brand" />
            <span>Certificates</span>
          </div>

          <ul className="space-y-2.5 text-sm">
            {certificates.map((cert) => (
              <li
                key={cert.title}
                className="-mx-1.5 flex flex-col items-start justify-between gap-2 rounded-xs border-b border-border/50 px-1.5 pb-2.5 transition-colors hover:bg-muted/25 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3"
              >
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cert inline-flex items-center gap-1 leading-snug text-foreground/90 underline-offset-4 hover:text-brand hover:underline"
                  >
                    <span>{cert.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover/cert:translate-x-0.5 group-hover/cert:-translate-y-0.5" />
                  </a>
                ) : (
                  <span className="leading-snug text-foreground/90">
                    {cert.title}
                  </span>
                )}
                <span className="inline-flex shrink-0 items-center gap-1.5 border border-border bg-background/80 px-2 py-0.5 font-space-mono text-[11px] text-foreground/90">
                  <TechIcon name={cert.issuer} className="h-3 w-3 shrink-0" />
                  <span>{cert.issuer}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WorkspaceFile>
  );
}
