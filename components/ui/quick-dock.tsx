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
      className={`fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-full border border-border/80 bg-background/95 px-1.5 py-1 font-space-mono text-[11px] shadow-lg transition-all duration-200 sm:right-6 sm:bottom-5 ${
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
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Command className="h-3 w-3 text-brand" />
        <span>⌘K</span>
      </button>
      <span aria-hidden="true" className="h-4 w-px bg-border" />
      <a
        href="#top"
        tabIndex={visible ? 0 : -1}
        aria-label="Back to top"
        className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
      >
        <ArrowUp className="h-3 w-3" />
        <span>Top</span>
      </a>
    </div>
  );
}
