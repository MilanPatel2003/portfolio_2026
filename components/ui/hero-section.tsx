"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  MapPin,
} from "lucide-react";
import { hero } from "@/data/data";
import { site } from "@/lib/site";

type InspectorTab = "profile.ts" | "stack.json" | "status.sh";

function useIndiaTime() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: site.timezone,
    });
    const update = () => setTime(formatter.format(new Date()));
    const first = setTimeout(update, 0);
    const timer = setInterval(update, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return time;
}

function CodeLine({
  lineNumber,
  children,
}: {
  lineNumber: number;
  children: ReactNode;
}) {
  return (
    <div className="group/line -mx-2 flex items-baseline gap-3 rounded-xs px-2 py-0.5 transition-colors hover:bg-muted/45">
      <span
        aria-hidden="true"
        className="w-5 shrink-0 select-none text-right text-[10px] text-muted-foreground/50 transition-colors group-hover/line:text-brand"
      >
        {String(lineNumber).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function HeroSection() {
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);
  const [activeTab, setActiveTab] = useState<InspectorTab>("profile.ts");
  const localTime = useIndiaTime();

  async function copyValue(type: "email" | "phone", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.location.href =
        type === "email"
          ? `mailto:${value}`
          : `tel:${value.replace(/\s+/g, "")}`;
    }
  }

  const githubLink = hero.socialLinks.find((item) => item.name === "GitHub");
  const linkedinLink = hero.socialLinks.find((item) => item.name === "LinkedIn");

  return (
    <section
      id="top"
      className="intro-stage-expand pt-4 pb-6 sm:pt-10 sm:pb-10"
    >
      <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
        {/* Left: Executive narrative & tactile CTAs */}
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <div className="inline-flex flex-wrap items-center gap-2 border border-border bg-card/70 px-3 py-1.5 font-space-mono text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <Image
              src={hero.currentCompanyLogo}
              alt={hero.currentCompany}
              width={16}
              height={16}
              priority
              className="h-4 w-4 rounded-xs bg-white p-0.5 object-contain"
            />
            <span>{hero.availability}</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-brand" />
              {hero.location}
            </span>
          </div>

          <div className="space-y-2.5">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              {hero.firstName}{" "}
              <span className="text-brand">{hero.lastName}</span>
            </h1>
            <p className="font-space-mono text-sm font-medium text-foreground/90 sm:text-base">
              {hero.position} — React · Node.js · PostgreSQL · Serverless &amp;
              LLMs
            </p>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            {hero.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:gap-3">
            <a
              href="#contact"
              className="group/cta inline-flex h-10 items-center gap-2 border border-brand bg-brand px-4 font-space-mono text-xs font-bold text-brand-foreground transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span>Get in Touch</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/cta:translate-x-0.5" />
            </a>

            <button
              type="button"
              onClick={() => copyValue("email", hero.email)}
              className="inline-flex h-10 max-w-full items-center gap-2 border border-border bg-background px-3.5 font-space-mono text-xs text-foreground transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-[3px_3px_0_var(--brand)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:border-brand focus-visible:outline-none sm:px-4"
            >
              {copied === "email" ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span>Copied Email</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{hero.email}</span>
                </>
              )}
            </button>

            {githubLink && (
              <a
                href={githubLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex h-10 items-center gap-1.5 border border-border bg-background px-3.5 font-space-mono text-xs text-muted-foreground transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-brand hover:text-foreground hover:shadow-[3px_3px_0_var(--brand)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}

            {linkedinLink && (
              <a
                href={linkedinLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex h-10 items-center gap-1.5 border border-border bg-background px-3.5 font-space-mono text-xs text-muted-foreground transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-brand hover:text-foreground hover:shadow-[3px_3px_0_var(--brand)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3 w-3 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right: Multi-tab Interactive Developer Inspector */}
        <aside
          aria-label="Developer profile inspector"
          className="workspace-file min-w-0 overflow-hidden shadow-xs"
        >
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 pt-2 font-space-mono text-[11px]">
            <div
              role="tablist"
              aria-label="Profile inspector views"
              className="flex items-center gap-1"
            >
              {(["profile.ts", "stack.json", "status.sh"] as const).map(
                (tab) => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab)}
                      className={`relative border-b-2 px-2.5 pb-2 pt-1 transition-colors duration-150 ${
                        active
                          ? "border-brand font-bold text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{tab}</span>
                    </button>
                  );
                },
              )}
            </div>

            <span className="min-w-[80px] pb-1.5 text-right text-[10px] tabular-nums text-muted-foreground">
              {localTime ? `IST ${localTime}` : "\u00a0"}
            </span>
          </header>

          <div className="min-h-[240px] overflow-x-auto p-3.5 font-space-mono text-[11px] leading-relaxed sm:min-h-[256px] sm:p-5 sm:text-[13px]">
            {activeTab === "profile.ts" && (
              <div>
                <CodeLine lineNumber={1}>
                  <span className="workspace-comment">
                    {"// quick overview & direct contact"}
                  </span>
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span className="workspace-keyword">const</span>{" "}
                  <span className="text-foreground">developer</span> = {"{"}
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span className="pl-4 text-muted-foreground">name:</span>{" "}
                  <span className="workspace-string">
                    &quot;{hero.name}&quot;
                  </span>
                  ,
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span className="pl-4 text-muted-foreground">role:</span>{" "}
                  <span className="workspace-string">
                    &quot;{hero.position}&quot;
                  </span>
                  ,
                </CodeLine>
                <CodeLine lineNumber={5}>
                  <span className="pl-4 text-muted-foreground">company:</span>{" "}
                  <span className="workspace-string">
                    &quot;eSparkbiz Technologies&quot;
                  </span>
                  ,
                </CodeLine>
                <CodeLine lineNumber={6}>
                  <span className="pl-4 text-muted-foreground">location:</span>{" "}
                  <span className="workspace-string">
                    &quot;{hero.location}&quot;
                  </span>
                  ,
                </CodeLine>
                <CodeLine lineNumber={7}>
                  <span className="pl-4 text-muted-foreground">focus:</span>{" "}
                  <span className="workspace-string">
                    &quot;Webhooks · Payments · Serverless · LLMs&quot;
                  </span>
                  ,
                </CodeLine>
                <CodeLine lineNumber={8}>
                  <span className="pl-4 text-muted-foreground">phone:</span>{" "}
                  <a
                    href={`tel:${hero.phone.replace(/\s+/g, "")}`}
                    className="workspace-source-link"
                  >
                    &quot;{hero.phone}&quot;
                  </a>
                  ,
                </CodeLine>
                <CodeLine lineNumber={9}>
                  <span className="pl-4 text-muted-foreground">email:</span>{" "}
                  <a
                    href={`mailto:${hero.email}`}
                    className="workspace-source-link"
                  >
                    &quot;{hero.email}&quot;
                  </a>
                  ,
                </CodeLine>
                <CodeLine lineNumber={10}>{"};"}</CodeLine>
              </div>
            )}

            {activeTab === "stack.json" && (
              <div>
                <CodeLine lineNumber={1}>{"{"}</CodeLine>
                <CodeLine lineNumber={2}>
                  <span className="pl-4 workspace-keyword">
                    &quot;frontend&quot;
                  </span>
                  : [
                  <span className="workspace-string">&quot;React&quot;</span>,{" "}
                  <span className="workspace-string">
                    &quot;TypeScript&quot;
                  </span>
                  ,{" "}
                  <span className="workspace-string">
                    &quot;Redux Toolkit&quot;
                  </span>
                  ,{" "}
                  <span className="workspace-string">
                    &quot;TanStack Query&quot;
                  </span>
                  ],
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span className="pl-4 workspace-keyword">
                    &quot;backend&quot;
                  </span>
                  : [
                  <span className="workspace-string">&quot;Node.js&quot;</span>,{" "}
                  <span className="workspace-string">&quot;NestJS&quot;</span>,{" "}
                  <span className="workspace-string">
                    &quot;Express.js&quot;
                  </span>
                  ,{" "}
                  <span className="workspace-string">&quot;RabbitMQ&quot;</span>
                  , <span className="workspace-string">&quot;Redis&quot;</span>
                  ],
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span className="pl-4 workspace-keyword">
                    &quot;data&quot;
                  </span>
                  : [
                  <span className="workspace-string">
                    &quot;PostgreSQL&quot;
                  </span>
                  ,{" "}
                  <span className="workspace-string">
                    &quot;Sequelize&quot;
                  </span>
                  , <span className="workspace-string">&quot;Prisma&quot;</span>
                  , <span className="workspace-string">&quot;MongoDB&quot;</span>
                  ],
                </CodeLine>
                <CodeLine lineNumber={5}>
                  <span className="pl-4 workspace-keyword">
                    &quot;payments&quot;
                  </span>
                  : [
                  <span className="workspace-string">&quot;Stripe&quot;</span>,{" "}
                  <span className="workspace-string">&quot;Razorpay&quot;</span>
                  ,{" "}
                  <span className="workspace-string">
                    &quot;HubSpot CRM&quot;
                  </span>
                  ],
                </CodeLine>
                <CodeLine lineNumber={6}>
                  <span className="pl-4 workspace-keyword">
                    &quot;ai_search&quot;
                  </span>
                  : [
                  <span className="workspace-string">
                    &quot;LangChain&quot;
                  </span>
                  , <span className="workspace-string">&quot;OpenAI&quot;</span>
                  , <span className="workspace-string">&quot;Gemini&quot;</span>
                  ,{" "}
                  <span className="workspace-string">
                    &quot;Elasticsearch&quot;
                  </span>
                  ]
                </CodeLine>
                <CodeLine lineNumber={7}>{"}"}</CodeLine>
              </div>
            )}

            {activeTab === "status.sh" && (
              <div className="space-y-3">
                <CodeLine lineNumber={1}>
                  <span className="text-brand">$</span> whoami --summary
                </CodeLine>
                <CodeLine lineNumber={2}>
                  <span className="text-muted-foreground">
                    ↳ MCA @ GLS University (CGPA 8.0) · 1+ yrs production exp
                  </span>
                </CodeLine>
                <CodeLine lineNumber={3}>
                  <span className="text-brand">$</span> current --role
                </CodeLine>
                <CodeLine lineNumber={4}>
                  <span className="text-muted-foreground">
                    ↳ Junior SDE @ eSparkbiz Technologies (Feb 2026 – Present)
                  </span>
                </CodeLine>
                <CodeLine lineNumber={5}>
                  <span className="text-brand">$</span> contact --copy
                </CodeLine>
                <div className="flex flex-wrap gap-2 pl-4 pt-1 sm:pl-8">
                  <button
                    type="button"
                    onClick={() => copyValue("email", hero.email)}
                    className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-[11px] text-foreground transition-colors hover:border-brand hover:text-brand sm:px-2.5 sm:py-1"
                  >
                    {copied === "email" ? (
                      <Check className="h-3 w-3 text-brand" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>
                      {copied === "email" ? "Email copied" : "Copy email"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue("phone", hero.phone)}
                    className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-[11px] text-foreground transition-colors hover:border-brand hover:text-brand sm:px-2.5 sm:py-1"
                  >
                    {copied === "phone" ? (
                      <Check className="h-3 w-3 text-brand" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>
                      {copied === "phone" ? "Phone copied" : "Copy mobile"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
