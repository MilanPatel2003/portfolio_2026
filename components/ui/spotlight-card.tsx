"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tactile surface with a zero-rerender pointer-tracking radial border/surface glow
 * and subtle architectural corner ticks on hover.
 */
export function SpotlightCard({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
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
      id={id}
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
        className="pointer-events-none absolute -top-px -left-px h-2 w-2 origin-top-left scale-75 border-t border-l border-brand opacity-0 transition-[opacity,transform] duration-200 group-hover/spot:scale-100 group-hover/spot:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -bottom-px h-2 w-2 origin-bottom-right scale-75 border-r border-b border-brand opacity-0 transition-[opacity,transform] duration-200 group-hover/spot:scale-100 group-hover/spot:opacity-100"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
