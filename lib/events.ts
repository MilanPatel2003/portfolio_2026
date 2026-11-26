/** Shared portfolio browser events, audio track catalog, and navigation helpers. */

export const LOFI_TRACKS = [
  {
    name: "Coffee Lofi Chill",
    shortName: "Coffee Lofi",
    src: "/audio/coffee-lofi-chill.mp3",
  },
  {
    name: "Good Night Lofi Cozy",
    shortName: "Good Night",
    src: "/audio/good-night-lofi-cozy.mp3",
  },
  {
    name: "Study Calm Peaceful",
    shortName: "Study Calm",
    src: "/audio/study-calm-peaceful.mp3",
  },
] as const;

export type MusicStateDetail = {
  playing: number | null;
};

export function toDeliverableId(name: string): string {
  return `deliverable-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio:toast", { detail: { message } }));
}

export function selectAndScrollToProject(title: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById("projects");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(
    new CustomEvent("portfolio:select-project", { detail: { title } }),
  );
}

export function selectAndScrollToSkill(skill: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById("skills");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(
    new CustomEvent("portfolio:select-skill", { detail: { skill } }),
  );
}

export function focusDeliverableCard(deliverableName: string) {
  if (typeof window === "undefined") return;
  const id = toDeliverableId(deliverableName);
  const el = document.getElementById(id);
  if (!el) {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("deliverable-flash");
  void el.offsetWidth;
  el.classList.add("deliverable-flash");
}

export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("portfolio:commands"));
}

export function openPortfolioChat(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("portfolio:chat", { detail: { prompt } }),
  );
}

export function toggleLofiMusic() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("music:toggle"));
}

export function nextLofiTrack() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("music:next"));
}

export function playLofiTrack(index: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("music:play", { detail: { index } }));
}

export function pauseLofiMusic() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("music:pause"));
}

export function getMailtoHref(
  email: string,
  subject = "Opportunity for Milan Patel",
) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
