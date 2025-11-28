export interface ServiceSeed {
  name: string;
  tagline: string;
  icon: string;
  href: string;
  subServices: string[];
  order: number;
  price?: string;
}

export const defaultServices: ServiceSeed[] = [
  {
    name: "Automation Workflow / AI Agents",
    icon: "🤖",
    tagline: "Automate customer journeys with AI-first workflows.",
    href: "/services/ai-automation/",
    subServices: [
      "AI Agents & Copilots",
      "Workflow Automation (n8n, Zapier)",
      "Custom Chatbots",
      "Analytics Dashboards",
    ],
    order: 1,
  },
  {
    name: "Digital Marketing",
    icon: "📢",
    tagline: "Performance marketing that turns attention into revenue.",
    href: "/services/",
    subServices: [
      "Social Media Campaigns",
      "Content & Influencer Strategy",
      "SEO & ASO",
      "Performance Ads",
    ],
    order: 2,
  },
  {
    name: "Web / App Development",
    icon: "💻",
    tagline: "High-converting web and mobile experiences built fast.",
    href: "/services/website-development/",
    subServices: [
      "Corporate Websites",
      "Ecommerce Stores",
      "Progressive Web Apps",
      "Mobile Apps (iOS & Android)",
    ],
    order: 3,
  },
  {
    name: "Branding",
    icon: "🎨",
    tagline: "Bold identities that stay consistent across every touchpoint.",
    href: "/services/graphics-design/",
    subServices: [
      "Brand Strategy Sprints",
      "Visual Identity Design",
      "Packaging & Collateral",
      "Brand Playbooks",
    ],
    order: 4,
  },
  {
    name: "Lead Generation",
    icon: "📈",
    tagline: "Demand engines that keep your pipeline full.",
    href: "/#contact",
    subServices: [
      "Paid Media Funnels",
      "Landing Page Optimization",
      "CRM & Marketing Automation",
      "Sales Enablement Content",
    ],
    order: 5,
  },
  {
    name: "Global Expansion (GEO)",
    icon: "🌍",
    tagline: "Localized playbooks to win in every market you enter.",
    href: "/#contact",
    subServices: [
      "Market Localization",
      "Regional Campaign Management",
      "Multi-language SEO",
      "Partnership Activation",
    ],
    order: 6,
  },
];

export function mapRowToService(row: any) {
  let subServices: string[] = [];
  try {
    if (row?.status) {
      const parsed = JSON.parse(row.status as string);
      if (Array.isArray(parsed)) subServices = parsed;
    }
  } catch {
    subServices = [];
  }

  return {
    id: String(row.id),
    name: row.title,
    tagline: row.description,
    icon: row.icon || "📢",
    href: row.category || "/services/",
    subServices,
    order: typeof row.featured === 'number' ? row.featured : 1,
    price: row.price || undefined,
  };
}
