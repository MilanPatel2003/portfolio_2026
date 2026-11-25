"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Briefcase,
  Code2,
  Copy,
  FolderGit2,
  Github,
  GraduationCap,
  Home,
  Linkedin,
  Mail,
  Music,
  Pause,
  Phone,
  SunMoon,
} from "lucide-react";
import { hero } from "@/data/data";
import { toggleDarkLightTheme } from "@/lib/theme";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState<number | null>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("portfolio:commands", show);
    return () => window.removeEventListener("portfolio:commands", show);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent<{ playing: number | null }>) =>
      setMusicPlaying(e.detail.playing);
    window.addEventListener("music:statechange", handler as EventListener);
    return () =>
      window.removeEventListener("music:statechange", handler as EventListener);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const jumpTo = useCallback(
    (id: string) => {
      run(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [run],
  );

  const playTrack = useCallback((index: number) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("music:play", { detail: { index } }));
  }, []);

  const pauseMusic = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("music:pause"));
  }, []);

  const toggleTheme = useCallback(() => {
    run(() => {
      toggleDarkLightTheme();
    });
  }, [run]);

  const githubHref =
    hero.socialLinks.find((link) => link.name === "GitHub")?.href ??
    "https://github.com/MilanPatel2003";
  const linkedinHref =
    hero.socialLinks.find((link) => link.name === "LinkedIn")?.href ??
    "https://www.linkedin.com/in/milan-patel-37650330b";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[18%] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">
            Command Palette
          </DialogPrimitive.Title>

          <Command className="overflow-hidden border border-border bg-popover font-space-mono text-popover-foreground shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 text-xs text-muted-foreground">
                ~/milan-patel/search
              </span>
            </div>

            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-brand">&gt;</span>
              <Command.Input
                placeholder="Jump to section, copy contact, or play audio..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <Command.List className="max-h-80 overflow-y-auto py-2">
              <Command.Empty className="py-8 text-center text-xs text-muted-foreground">
                No matching command found.
              </Command.Empty>

              {musicPlaying !== null && (
                <Command.Group>
                  <GroupLabel>NOW PLAYING</GroupLabel>
                  <PaletteItem
                    icon={<Pause className="h-3.5 w-3.5" />}
                    onSelect={pauseMusic}
                  >
                    Pause Ambient Music
                  </PaletteItem>
                </Command.Group>
              )}

              <Command.Group>
                <GroupLabel>SECTIONS</GroupLabel>
                <PaletteItem
                  icon={<Home className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("top")}
                >
                  Overview
                </PaletteItem>
                <PaletteItem
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("experience")}
                >
                  Work Experience
                </PaletteItem>
                <PaletteItem
                  icon={<FolderGit2 className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("projects")}
                >
                  Projects
                </PaletteItem>
                <PaletteItem
                  icon={<Code2 className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("skills")}
                >
                  Technical Skills
                </PaletteItem>
                <PaletteItem
                  icon={<GraduationCap className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("education")}
                >
                  Education &amp; Certificates
                </PaletteItem>
                <PaletteItem
                  icon={<Github className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("activity")}
                >
                  GitHub Activity
                </PaletteItem>
                <PaletteItem
                  icon={<Mail className="h-3.5 w-3.5" />}
                  onSelect={() => jumpTo("contact")}
                >
                  Contact
                </PaletteItem>
              </Command.Group>

              <Command.Group>
                <GroupLabel>QUICK ACTIONS</GroupLabel>
                <PaletteItem
                  icon={<Copy className="h-3.5 w-3.5" />}
                  hint={hero.email}
                  onSelect={() =>
                    run(() => navigator.clipboard?.writeText(hero.email))
                  }
                >
                  Copy Email Address
                </PaletteItem>
                <PaletteItem
                  icon={<Phone className="h-3.5 w-3.5" />}
                  hint={hero.phone}
                  onSelect={() =>
                    run(() => navigator.clipboard?.writeText(hero.phone))
                  }
                >
                  Copy Mobile Number
                </PaletteItem>
                <PaletteItem
                  icon={<SunMoon className="h-3.5 w-3.5" />}
                  onSelect={toggleTheme}
                >
                  Toggle Light / Dark Theme
                </PaletteItem>
              </Command.Group>

              <Command.Group>
                <GroupLabel>AMBIENT FOCUS MUSIC</GroupLabel>
                <PaletteItem
                  icon={<Music className="h-3.5 w-3.5" />}
                  onSelect={() => playTrack(0)}
                >
                  Coffee Lofi Chill
                </PaletteItem>
                <PaletteItem
                  icon={<Music className="h-3.5 w-3.5" />}
                  onSelect={() => playTrack(1)}
                >
                  Good Night Lofi Cozy
                </PaletteItem>
                <PaletteItem
                  icon={<Music className="h-3.5 w-3.5" />}
                  onSelect={() => playTrack(2)}
                >
                  Study Calm Peaceful
                </PaletteItem>
              </Command.Group>

              <Command.Group>
                <GroupLabel>PROFILES</GroupLabel>
                <PaletteItem
                  icon={<Github className="h-3.5 w-3.5" />}
                  hint="↗"
                  onSelect={() =>
                    run(() =>
                      window.open(githubHref, "_blank", "noopener,noreferrer"),
                    )
                  }
                >
                  GitHub (@MilanPatel2003)
                </PaletteItem>
                <PaletteItem
                  icon={<Linkedin className="h-3.5 w-3.5" />}
                  hint="↗"
                  onSelect={() =>
                    run(() =>
                      window.open(
                        linkedinHref,
                        "_blank",
                        "noopener,noreferrer",
                      ),
                    )
                  }
                >
                  LinkedIn
                </PaletteItem>
              </Command.Group>
            </Command.List>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
              <span>↑↓ navigate &middot; ↵ select &middot; esc close</span>
              <kbd>⌘K</kbd>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 text-[10px] tracking-widest text-muted-foreground">
      {children}
    </div>
  );
}

function PaletteItem({
  icon,
  children,
  hint,
  onSelect,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
  onSelect?: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="group mx-2 flex cursor-pointer items-center gap-3 px-3 py-2 text-xs text-muted-foreground data-[selected=true]:bg-accent data-[selected=true]:text-brand"
    >
      {icon && (
        <span className="text-muted-foreground group-data-[selected=true]:text-brand">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </Command.Item>
  );
}
