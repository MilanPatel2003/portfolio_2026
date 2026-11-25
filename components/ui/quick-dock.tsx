"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Command } from "lucide-react";

export function QuickDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const sync = () => {
      rafId = 0;
      const shouldShow = window.scrollY > 360;
      setVisible((prev) => (prev === shouldShow ? prev : shouldShow));
    };
    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-3.5 bottom-3.5 z-40 flex items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 font-space-mono text-[11px] shadow-lg transition-all duration-200 sm:right-6 sm:bottom-5 sm:px-1.5 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => window.dispatchEvent(new Event("portfolio:commands"))}
        aria-label="Open command palette"
        className="hidden h-8 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
      >
        <Command className="h-3 w-3 text-brand" />
        <span>⌘K</span>
      </button>
      <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:inline-block" />
      <a
        href="#top"
        tabIndex={visible ? 0 : -1}
        aria-label="Back to top"
        className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-brand sm:px-3"
      >
        <ArrowUp className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
        <span>Top</span>
      </a>
    </div>
  );
}
