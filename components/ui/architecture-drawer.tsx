"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowDown, ArrowUpRight, Network, ShieldCheck, X } from "lucide-react";
import type { ArchitectureSpec } from "@/data/data";

export function ArchitectureDrawer({
  deliverableName,
  companyName,
  liveUrl,
  architecture,
}: {
  deliverableName: string;
  companyName: string;
  liveUrl?: string;
  architecture: ArchitectureSpec;
}) {
  const [open, setOpen] = useState(false);
  const slug = deliverableName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 border border-border bg-background px-2 py-0.5 font-space-mono text-[11px] font-medium text-foreground transition-all duration-150 hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-[2px_2px_0_var(--brand)] active:translate-y-0 active:shadow-none"
        >
          <Network className="h-3 w-3 text-brand" />
          <span>Architecture</span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-popover font-space-mono text-popover-foreground shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          {/* Terminal-style Chrome */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-muted/85 px-4 py-2.5 backdrop-blur-md">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 truncate text-xs text-muted-foreground">
                ~/architecture/{slug}.flow
              </span>
            </div>

            <DialogPrimitive.Close
              aria-label="Close architecture view"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
            >
              <X className="h-3.5 w-3.5" />
            </DialogPrimitive.Close>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] text-brand">{companyName}</p>
                <DialogPrimitive.Title className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {deliverableName} — {architecture.headline}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {architecture.overview}
                </DialogPrimitive.Description>
              </div>

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 border border-brand/50 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  <span>Live Site</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Connected System Flow */}
            <div className="space-y-1">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Data &amp; Event Pipeline
              </p>
              <div className="space-y-1.5">
                {architecture.steps.map((step, index) => (
                  <div key={step.title}>
                    <div className="border border-border bg-background/85 p-3 transition-colors duration-150 hover:border-brand/50 sm:p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="border border-brand/40 bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-sm font-bold text-foreground">
                            {step.title}
                          </span>
                        </div>
                        <span className="border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                          {step.layer}
                        </span>
                      </div>
                      <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                        {step.detail}
                      </p>
                    </div>

                    {index < architecture.steps.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="flex justify-center py-0.5 text-brand/75"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safeguards */}
            <div className="border border-border bg-muted/25 p-3.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                <span>Reliability Safeguards</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {architecture.safeguards.map((item) => (
                  <span
                    key={item}
                    className="border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
