"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { WorkspaceFile } from "@/components/ui/workspace-file";
import { hero } from "@/data/data";
import { getMailtoHref, showToast } from "@/lib/events";
import { site } from "@/lib/site";

export function ContactSection() {
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(
    null,
  );

  async function handleCopy(field: "email" | "phone", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      showToast(
        field === "email"
          ? "Copied email to clipboard"
          : "Copied mobile number to clipboard",
      );
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* Fallback handled by native link */
    }
  }

  const githubLink = hero.socialLinks.find((item) => item.name === "GitHub");
  const linkedinLink = hero.socialLinks.find((item) => item.name === "LinkedIn");

  return (
    <WorkspaceFile
      id="contact"
      title="Contact"
      filename="contact.md"
      type="MD"
      action={
        <span className="inline-flex items-center gap-1.5 font-space-mono text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 text-brand" />
          {hero.location}
        </span>
      }
    >
      <div className="p-4 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Let&apos;s build something scalable together.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Whether you&apos;re looking for a full-stack engineer across React,
              Node.js, and PostgreSQL, or want to collaborate on webhooks, payment
              systems, or LLM integrations — feel free to reach out directly.
            </p>
          </div>

          {site.resumeUrl && (
            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/res inline-flex h-10 w-fit shrink-0 items-center gap-2 border border-brand bg-brand/10 px-4 font-space-mono text-xs font-semibold text-brand transition-all duration-150 hover:bg-brand hover:text-brand-foreground active:scale-95"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>View Resume</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/res:translate-x-0.5 group-hover/res:-translate-y-0.5" />
            </a>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Email Card */}
          <SpotlightCard className="p-4 hover:-translate-y-0.5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-space-mono text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  <span>Email</span>
                </div>
                <a
                  href={getMailtoHref(hero.email)}
                  className="mt-2 block break-all text-sm font-semibold text-foreground transition-colors hover:text-brand"
                >
                  {hero.email}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={getMailtoHref(hero.email)}
                  className="group/send inline-flex items-center gap-1 font-space-mono text-xs text-brand hover:underline"
                >
                  <span>Send email</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("email", hero.email)}
                  className="ml-auto inline-flex items-center gap-1 border border-border bg-background px-2 py-1 font-space-mono text-[11px] text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-95"
                >
                  {copiedField === "email" ? (
                    <>
                      <Check className="h-3 w-3 text-brand" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </SpotlightCard>

          {/* Phone Card */}
          <SpotlightCard className="p-4 hover:-translate-y-0.5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-space-mono text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-brand" />
                  <span>Mobile</span>
                </div>
                <a
                  href={`tel:${hero.phone.replace(/\s+/g, "")}`}
                  className="mt-2 block font-space-mono text-sm font-semibold text-foreground transition-colors hover:text-brand"
                >
                  {hero.phone}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={`tel:${hero.phone.replace(/\s+/g, "")}`}
                  className="group/call inline-flex items-center gap-1 font-space-mono text-xs text-brand hover:underline"
                >
                  <span>Call</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/call:translate-x-0.5 group-hover/call:-translate-y-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("phone", hero.phone)}
                  className="ml-auto inline-flex items-center gap-1 border border-border bg-background px-2 py-1 font-space-mono text-[11px] text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-95"
                >
                  {copiedField === "phone" ? (
                    <>
                      <Check className="h-3 w-3 text-brand" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </SpotlightCard>

          {/* LinkedIn Card */}
          {linkedinLink && (
            <SpotlightCard className="p-4 hover:-translate-y-0.5">
              <a
                href={linkedinLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/ln flex h-full flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 font-space-mono text-xs text-muted-foreground">
                    <Linkedin className="h-3.5 w-3.5 text-brand" />
                    <span>LinkedIn</span>
                  </div>
                  <p className="mt-2 break-all text-sm font-semibold text-foreground transition-colors group-hover/ln:text-brand">
                    milan-patel-37650330b
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 font-space-mono text-xs text-brand group-hover/ln:underline">
                  <span>Connect</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/ln:translate-x-0.5 group-hover/ln:-translate-y-0.5" />
                </span>
              </a>
            </SpotlightCard>
          )}

          {/* GitHub & Web Card */}
          {githubLink && (
            <SpotlightCard className="p-4 hover:-translate-y-0.5">
              <a
                href={githubLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/gh flex h-full flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 font-space-mono text-xs text-muted-foreground">
                    <Github className="h-3.5 w-3.5 text-brand" />
                    <span>GitHub</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground transition-colors group-hover/gh:text-brand">
                    @MilanPatel2003
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 font-space-mono text-xs text-brand">
                  <span className="inline-flex items-center gap-1 group-hover/gh:underline">
                    <span>View repos</span>
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5" />
                  </span>
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </a>
            </SpotlightCard>
          )}
        </div>
      </div>
    </WorkspaceFile>
  );
}
