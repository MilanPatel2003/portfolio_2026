"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { site } from "@/lib/site";

function getBrandColor(): string {
  const inline = document.documentElement.style.getPropertyValue("--brand");
  if (inline) return inline.trim();
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--brand")
    .trim();
}

function getStats(data: Activity[]) {
  let longest = 0;
  let run = 0;
  for (const day of data) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  const end = data.at(-1)?.count === 0 ? data.length - 2 : data.length - 1;
  for (let i = end; i >= 0 && data[i].count > 0; i--) current++;
  return [
    ["Contributions", data.reduce((total, day) => total + day.count, 0)],
    ["Active days", data.filter((day) => day.count > 0).length],
    ["Longest streak", `${longest}d`],
    ["Current streak", `${current}d`],
  ] as const;
}

export function GitHubActivity({ fit = false }: { fit?: boolean }) {
  const [data, setData] = useState<Activity[] | null>(null);
  const [brandColor, setBrandColor] = useState<string>("oklch(0.64 0.2 38)");
  const [isDark, setIsDark] = useState(true);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );
  const [compact, setCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fitWidth, setFitWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!fit || !el) return;
    const observer = new ResizeObserver(([entry]) =>
      setFitWidth(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, data]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    const timer = setTimeout(update, 0);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [data, compact]);

  useEffect(() => {
    const syncThemeAndBrand = () => {
      setBrandColor(getBrandColor() || "oklch(0.64 0.2 38)");
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    const observer = new MutationObserver(syncThemeAndBrand);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    const timer = setTimeout(syncThemeAndBrand, 0);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${site.githubUsername}?y=last`,
    )
      .then((res) => res.json())
      .then((json) =>
        setData(Array.isArray(json.contributions) ? json.contributions : []),
      )
      .catch(() => setData([]));
  }, []);

  const colorCustomization = useCallback(() => {
    const base = isDark ? "#27272a" : "#e4e4e7";
    return {
      dark: [
        base,
        `color-mix(in oklch, ${brandColor} 25%, ${base})`,
        `color-mix(in oklch, ${brandColor} 50%, ${base})`,
        `color-mix(in oklch, ${brandColor} 75%, ${base})`,
        brandColor,
      ] as [string, string, string, string, string],
      light: [
        base,
        `color-mix(in oklch, ${brandColor} 28%, ${base})`,
        `color-mix(in oklch, ${brandColor} 52%, ${base})`,
        `color-mix(in oklch, ${brandColor} 76%, ${base})`,
        brandColor,
      ] as [string, string, string, string, string],
    };
  }, [brandColor, isDark]);

  if (data === null || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${fit ? "min-h-[168px]" : "min-h-[180px]"}`}
        role="status"
      >
        <p className="font-space-mono text-xs text-muted-foreground">
          {data === null
            ? "Fetching GitHub contributions…"
            : "GitHub contributions unavailable offline or at the moment."}
        </p>
      </div>
    );
  }

  const fitBlock = Math.max(6, Math.min(13, Math.floor(fitWidth / 53) - 2));

  return (
    <>
      <div ref={scrollRef} className="no-scrollbar w-full overflow-x-auto">
        <div className="mx-auto w-fit">
          <ActivityCalendar
            data={data}
            theme={colorCustomization()}
            colorScheme={isDark ? "dark" : "light"}
            blockSize={fit ? fitBlock : compact ? 9 : 12}
            blockRadius={2}
            blockMargin={fit ? 2 : compact ? 2 : 3}
            fontSize={11}
            showColorLegend
            showTotalCount={!fit}
            renderBlock={(block, activity) => {
              const label = `${
                activity.count === 0
                  ? "No"
                  : `${activity.count} contribution${
                      activity.count === 1 ? "" : "s"
                    }`
              } on ${activity.date}`;
              return React.cloneElement(block, {
                onMouseEnter: (e: React.MouseEvent) =>
                  setTip({ x: e.clientX, y: e.clientY, text: label }),
                onMouseMove: (e: React.MouseEvent) =>
                  setTip((t) =>
                    t ? { ...t, x: e.clientX, y: e.clientY } : null,
                  ),
                onMouseLeave: () => setTip(null),
              });
            }}
            style={{
              fontFamily: "var(--font-space-mono)",
              color: isDark ? "#a1a1aa" : "#52525b",
            }}
          />
        </div>
      </div>

      {fit && (
        <dl className="activity-stats mt-5 grid grid-cols-2 gap-3 border-t border-border/70 pt-4 sm:grid-cols-4">
          {getStats(data).map(([label, value]) => (
            <div
              key={label}
              className="border border-border/60 bg-muted/15 px-3 py-2"
            >
              <dt className="font-space-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 font-space-mono text-lg font-bold text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {tip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full border border-border bg-popover px-2.5 py-1 font-space-mono text-xs whitespace-nowrap text-popover-foreground shadow-lg"
          style={{
            left: `clamp(90px, ${tip.x}px, calc(100vw - 90px))`,
            top: tip.y - 8,
          }}
        >
          {tip.text}
        </div>
      )}
    </>
  );
}
