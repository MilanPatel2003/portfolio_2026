"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LOFI_TRACKS } from "@/lib/events";

export function MusicPlayer() {
  const [playing, setPlaying] = useState<number | null>(null);
  const playingRef = useRef<number | null>(null);
  const lastIndexRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause();
    playingRef.current = null;
    setPlaying(null);
  }, []);

  const startTrack = useCallback((rawIndex: number) => {
    const index =
      ((rawIndex % LOFI_TRACKS.length) + LOFI_TRACKS.length) % LOFI_TRACKS.length;
    audioRef.current?.pause();
    const audio = new Audio(LOFI_TRACKS[index].src);
    audio.loop = true;
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => {
      playingRef.current = null;
      setPlaying(null);
    });
    audioRef.current = audio;
    lastIndexRef.current = index;
    playingRef.current = index;
    setPlaying(index);
  }, []);

  // Broadcast state so the command palette, nav, and quick dock stay in sync
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("music:statechange", { detail: { playing } }),
    );
  }, [playing]);

  useEffect(() => {
    const onPause = () => stopPlayback();

    const onPlay = (event: CustomEvent<{ index?: number }>) => {
      const requested = event.detail?.index ?? lastIndexRef.current;
      if (playingRef.current === requested) {
        stopPlayback();
        return;
      }
      startTrack(requested);
    };

    const onToggle = () => {
      if (playingRef.current !== null) {
        stopPlayback();
      } else {
        startTrack(lastIndexRef.current);
      }
    };

    const onNext = () => {
      const next =
        playingRef.current === null
          ? 0
          : (playingRef.current + 1) % LOFI_TRACKS.length;
      startTrack(next);
    };

    window.addEventListener("music:pause", onPause);
    window.addEventListener("music:play", onPlay as EventListener);
    window.addEventListener("music:toggle", onToggle);
    window.addEventListener("music:next", onNext);
    return () => {
      audioRef.current?.pause();
      window.removeEventListener("music:pause", onPause);
      window.removeEventListener("music:play", onPlay as EventListener);
      window.removeEventListener("music:toggle", onToggle);
      window.removeEventListener("music:next", onNext);
    };
  }, [startTrack, stopPlayback]);

  return null;
}
