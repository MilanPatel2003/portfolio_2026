import {
  Code2,
  Database,
  CreditCard,
  TestTube2,
  Layers,
  Server,
  Wrench,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";

export interface SocialLink {
  name: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Hero {
  name: string;
  firstName: string;
  lastName: string;
  location: string;
  position: string;
  currentCompany: string;
  currentCompanyLogo: string;
  availability: string;
  summary: string;
  email: string;
  phone: string;
  website: string;
  socialLinks: SocialLink[];
}

export interface SkillGroup {
  category: string;
  icon: LucideIcon;
  items: string[];
}

export interface ArchitectureStep {
  title: string;
  layer: string;
  detail: string;
}

export interface ArchitectureSpec {
  headline: string;
  overview: string;
  steps: ArchitectureStep[];
  safeguards: string[];
}

export interface ExperienceDeliverable {
  name: string;
  logo?: string;
  /** Add Live Site URL here if public. */
  liveUrl?: string;
  stack: string[];
  bullets: string[];
  architecture?: ArchitectureSpec;
}

export interface WorkExperience {
  company: string;
  logo?: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  companyUrl?: string;
  deliverables: ExperienceDeliverable[];
}

export type ProjectCategory =
  | "AI & SaaS"
  | "Full-Stack"
  | "Freelance"
  | "NPM Library"
  | "Frontend & 3D";

export interface Project {
  title: string;
  subtitle: string;
  period: string;
  category: ProjectCategory;
  summary: string;
  highlights: string[];
  tags: string[];
  previewImage?: string;
  liveUrl?: string;
  liveLabel?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Education {
  degree: string;
  shortName: string;
  school: string;
  logo?: string;
  cgpa: string;
  period: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  url?: string;
}

export const hero: Hero = {
  name: "Milan Patel",
  firstName: "Milan",
  lastName: "Patel",
  location: "Ahmedabad, Gujarat",
  position: "Full-Stack Developer",
  currentCompany: "eSparkbiz Technologies Pvt. Ltd.",
  currentCompanyLogo: "/logos/esparkbiz.png",
  availability: "Junior SDE @ eSparkbiz Technologies",
  summary:
    "Full-stack developer with 1+ years of experience building scalable web applications across React, Node.js, and PostgreSQL. Proven track record of delivering end-to-end features, from responsive user interfaces and payment workflows to serverless backends and LLM-powered AI services. Focused on writing clean, maintainable code and optimizing system performance.",
  email: "milanpatel6454@gmail.com",
  phone: "+91 9157770634",
  website: "https://milanpatel.vercel.app",
  socialLinks: [
    {
      name: "GitHub",
      label: "github.com/MilanPatel2003",
      href: "https://github.com/MilanPatel2003",
      icon: Github,
    },
    {
      name: "LinkedIn",
      label: "linkedin.com/in/milan-patel-37650330b",
      href: "https://www.linkedin.com/in/milan-patel-37650330b",
      icon: Linkedin,
    },
    {
      name: "Portfolio",
      label: "milanpatel.vercel.app",
      href: "https://milanpatel.vercel.app",
      icon: Globe,
    },
    {
      name: "Email",
      label: "milanpatel6454@gmail.com",
      href: "mailto:milanpatel6454@gmail.com?subject=Opportunity%20for%20Milan%20Patel",
      icon: Mail,
    },
    {
      name: "Phone",
      label: "+91 9157770634",
      href: "tel:+919157770634",
      icon: Phone,
    },
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    icon: Code2,
    items: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  {
    category: "Frontend",
    icon: Layers,
    items: [
      "React",
      "Next.js",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
  },
  {
    category: "Backend",
    icon: Server,
    items: [
      "Node.js",
      "Express.js",
      "NestJS",
      "REST APIs",
      "Redis",
      "RabbitMQ",
      "BullMQ",
    ],
  },
  {
    category: "Databases",
    icon: Database,
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Sequelize",
      "TypeORM",
      "Prisma",
    ],
  },
  {
    category: "Payments & CRM",
    icon: CreditCard,
    items: ["Stripe", "Razorpay", "HubSpot CRM"],
  },
  {
    category: "Testing",
    icon: TestTube2,
    items: ["Jest", "Playwright"],
  },
  {
    category: "Other",
    icon: Wrench,
    items: ["Elasticsearch", "Algolia", "Docker", "n8n", "LLM"],
  },
];

export const workExperience: WorkExperience[] = [
  {
    company: "eSparkbiz Technologies Pvt. Ltd.",
    logo: "/logos/esparkbiz.png",
    companyUrl: "https://www.esparkinfo.com",
    role: "Junior Software Development Engineer",
    period: "Feb 2026 – Present",
    location: "Ahmedabad, Gujarat",
    current: true,
    deliverables: [
      {
        name: "Brightmont Academy",
        logo: "/logos/brightmont.png",
        liveUrl: "https://www.brightmontacademy.com",
        stack: ["Node.js", "HubSpot CRM", "Webhooks", "Serverless", "LLM"],
        bullets: [
          "Wrote Node.js serverless functions that handle 30,000+ HubSpot CRM webhooks a month, keeping each handler short so responses stay quick.",
          "Cached LLM blog summaries against a hash of the post content, so a post goes back to the model only when its text changes.",
          "Added a checkpoint that saves the API cursor after each batch, so a failed sync restarts from where it stopped without creating duplicate records.",
        ],
        architecture: {
          headline: "Webhook Sync & Hash-Cached LLM Pipeline",
          overview:
            "Serverless HubSpot CRM webhook pipeline handling 30,000+ monthly events with batch cursor recovery and content-hash LLM deduplication.",
          steps: [
            {
              title: "HubSpot CRM Webhooks",
              layer: "Ingress · 30,000+/mo",
              detail:
                "Emits portal webhook events on blog updates and CRM record changes.",
            },
            {
              title: "Node.js Serverless Handlers",
              layer: "Compute",
              detail:
                "Executes short, bounded handlers so webhook acknowledgments return fast without timeouts.",
            },
            {
              title: "API Cursor Checkpointing",
              layer: "State Recovery",
              detail:
                "Persists the API cursor after each processed batch so failed syncs resume cleanly without duplicating records.",
            },
            {
              title: "Content-Hash Cache Check",
              layer: "Cache Layer",
              detail:
                "Hashes blog post text and returns the cached summary unless the post body actually changed.",
            },
            {
              title: "LLM Summarization Service",
              layer: "AI Processing",
              detail:
                "Invoked only on cache misses for modified posts, keeping summaries updated efficiently.",
            },
          ],
          safeguards: [
            "Short handler execution",
            "Per-batch cursor checkpointing",
            "Hash check skips unchanged content",
            "Zero duplicate records on restart",
          ],
        },
      },
      {
        name: "The ASL Shop",
        logo: "/logos/theaslshop.png",
        liveUrl: "https://www.theaslshop.com",
        stack: ["React", "Node.js", "PostgreSQL", "Stripe", "RabbitMQ"],
        bullets: [
          "Built subscription upgrade, downgrade and cancellation flows across 3 plans, combining Stripe proration and cancel-at-period-end with backend logic that keeps a user's access active until the paid period ends.",
          "Wrote a RabbitMQ consumer for 8 Stripe webhook event types that ignores duplicate event IDs and retries failures up to 3 times before sending them to a dead-letter queue.",
          "Created a coupon system stored in PostgreSQL and linked to Stripe, where each coupon can be limited to certain products or plans, with expiry and usage limits checked at checkout.",
          "Added full and partial refunds through Stripe, and saved the refund status in the database from webhooks.",
        ],
        architecture: {
          headline: "Subscriptions, Coupons, Refunds & RabbitMQ Engine",
          overview:
            "Billing architecture connecting React subscription/checkout flows with Stripe APIs, PostgreSQL coupon/refund persistence, and fault-tolerant RabbitMQ webhook processing.",
          steps: [
            {
              title: "Subscription & Checkout UI",
              layer: "React Frontend",
              detail:
                "Handles plan upgrades, downgrades, cancellations across 3 plans, and promo code entry at checkout.",
            },
            {
              title: "Billing & Coupon Validation",
              layer: "Node.js · Stripe API",
              detail:
                "Applies Stripe proration, cancel-at-period-end rules, product/plan coupon scoping, expiry/usage validation, and full/partial refunds.",
            },
            {
              title: "Stripe Webhook Ingress",
              layer: "8 Event Types",
              detail:
                "Captures subscription lifecycle, invoice, and refund webhook events for reliable async reconciliation.",
            },
            {
              title: "RabbitMQ Consumer & DLQ",
              layer: "Message Queue",
              detail:
                "Tracks processed event IDs to skip duplicates and retries failures up to 3 times before dead-letter routing.",
            },
            {
              title: "PostgreSQL Persistence",
              layer: "Primary Database",
              detail:
                "Stores linked Stripe coupons, period-end access entitlements, and verified webhook refund statuses.",
            },
          ],
          safeguards: [
            "Duplicate Stripe event ID guard",
            "Up to 3 retries + dead-letter queue",
            "Cancel-at-period-end access retention",
            "Product, plan, expiry & usage checks",
          ],
        },
      },
    ],
  },
  {
    company: "Webcreta Technologies",
    logo: "/logos/webcreta.png",
    companyUrl: "https://webcreta.com",
    role: "Software Development Intern",
    period: "April 2025 – Aug 2025",
    location: "Ahmedabad, Gujarat",
    current: false,
    deliverables: [
      {
        name: "Milk Ride",
        logo: "/logos/milkride.png",
        liveUrl: "https://milkride.com",
        stack: ["Node.js", "NestJS", "PostgreSQL", "Sequelize"],
        bullets: [
          "Built PostgreSQL data models with Sequelize, covering associations, CRUD operations and relationships, using versioned migrations and schema management.",
          "Implemented server-side pagination with OFFSET/LIMIT for efficient retrieval of large datasets.",
          "Applied NestJS fundamentals: modules, controllers, services, dependency injection, guards, pipes and DTOs, for a scalable backend structure.",
        ],
      },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Innovate Accounting Solutions",
    subtitle: "Freelance Client Platform",
    period: "April 2026",
    category: "Freelance",
    summary:
      "Accounting and business presence platform with automated query handling, Google Sheets operations, and SEO.",
    highlights: [
      "Developed an accounting and introductory business website for a client organization.",
      "Integrated Google Sheets APIs to manage query handling and data operations.",
      "Managed hosting, deployment and ongoing maintenance; improved SEO and added automation workflows for operational efficiency.",
    ],
    tags: ["React", "Google Sheets API", "SEO", "Automation"],
    previewImage: "/projects/innovate-accounting.jpg",
    liveUrl: "https://innovateaccountingsolutions.com/",
    liveLabel: "Live Site",
  },
  {
    title: "PrepOnyx",
    subtitle: "AI SaaS · MCA Final Year Project",
    period: "2025",
    category: "AI & SaaS",
    featured: true,
    summary:
      "Full-stack AI learning SaaS featuring mock interviews, an AI scribbler, a course creator, and PDF summarization.",
    highlights: [
      "Built an AI-powered SaaS platform with mock interviews, an AI scribbler, a course creator and a PDF summarizer.",
      "Integrated generative AI (OpenAI, Gemini) with a Firebase backend and Firestore.",
      "Implemented secure subscription payments with Stripe, handled through Node.js webhooks on Vercel serverless functions.",
    ],
    tags: [
      "React",
      "Node.js",
      "Firebase",
      "LangChain",
      "OpenAI",
      "Gemini",
      "Stripe",
    ],
    previewImage: "/projects/preponyx.webp",
    liveUrl: "https://preponyx.web.app/",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/PrepOnyx",
  },
  {
    title: "React ScreenFlow",
    subtitle: "Open-Source NPM Library",
    period: "Feb 2025",
    category: "NPM Library",
    featured: true,
    summary:
      "Lightweight React animation library built with TypeScript and Framer Motion for smooth, reusable screen transitions.",
    highlights: [
      "Built a React animation library with smooth, reusable screen transitions.",
      "Used TypeScript and Framer Motion for flexibility and performance.",
      "Published as an NPM package that reached 250+ weekly downloads early on.",
    ],
    tags: ["React", "TypeScript", "Framer Motion", "NPM"],
    previewImage: "/projects/react-screenflow.webp",
    liveUrl: "https://www.npmjs.com/package/react-screenflow",
    liveLabel: "NPM Package",
    githubUrl: "https://github.com/MilanPatel2003/react-screenflow",
  },
  {
    title: "Logic Ledger AI MathNotes",
    subtitle: "AI Handwriting Math Solver",
    period: "2024",
    category: "AI & SaaS",
    featured: true,
    summary:
      "AI-powered web app for recognizing and solving math expressions directly from digital canvas drawings.",
    highlights: [
      "Built an interactive drawing canvas in React and TypeScript with shadcn/ui and Tailwind CSS.",
      "Connected a Node.js backend to the Gemini API to interpret handwritten equations and return step-by-step results.",
    ],
    tags: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Node.js",
      "Gemini",
    ],
    previewImage: "/projects/logic-ledger.webp",
    liveUrl: "https://logic-ledger.vercel.app/",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/ai-calculator",
  },
  {
    title: "Tawkist",
    subtitle: "Real-Time MERN Chat App",
    period: "2024",
    category: "Full-Stack",
    summary:
      "Real-time messaging platform featuring JWT authentication, WebSockets, and live online user presence.",
    highlights: [
      "Implemented instant bidirectional messaging and online status tracking using WebSockets.",
      "Built the frontend with React, Vite, Tailwind CSS, and Zustand; secured backend APIs with Node.js, MongoDB, JWT, and Zod.",
    ],
    tags: [
      "React",
      "Vite",
      "Node.js",
      "MongoDB",
      "WebSockets",
      "Tailwind CSS",
      "JWT",
      "Zod",
    ],
    previewImage: "/projects/tawkist.webp",
    liveUrl: "https://tawkist-chat-application.onrender.com",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/Tawkist-Chat-App-MERN-",
  },
  {
    title: "Mini Ecom",
    subtitle: "Modern E-Commerce Platform",
    period: "2024",
    category: "Full-Stack",
    summary:
      "Modern e-commerce storefront featuring product catalog browsing, Redux cart state management, and checkout flows.",
    highlights: [
      "Architected global cart and product filtering state using Redux Toolkit and TypeScript.",
      "Crafted a responsive UI with Tailwind CSS, shadcn/ui, React Router, and Axios.",
    ],
    tags: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Tailwind CSS",
      "shadcn/ui",
      "React Router",
      "Axios",
    ],
    previewImage: "/projects/mini-ecom.webp",
    liveUrl: "https://mini-ecom-redux-learn.vercel.app/",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/MINI-ECOM-REDUX-LEARN",
  },
  {
    title: "Sci-Fi 3D Avatar Customization",
    subtitle: "Interactive WebGL / Three.js App",
    period: "2024",
    category: "Frontend & 3D",
    summary:
      "Interactive 3D avatar customization tool with real-time lighting, material, and model controls in the browser.",
    highlights: [
      "Built real-time 3D scene rendering and camera controls using Three.js and JavaScript.",
      "Added live parameter controls with lil-gui for instant visual customization.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Three.js"],
    previewImage: "/projects/scifi-3d-avatar.webp",
    liveUrl: "https://milanpatel2003.github.io/ThreeJS/",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/ThreeJS",
  },
  {
    title: "Tin Dog",
    subtitle: "Responsive Bootstrap Landing Page",
    period: "2023",
    category: "Frontend & 3D",
    summary:
      "Responsive single-page marketing site designed with Bootstrap components, grid layout, and pricing sections.",
    highlights: [
      "Built mobile-first responsive sections including carousel testimonials and pricing cards using HTML and Bootstrap.",
    ],
    tags: ["HTML", "Bootstrap"],
    previewImage: "/projects/tin-dog.webp",
    liveUrl: "https://milanpatel2003.github.io/bootstrap-practice-website/",
    liveLabel: "Live Demo",
    githubUrl: "https://github.com/MilanPatel2003/bootstrap-practice-website",
  },
];

export const education: Education[] = [
  {
    degree: "Master of Computer Applications",
    shortName: "MCA",
    school: "GLS University",
    logo: "/logos/glsuniversity.png",
    cgpa: "8.0",
    period: "2024 – 2026",
  },
  {
    degree: "Bachelor of Computer Applications",
    shortName: "BCA",
    school: "GLS University",
    logo: "/logos/glsuniversity.png",
    cgpa: "7.9",
    period: "2021 – 2024",
  },
];

export const certificates: Certificate[] = [
  {
    title: "Web Development Bootcamp by Angela Yu",
    issuer: "Udemy",
    url: "https://www.udemy.com/certificate/UC-26baac76-9708-432b-9fea-2c0f5741721e/",
  },
  {
    title: "Data Structures and Algorithms by Andrei Neagoie",
    issuer: "Udemy",
  },
  {
    title: "Software Engineering Job Simulation",
    issuer: "Cisco (Forage)",
    url: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Cisco/kinDTvjiZRcYbwqLo_Cisco_6bM5ZiDpcTzGYqqDs_1728712187984_completion_certificate.pdf",
  },
];
