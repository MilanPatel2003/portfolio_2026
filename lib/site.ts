/** Keep canonical metadata, crawler hints, and shared previews on the same domain. */
export const site = {
  url: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://milanpatel.vercel.app",
  ),
  name: "Milan Patel",
  title: "Milan Patel Portfolio — Full-Stack Developer | React & Node.js",
  description:
    "Portfolio of Milan Patel — Full-Stack Developer & Junior SDE in Ahmedabad building React, Next.js, TypeScript, Node.js, PostgreSQL, Stripe & LLM systems.",
  githubUsername: "MilanPatel2003",
  timezone: "Asia/Kolkata",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL?.trim() || "",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || "",
};
