/** Keep canonical metadata, crawler hints, and shared previews on the same domain. */
export const site = {
  url: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://milanpatel.vercel.app",
  ),
  name: "Milan Patel",
  title: "Milan Patel — Full-Stack Developer | React, Node.js & PostgreSQL",
  description:
    "Full-Stack Developer & Junior SDE in Ahmedabad with 1+ years of experience building scalable React, Next.js, TypeScript, Node.js, PostgreSQL, Stripe & LLM systems.",
  githubUsername: "MilanPatel2003",
  timezone: "Asia/Kolkata",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL?.trim() || "",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || "",
};
