import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { CommandPalette } from "@/components/ui/command-palette";
import { MusicPlayer } from "@/components/ui/music-player";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  applicationName: `${site.name} Portfolio`,
  description: site.description,
  keywords: [
    "Milan Patel",
    "Milan Patel portfolio",
    "Milan Patel developer",
    "Milan Patel Ahmedabad",
    "Milan Patel eSparkbiz",
    "MilanPatel2003",
    "Full-Stack Developer",
    "Junior SDE",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "NestJS",
    "PostgreSQL",
    "Stripe Integration",
    "Serverless Backend",
    "LLM AI Services",
    "PrepOnyx",
    "React ScreenFlow",
    "Innovate Accounting Solutions",
    "GLS University MCA",
  ],
  authors: [{ name: site.name, url: site.url.href }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    firstName: "Milan",
    lastName: "Patel",
    username: site.githubUsername,
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Milan Patel — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og-image.png"],
  },
  ...(site.googleSiteVerification
    ? { verification: { google: site.googleSiteVerification } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-48x48.png",
  },
};

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <MusicPlayer />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
