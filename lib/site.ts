/** Keep canonical metadata, crawler hints, and shared previews on the same domain. */
export const site = {
  url: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://milanpatel.vercel.app",
  ),
  name: "Milan Patel",
  title: "Milan Patel | Full-Stack Developer",
  description:
    "Full-stack developer with 1+ years of experience building scalable web applications across React, Node.js, and PostgreSQL, from payment workflows to serverless backends and LLM-powered AI services.",
  githubUsername: "MilanPatel2003",
  timezone: "Asia/Kolkata",
};
