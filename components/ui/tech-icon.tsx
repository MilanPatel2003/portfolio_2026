import type { CSSProperties } from "react";
import {
  Bot,
  Database,
  FlaskConical,
  Layers,
  Network,
  Radio,
  Search,
  Sparkles,
  Webhook,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  siAlgolia,
  siAxios,
  siBootstrap,
  siCisco,
  siCss,
  siDocker,
  siElasticsearch,
  siExpress,
  siFirebase,
  siFramer,
  siGithub,
  siGooglegemini,
  siGooglesheets,
  siHtml5,
  siHubspot,
  siJavascript,
  siJest,
  siJsonwebtokens,
  siLangchain,
  siMongodb,
  siMysql,
  siN8n,
  siNestjs,
  siNodedotjs,
  siNpm,
  siPostgresql,
  siPrisma,
  siPython,
  siRabbitmq,
  siRazorpay,
  siReact,
  siReactquery,
  siReactrouter,
  siRedis,
  siRedux,
  siSequelize,
  siShadcnui,
  siStripe,
  siTailwindcss,
  siThreedotjs,
  siTypeorm,
  siTypescript,
  siUdemy,
  siVite,
  siZod,
  type SimpleIcon,
} from "simple-icons";
import { Badge } from "@/components/ui/badge";

type BrandIconSpec = {
  icon: SimpleIcon;
  lightColor?: string;
  darkColor?: string;
};

const BRAND_ICONS: Record<string, BrandIconSpec> = {
  javascript: {
    icon: siJavascript,
    lightColor: "#CA8A04",
    darkColor: "#F7DF1E",
  },
  typescript: {
    icon: siTypescript,
    lightColor: "#2563EB",
    darkColor: "#3B82F6",
  },
  python: {
    icon: siPython,
    lightColor: "#2563EB",
    darkColor: "#60A5FA",
  },
  react: {
    icon: siReact,
    lightColor: "#0284C7",
    darkColor: "#61DAFB",
  },
  "redux toolkit": {
    icon: siRedux,
    lightColor: "#764ABC",
    darkColor: "#A78BFA",
  },
  "tanstack query": {
    icon: siReactquery,
    lightColor: "#DC2626",
    darkColor: "#FF4154",
  },
  "tailwind css": {
    icon: siTailwindcss,
    lightColor: "#0284C7",
    darkColor: "#38BDF8",
  },
  "shadcn/ui": {
    icon: siShadcnui,
    lightColor: "#18181B",
    darkColor: "#FAFAFA",
  },
  vite: {
    icon: siVite,
    lightColor: "#7C3AED",
    darkColor: "#A78BFA",
  },
  "three.js": {
    icon: siThreedotjs,
    lightColor: "#18181B",
    darkColor: "#FAFAFA",
  },
  bootstrap: {
    icon: siBootstrap,
    lightColor: "#7952B3",
    darkColor: "#A78BFA",
  },
  "react router": {
    icon: siReactrouter,
    lightColor: "#DC2626",
    darkColor: "#F44250",
  },
  axios: {
    icon: siAxios,
    lightColor: "#5A29E4",
    darkColor: "#A78BFA",
  },
  zod: {
    icon: siZod,
    lightColor: "#2563EB",
    darkColor: "#60A5FA",
  },
  jwt: {
    icon: siJsonwebtokens,
    lightColor: "#18181B",
    darkColor: "#F472B6",
  },
  html: { icon: siHtml5, lightColor: "#E34F26", darkColor: "#F97316" },
  css: { icon: siCss, lightColor: "#663399", darkColor: "#A855F7" },
  "node.js": {
    icon: siNodedotjs,
    lightColor: "#16A34A",
    darkColor: "#5FA04E",
  },
  "express.js": {
    icon: siExpress,
    lightColor: "#18181B",
    darkColor: "#FAFAFA",
  },
  nestjs: { icon: siNestjs, lightColor: "#E0234E", darkColor: "#FB7185" },
  redis: { icon: siRedis, lightColor: "#DC2626", darkColor: "#FF4438" },
  rabbitmq: { icon: siRabbitmq, lightColor: "#EA580C", darkColor: "#FF6600" },
  postgresql: {
    icon: siPostgresql,
    lightColor: "#2563EB",
    darkColor: "#60A5FA",
  },
  mysql: { icon: siMysql, lightColor: "#0369A1", darkColor: "#38BDF8" },
  mongodb: { icon: siMongodb, lightColor: "#16A34A", darkColor: "#47A248" },
  sequelize: {
    icon: siSequelize,
    lightColor: "#0284C7",
    darkColor: "#52B0E7",
  },
  typeorm: { icon: siTypeorm, lightColor: "#E11D48", darkColor: "#FE0804" },
  prisma: { icon: siPrisma, lightColor: "#18181B", darkColor: "#E2E8F0" },
  stripe: { icon: siStripe, lightColor: "#4F46E5", darkColor: "#818CF8" },
  razorpay: {
    icon: siRazorpay,
    lightColor: "#0284C7",
    darkColor: "#38BDF8",
  },
  "hubspot crm": {
    icon: siHubspot,
    lightColor: "#EA580C",
    darkColor: "#FF7A59",
  },
  jest: { icon: siJest, lightColor: "#99425B", darkColor: "#E11D48" },
  elasticsearch: {
    icon: siElasticsearch,
    lightColor: "#0D9488",
    darkColor: "#2DD4BF",
  },
  algolia: { icon: siAlgolia, lightColor: "#003DFF", darkColor: "#60A5FA" },
  docker: { icon: siDocker, lightColor: "#0284C7", darkColor: "#38BDF8" },
  n8n: { icon: siN8n, lightColor: "#EA4B71", darkColor: "#FB7185" },
  firebase: {
    icon: siFirebase,
    lightColor: "#D97706",
    darkColor: "#FBBF24",
  },
  langchain: {
    icon: siLangchain,
    lightColor: "#0F766E",
    darkColor: "#2DD4BF",
  },
  gemini: {
    icon: siGooglegemini,
    lightColor: "#4F46E5",
    darkColor: "#8E75B2",
  },
  "framer motion": {
    icon: siFramer,
    lightColor: "#0055FF",
    darkColor: "#60A5FA",
  },
  npm: { icon: siNpm, lightColor: "#CB3837", darkColor: "#EF4444" },
  "google sheets api": {
    icon: siGooglesheets,
    lightColor: "#16A34A",
    darkColor: "#34A853",
  },
  github: { icon: siGithub, lightColor: "#18181B", darkColor: "#FAFAFA" },
  udemy: { icon: siUdemy, lightColor: "#7C3AED", darkColor: "#A435F0" },
  "cisco (forage)": {
    icon: siCisco,
    lightColor: "#0284C7",
    darkColor: "#1BA0D7",
  },
};

const LUCIDE_FALLBACKS: Record<string, LucideIcon> = {
  sql: Database,
  "rest apis": Network,
  bullmq: Layers,
  playwright: FlaskConical,
  webhooks: Webhook,
  serverless: Zap,
  llm: Bot,
  openai: Sparkles,
  seo: Search,
  automation: Workflow,
  websockets: Radio,
};

export function TechIcon({
  name,
  className = "h-3.5 w-3.5 shrink-0",
}: {
  name: string;
  className?: string;
}) {
  const key = name.trim().toLowerCase();
  const brand = BRAND_ICONS[key];

  if (brand) {
    const style = {
      "--icon-light": brand.lightColor ?? `#${brand.icon.hex}`,
      "--icon-dark": brand.darkColor ?? `#${brand.icon.hex}`,
    } as CSSProperties;

    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        style={style}
        className={`${className} text-[var(--icon-light)] dark:text-[var(--icon-dark)]`}
      >
        <path d={brand.icon.path} />
      </svg>
    );
  }

  const FallbackIcon = LUCIDE_FALLBACKS[key] ?? Layers;
  return <FallbackIcon aria-hidden="true" className={`${className} text-brand`} />;
}

export function TechBadge({
  name,
  size = "sm",
  highlighted = false,
}: {
  name: string;
  size?: "sm" | "md";
  highlighted?: boolean;
}) {
  return (
    <Badge
      variant="outline"
      className={`group/tech rounded-none bg-background/80 font-space-mono font-normal transition-all duration-150 hover:-translate-y-0.5 hover:border-brand ${
        highlighted
          ? "border-brand bg-brand/10 text-foreground"
          : "border-border"
      } ${
        size === "md"
          ? "gap-2 px-2.5 py-1 text-xs text-foreground/90"
          : "gap-1.5 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
      }`}
    >
      <TechIcon
        name={name}
        className={`transition-transform duration-150 group-hover/tech:scale-110 ${
          size === "md" ? "h-3.5 w-3.5 shrink-0" : "h-3 w-3 shrink-0"
        }`}
      />
      <span>{name}</span>
    </Badge>
  );
}
