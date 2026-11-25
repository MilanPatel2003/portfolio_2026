"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tactile surface with a zero-rerender pointer-tracking radial border/surface glow
 * and subtle architectural corner ticks on hover.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mx",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${event.clientY - rect.top}px`,
    );
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "spotlight-card group/spot relative border border-border bg-muted/15 transition-[border-color,transform,box-shadow] duration-200 hover:border-brand/55",
        className,
      )}
    >
      {/* Subtle radial spotlight layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand) 9%, transparent), transparent 70%)",
        }}
      />

      {/* Precision corner registration ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px -left-px h-2 w-2 border-t border-l border-brand opacity-0 transition-opacity duration-200 group-hover/spot:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -bottom-px h-2 w-2 border-r border-b border-brand opacity-0 transition-opacity duration-200 group-hover/spot:opacity-100"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
