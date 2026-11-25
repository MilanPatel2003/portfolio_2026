"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Command, Menu, Moon, Palette, Sun, X } from "lucide-react";
import { toggleDarkLightTheme } from "@/lib/theme";

const NAV_ITEMS = [
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "education", label: "Education", href: "#education" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const;

const ACCENTS = [
  { name: "orange", label: "Amber", color: "oklch(0.64 0.2 38)" },
  { name: "blue", label: "Cobalt", color: "oklch(0.6 0.18 250)" },
  { name: "emerald", label: "Emerald", color: "oklch(0.62 0.17 160)" },
  { name: "purple", label: "Violet", color: "oklch(0.58 0.22 295)" },
  { name: "red", label: "Crimson", color: "oklch(0.58 0.22 25)" },
] as const;

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): "dark" | "light" {
  return "dark";
}

export function PortfolioNav() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const [accentOpen, setAccentOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAccent, setActiveAccent] = useState<string>("orange");
  const [activeSection, setActiveSection] = useState<string>("");

  const headerRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const clickLockRef = useRef<string | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const savedAccent = localStorage.getItem("portfolio:accent");
      const matched = ACCENTS.find((a) => a.name === savedAccent);
      if (matched) {
        document.documentElement.style.setProperty("--brand", matched.color);
        queueMicrotask(() => setActiveAccent(matched.name));
      }
    } catch {
      /* Ignore storage access errors */
    }
  }, []);

  useEffect(() => {
    let rafId = 0;
    let maxScroll = 0;
    let sectionOffsets: { id: string; top: number }[] = [];

    const measure = () => {
      const doc = document.documentElement;
      maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const scrollY = window.scrollY;
      sectionOffsets = NAV_ITEMS.flatMap((item) => {
        const el = document.getElementById(item.id);
        return el
          ? [{ id: item.id, top: el.getBoundingClientRect().top + scrollY }]
          : [];
      });
    };

    const syncScroll = () => {
      rafId = 0;
      const scrollY = window.scrollY;
      const ratio =
        maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }

      const lockedId = clickLockRef.current;
      if (lockedId !== null) {
        setActiveSection((prev) => (prev === lockedId ? prev : lockedId));
        return;
      }

      let nextActive = "";
      if (scrollY >= 140) {
        if (maxScroll > 0 && scrollY >= maxScroll - 32) {
          nextActive = "contact";
        } else {
          for (const section of sectionOffsets) {
            if (scrollY + 148 >= section.top) {
              nextActive = section.id;
            }
          }
        }
      }

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    const scheduleSync = () => {
      if (!rafId) rafId = window.requestAnimationFrame(syncScroll);
    };

    const handleResize = () => {
      measure();
      scheduleSync();
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(document.body);

    measure();
    syncScroll();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!accentOpen && !mobileOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accentOpen && accentRef.current && !accentRef.current.contains(target)) {
        setAccentOpen(false);
      }
      if (mobileOpen && headerRef.current && !headerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccentOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [accentOpen, mobileOpen]);

  function lockSectionBriefly(id: string) {
    clickLockRef.current = id;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      clickLockRef.current = null;
    }, 650);
  }

  function handleNavClick(id: string) {
    lockSectionBriefly(id);
    setActiveSection(id);
    setMobileOpen(false);
  }

  function handleBrandClick() {
    lockSectionBriefly("");
    setActiveSection("");
    setMobileOpen(false);
  }

  function toggleTheme() {
    toggleDarkLightTheme();
  }

  function selectAccent(accent: (typeof ACCENTS)[number]) {
    setActiveAccent(accent.name);
    document.documentElement.style.setProperty("--brand", accent.color);
    try {
      localStorage.setItem("portfolio:accent", accent.name);
    } catch {
      /* Ignore storage errors */
    }
    setAccentOpen(false);
  }

  function openCommands() {
    setMobileOpen(false);
    setAccentOpen(false);
    window.dispatchEvent(new Event("portfolio:commands"));
  }

  return (
    <header
      ref={headerRef}
      className="pointer-events-none sticky top-2.5 z-40 mt-2.5 px-3 sm:top-3 sm:mt-3 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 rounded-full border border-border/80 bg-background/90 px-4 shadow-[0_10px_36px_-10px_rgba(0,0,0,0.16)] backdrop-blur-md sm:h-16 sm:px-8 dark:border-white/15 dark:shadow-[0_14px_42px_-10px_rgba(0,0,0,0.65)]">
        {/* Navbar Bust Avatar with crisp "Hey!" speech pop-up on hover */}
        <a
          href="#top"
          onClick={handleBrandClick}
          aria-label="Milan Patel — Back to top"
          className="group/navavatar relative flex h-14 w-12 shrink-0 items-end justify-center sm:h-16 sm:w-14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="relative flex h-full w-full items-end justify-center overflow-hidden">
            <Image
              src="/avatar/milan-avatar-nav-v4.png"
              alt="Milan Patel avatar"
              width={54}
              height={64}
              priority
              className="h-full w-auto max-w-none select-none object-contain object-bottom"
            />
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-full left-1/2 z-50 mt-2.5 flex -translate-x-1/2 -translate-y-1 scale-75 items-center gap-1.5 whitespace-nowrap rounded-full border border-brand/45 bg-popover px-3 py-1 font-space-mono text-[11px] font-semibold text-popover-foreground opacity-0 shadow-md transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/navavatar:translate-y-0 group-hover/navavatar:scale-100 group-hover/navavatar:opacity-100 group-focus-visible/navavatar:translate-y-0 group-focus-visible/navavatar:scale-100 group-focus-visible/navavatar:opacity-100 motion-reduce:transition-none"
          >
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-t border-l border-brand/45 bg-popover" />
            <span>Hey!</span>
            <span className="text-brand">👋</span>
          </span>
        </a>

        {/* Desktop Segmented Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-0.5 rounded-full border border-border/80 bg-muted/35 p-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-space-mono text-xs transition-colors duration-150 focus-visible:outline-none ${
                  isActive
                    ? "border border-border bg-background text-foreground shadow-xs"
                    : "border border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full transition-opacity duration-150 ${
                    isActive ? "bg-brand opacity-100" : "opacity-0"
                  }`}
                />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={openCommands}
            className="inline-flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-border bg-background/90 font-space-mono text-xs text-muted-foreground transition-colors hover:border-brand hover:text-foreground focus-visible:border-brand focus-visible:outline-none sm:w-auto sm:px-3"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5 text-brand" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded-full border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <div ref={accentRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setAccentOpen((open) => !open);
              }}
              aria-label="Choose accent color"
              aria-expanded={accentOpen}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:outline-none ${
                accentOpen ? "border-brand text-brand" : ""
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
            </button>

            {accentOpen && (
              <div
                role="menu"
                aria-label="Accent color presets"
                className="absolute right-[-44px] top-11 z-50 flex items-center gap-1.5 rounded-full border border-border bg-popover p-2 shadow-lg sm:right-0"
              >
                {ACCENTS.map((accent) => (
                  <button
                    key={accent.name}
                    type="button"
                    role="menuitemradio"
                    aria-checked={activeAccent === accent.name}
                    aria-label={`Set accent color to ${accent.label}`}
                    title={accent.label}
                    onClick={() => selectAccent(accent)}
                    className="flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline-1 focus-visible:outline-brand"
                  >
                    <span
                      className={`h-4 w-4 rounded-full ${
                        activeAccent === accent.name
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-popover"
                          : ""
                      }`}
                      style={{ backgroundColor: accent.color }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:outline-none"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setAccentOpen(false);
              setMobileOpen((open) => !open);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:border-brand hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Clipped zero-rerender scroll-progress indicator inside floating pill */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <div
            ref={progressRef}
            className="absolute right-0 bottom-0 left-0 h-[2px] origin-left bg-brand/90"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      {/* Detached Floating Mobile Dropdown Navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile section navigation"
          className="pointer-events-auto mx-auto mt-2.5 max-w-5xl rounded-2xl border border-border/80 bg-background/95 p-3 shadow-xl backdrop-blur-md md:hidden"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2.5 font-space-mono text-xs transition-colors ${
                    isActive
                      ? "border-brand bg-brand/10 font-semibold text-foreground"
                      : "border-border/70 bg-muted/20 text-muted-foreground hover:border-brand/50 hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-brand" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
