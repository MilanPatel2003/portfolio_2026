"use client";

import type { ReactNode } from "react";
import { selectAndScrollToSkill } from "@/lib/events";

/** Interactive wrapper linking a tech badge to its entry in the Technical Skills inspector. */
export function SkillJumpButton({
  skill,
  children,
}: {
  skill: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => selectAndScrollToSkill(skill)}
      title={`Inspect ${skill} in Technical Skills`}
      aria-label={`Inspect ${skill} in Technical Skills`}
      className="inline-flex cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-brand active:scale-95"
    >
      {children}
    </button>
  );
}
