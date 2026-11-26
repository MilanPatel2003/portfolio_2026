"use client";

import { useEffect, useState, type AnimationEvent } from "react";
import { hero } from "@/data/data";

// Tracks soft client-side navigations (e.g. /projects -> /) without blocking hard reloads
let hasPlayedInRuntime = false;

/**
 * Pure-CSS GPU-composited cloth veil reveal ("curtain lift").
 * Uses only transform & opacity so low-spec devices render it at 60fps
 * without layout reflow or blocking interaction (pointer-events-none).
 */
export function IntroCurtain() {
  const [active, setActive] = useState(() => !hasPlayedInRuntime);

  useEffect(() => {
    if (!active) return;
    const fallback = window.setTimeout(() => {
      hasPlayedInRuntime = true;
      setActive(false);
    }, 1450);
    return () => window.clearTimeout(fallback);
  }, [active]);

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    hasPlayedInRuntime = true;
    setActive(false);
  }

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
      className="intro-curtain pointer-events-none fixed inset-0 z-50 flex select-none flex-col items-center justify-center bg-[#0b0b0f] text-zinc-100"
    >
      {/* Minimal monogram label fading before veil lifts */}
      <div className="intro-curtain-mark flex flex-col items-center gap-3 px-6 text-center">
        <span className="font-display text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
          {hero.name}
        </span>
        <span className="h-[2px] w-12 rounded-full bg-brand" />
      </div>

      {/* Draped cloth bottom curve that tightens smoothly while lifting */}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="intro-curtain-hem absolute top-[calc(100%-1px)] left-0 h-14 w-full text-[#0b0b0f] sm:h-20"
      >
        <path
          d="M0,0 L1440,0 L1440,6 Q720,76 0,6 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
