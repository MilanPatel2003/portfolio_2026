"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Command, Music, Pause, SkipForward } from "lucide-react";
import {
  LOFI_TRACKS,
  nextLofiTrack,
  openCommandPalette,
  toggleLofiMusic,
} from "@/lib/events";

export function QuickDock() {
  const [scrolled, setScrolled] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  useEffect(() => {
    let rafId = 0;
    const sync = () => {
      rafId = 0;
      const shouldShow = window.scrollY > 360;
      setScrolled((prev) => (prev === shouldShow ? prev : shouldShow));
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

  useEffect(() => {
    const onMusicState = (event: CustomEvent<{ playing: number | null }>) => {
      setPlayingTrack(event.detail?.playing ?? null);
    };
    window.addEventListener("music:statechange", onMusicState as EventListener);
    return () => {
      window.removeEventListener(
        "music:statechange",
        onMusicState as EventListener,
      );
    };
  }, []);

  const currentTrack =
    playingTrack !== null ? LOFI_TRACKS[playingTrack] : null;

  return (
    <div className="fixed left-3.5 bottom-3.5 z-40 flex max-w-[calc(100vw-8.5rem)] items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 font-space-mono text-[11px] shadow-lg backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-200 sm:left-6 sm:bottom-5 sm:max-w-none sm:px-1.5">
      <button
        type="button"
        onClick={toggleLofiMusic}
        aria-label={
          currentTrack
            ? `Pause ${currentTrack.name}`
            : "Play ambient lo-fi music"
        }
        aria-pressed={currentTrack !== null}
        className={`inline-flex h-8 min-w-0 items-center gap-1.5 rounded-full px-2.5 transition-all duration-150 active:scale-95 sm:px-3 ${
          currentTrack
            ? "bg-brand/12 text-foreground hover:bg-brand/20"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {currentTrack ? (
          <>
            <span
              aria-hidden="true"
              className="flex h-3 shrink-0 items-end gap-[2px]"
            >
              <span className="eq-bar h-2 w-[2px] rounded-full bg-brand [animation-delay:0ms]" />
              <span className="eq-bar h-3 w-[2px] rounded-full bg-brand [animation-delay:220ms]" />
              <span className="eq-bar h-2 w-[2px] rounded-full bg-brand [animation-delay:120ms]" />
            </span>
            <Pause className="h-3 w-3 shrink-0 text-brand" />
            <span className="truncate">{currentTrack.shortName}</span>
          </>
        ) : (
          <>
            <Music className="h-3 w-3 shrink-0 text-brand" />
            <span>Lo-Fi</span>
          </>
        )}
      </button>

      {currentTrack && (
        <button
          type="button"
          onClick={nextLofiTrack}
          aria-label="Next lo-fi track"
          title="Next track"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-brand active:scale-90 animate-in fade-in-0 zoom-in-95"
        >
          <SkipForward className="h-3 w-3" />
        </button>
      )}

      {scrolled && (
        <div className="flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2 duration-200">
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-border sm:inline-block"
          />
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="hidden h-8 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-95 sm:inline-flex"
          >
            <Command className="h-3 w-3 text-brand" />
            <span>⌘K</span>
          </button>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to top"
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-brand active:scale-95 sm:px-3"
          >
            <ArrowUp className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            <span>Top</span>
          </a>
        </div>
      )}
    </div>
  );
}
