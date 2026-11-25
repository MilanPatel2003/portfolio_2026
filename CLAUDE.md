# CLAUDE.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
node --test tests/*.test.mjs # Run data integrity tests
```

Package manager: **npm**

## Architecture

Personal portfolio site for **Milan Patel** built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS 4**.

### Key Directories

- `app/` — Next.js App Router: single-page portfolio (`app/page.tsx`) with metadata, sitemap, robots, and layout
- `components/ui/` — Reusable UI components (`PortfolioNav`, `HeroSection`, `ExperienceSection`, `ProjectsSection`, `SkillsSection`, `EducationSection`, `GitHubActivity`, `ContactSection`, `CommandPalette`, `MusicPlayer`)
- `data/data.ts` — **All site content lives here** (hero, impact metrics, work experience deliverables, projects, categorized skills, education, certificates). Project & live site URLs can be added directly in `data/data.ts`.
- `lib/site.ts` — Canonical site URL, metadata strings, GitHub username (`MilanPatel2003`), and timezone (`Asia/Kolkata`)
- `public/audio/` — Lo-fi music tracks for the ambient player accessible from the command palette (`⌘K`)

### Theme & Readability

- Supports both **dark mode** (default) and **light mode** via `PortfolioNav`, persisted in `localStorage`
- **OKLCH accent system** (`--brand`) with 5 presets selectable from the header
- Uses **Space Grotesk** for display headings, **Plus Jakarta Sans** for readable body text, and **JetBrains Mono** for technical headers, badges, and metadata
