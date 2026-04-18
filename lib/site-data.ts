export type ContentCategory = "tech" | "travel" | "thoughts" | "quant";

export type SearchItem = {
  kind: "Blog" | "Gallery" | "Recent";
  title: string;
  subtitle: string;
  path: string;
  keywords?: string[];
};

export type SocialItem = {
  name: string;
  url: string;
  ico: string;
};

export type NowItem = {
  l: string;
  v: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  date: string;
  cat: ContentCategory;
  ex: string;
  coverImage: string;
  body: unknown[];
  tags: string[];
};

export type GalleryPhoto = {
  url: string;
  caption?: string;
};

export type GalleryItem = {
  title: string;
  slug: string;
  location: string;
  date: string;
  cover: string;
  desc: string;
  photos: GalleryPhoto[];
  tags?: string[];
  lightroomShareUrl?: string;
};

export type RecentItem = {
  title: string;
  type: "tech" | "travel" | "thoughts" | "gallery";
  date: string;
  img: string;
  tall?: boolean;
  path: string;
};

export type ExperienceItem = {
  co: string;
  role: string;
  when: string;
  where: string;
  hl: string[];
  side: "left" | "right";
  pri?: boolean;
};

export type EducationItem = {
  school: string;
  deg: string;
  sub: string;
  when: string;
  gpa: string;
  tags: string[];
};

export type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  stats: Array<{ l: string; v: string }>;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  bio: string;
  heroImages: string[];
  quotes: string[];
  socialLinks: SocialItem[];
  contactEmail: string;
  contactFormEndpoint: string;
  newsletterEndpoint: string;
  textureOverlayLight: string;
  textureOverlayDark: string;
};

export type SiteContent = {
  settings: SiteSettings;
  nowItems: NowItem[];
  blogs: BlogPost[];
  galleries: GalleryItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: Record<string, string[]>;
  project: ProjectItem;
  recent: RecentItem[];
  searchItems: SearchItem[];
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1400&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80",
  "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=1400&q=80"
];

const BLOGS: BlogPost[] = [
  {
    title: "StockSpectra: From Idea to Impact",
    slug: "stockspektra-idea-to-impact",
    date: "2024-11-12",
    cat: "tech",
    ex: "My tool for Indian equities.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tags: ["trading", "machine-learning", "nse"],
    body: [
      "StockSpektra started as a notebook and became a full workflow that combines signal generation, risk filters, and execution discipline.",
      "This is the fallback demo content. Once Sanity is configured, publish real long-form posts and they will render automatically on /blog/[slug]."
    ]
  },
  {
    title: "My Writing Style and StoryBrand",
    slug: "writing-style-and-storybrand",
    date: "2024-11-04",
    cat: "thoughts",
    ex: "Bringing theory to practice.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
    tags: ["writing", "branding"],
    body: [
      "Writing sharpens thinking. I treat each article as a way to clarify one practical idea.",
      "This post is currently using local fallback content."
    ]
  },
  {
    title: "Moidan",
    slug: "moidan",
    date: "2024-11-02",
    cat: "travel",
    ex: "The soul of Kolkata.",
    coverImage: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&q=80",
    tags: ["kolkata", "travel"],
    body: [
      "Open fields, old stories, and the city moving around them.",
      "Use this as placeholder text until your CMS content is live."
    ]
  },
  {
    title: "Bullet Baba",
    slug: "bullet-baba",
    date: "2023-06-26",
    cat: "travel",
    ex: "Temple worshipping a Royal Enfield.",
    coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
    tags: ["travel", "culture"],
    body: [
      "Roadside legends make India unforgettable.",
      "Replace this with migrated WordPress content in Sanity."
    ]
  },
  {
    title: "The Queen of the Hills",
    slug: "queen-of-the-hills",
    date: "2023-06-16",
    cat: "travel",
    ex: "Shimla, Himachal's finest.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    tags: ["shimla", "hills"],
    body: ["A short ride, cool air, and slower mornings."]
  },
  {
    title: "Ghat Banarasiya",
    slug: "ghat-banarasiya",
    date: "2023-06-08",
    cat: "travel",
    ex: "A city as old as tradition.",
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
    tags: ["varanasi", "ghat"],
    body: ["The river becomes a timeline of faith and rhythm."]
  }
];

const GALLERIES: GalleryItem[] = [
  {
    title: "Wildlife at Home",
    slug: "wildlife-at-home",
    location: "Rajasthan",
    date: "2024-06-15",
    cover: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=900&q=80",
    desc: "Wildlife of Rajasthan.",
    photos: [
      { url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&q=80" }
    ]
  },
  {
    title: "Kumartuli",
    slug: "kumartuli",
    location: "Kolkata",
    date: "2023-06-19",
    cover: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=900&q=80",
    desc: "Birthplace of Durga Puja idols.",
    photos: [
      { url: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80" }
    ]
  },
  {
    title: "Republic Day",
    slug: "republic-day",
    location: "Delhi",
    date: "2023-01-26",
    cover: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=900&q=80",
    desc: "Republic Day parade practice.",
    photos: [
      { url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" }
    ]
  },
  {
    title: "Pink Mornings",
    slug: "pink-mornings",
    location: "Jaipur",
    date: "2023-06-10",
    cover: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80",
    desc: "Mornings in the Pink City.",
    photos: [
      { url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" }
    ]
  }
];

const RECENT: RecentItem[] = [
  {
    title: "StockSpectra",
    type: "tech",
    date: "2024-11-12",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    tall: true,
    path: "/blog/stockspektra-idea-to-impact"
  },
  {
    title: "Moidan",
    type: "travel",
    date: "2024-11-02",
    img: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=400&q=80",
    path: "/blog/moidan"
  },
  {
    title: "Writing Style",
    type: "thoughts",
    date: "2024-11-04",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    path: "/blog/writing-style-and-storybrand"
  },
  {
    title: "Wildlife",
    type: "gallery",
    date: "2024-06-15",
    img: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&q=80",
    tall: true,
    path: "/gallery/wildlife-at-home"
  },
  {
    title: "Pink Mornings",
    type: "travel",
    date: "2023-06-10",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80",
    path: "/gallery/pink-mornings"
  },
  {
    title: "Ghat Banarasiya",
    type: "travel",
    date: "2023-06-08",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80",
    path: "/blog/ghat-banarasiya"
  },
  {
    title: "Bullet Baba",
    type: "travel",
    date: "2023-06-26",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
    tall: true,
    path: "/blog/bullet-baba"
  },
  {
    title: "Republic Day",
    type: "gallery",
    date: "2023-01-26",
    img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=80",
    path: "/gallery/republic-day"
  },
  {
    title: "Queen of Hills",
    type: "travel",
    date: "2023-06-16",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    path: "/blog/queen-of-the-hills"
  },
  {
    title: "Kumartuli",
    type: "gallery",
    date: "2023-06-19",
    img: "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=400&q=80",
    tall: true,
    path: "/gallery/kumartuli"
  }
];

const EDUCATION: EducationItem[] = [
  {
    school: "Carnegie Mellon University",
    deg: "MS Business Analytics",
    sub: "Tepper School of Business",
    when: "2024-2025",
    gpa: "3.88",
    tags: ["ML", "Financial Analytics", "Strategy and AI", "Supply Chain", "Optimization"]
  },
  {
    school: "Manipal Institute of Technology",
    deg: "B.Tech Mechatronics",
    sub: "Minor in Data Science",
    when: "2019-2023",
    gpa: "3.24",
    tags: ["Python", "R", "Robotics", "Automation"]
  }
];

const EXPERIENCE: ExperienceItem[] = [
  {
    co: "Potest AI",
    role: "Intern",
    when: "Jul 2025 - Present",
    where: "Pittsburgh",
    hl: ["Analytics for cafes", "Sales and clients"],
    side: "right"
  },
  {
    co: "Quail",
    role: "AI Engineer",
    when: "Jun - Aug 2025",
    where: "Pittsburgh",
    hl: ["SEC filing agent", "Fund analysis automation", "GTM 50+ clients"],
    side: "left"
  },
  {
    co: "Raymond James",
    role: "Data Science Capstone",
    when: "Jan - Apr 2025",
    where: "Pittsburgh",
    hl: ["LSTM spending prediction", "Advisor clustering", "Tableau + AWS + SageMaker"],
    pri: true,
    side: "right"
  },
  {
    co: "EXL Services",
    role: "RPA Engineer",
    when: "Sep 2023 - Mar 2024",
    where: "Noida",
    hl: ["NLP - 90% time savings", "Prototyping for BFSI", "Power BI dashboards"],
    pri: true,
    side: "left"
  },
  {
    co: "Bain & Company",
    role: "Data Ops",
    when: "Jan - Jun 2023",
    where: "Gurugram",
    hl: ["Pipeline - 80% reduction", "GenAI A/B testing", "Trained 4 interns"],
    pri: true,
    side: "right"
  },
  {
    co: "Genpact",
    role: "Data Analyst Intern",
    when: "Jul - Oct 2020",
    where: "Remote",
    hl: ["R Shiny dashboards"],
    side: "left"
  }
];

const SKILLS: Record<string, string[]> = {
  Languages: ["Python", "R", "SQL", "C++"],
  "ML and AI": ["XGBoost", "LSTM", "Clustering", "NLP", "RAG"],
  Data: ["ETL/ELT", "Feature Eng.", "Viz", "MLOps"],
  Tools: ["Tableau", "Power BI", "Alteryx", "Git"],
  Cloud: ["AWS", "Azure", "Snowflake"],
  Design: ["Lightroom", "Photoshop"]
};

const SOCIALS: SocialItem[] = [
  { name: "LinkedIn", url: "https://linkedin.com/in/bhaveshjain", ico: "Li" },
  { name: "GitHub", url: "https://github.com/bhaveshjain", ico: "Gh" },
  { name: "Instagram", url: "https://instagram.com/bhaveshjain", ico: "Ig" },
  { name: "Email", url: "mailto:hello@bhaveshjain.in", ico: "@" }
];

const NOW_ITEMS: NowItem[] = [
  { l: "building", v: "StockSpektra - paper trading S1a" },
  { l: "working", v: "Potest AI - analytics" },
  { l: "trading", v: "MCX Gold and Silver" },
  { l: "reading", v: "Advances in Financial ML" }
];

const SETTINGS: SiteSettings = {
  siteName: "Bhavesh Jain",
  tagline: "Quant Builder - Traveller - Photographer",
  bio:
    "From data pipelines at Bain to NLP systems at EXL and LSTM forecasting at Raymond James, I turn raw data into deployed models. Behind the lens, I chase light across India's ghats, mountains, and streets.",
  heroImages: HERO_IMAGES,
  quotes: [
    "Explore. Experiment. Experience.",
    "It does not matter where you start, it is how you progress.",
    "Markets are feedback. Travel is perspective."
  ],
  socialLinks: SOCIALS,
  contactEmail: "hello@bhaveshjain.in",
  contactFormEndpoint: "",
  newsletterEndpoint: "",
  textureOverlayLight: "",
  textureOverlayDark: ""
};

const PROJECT: ProjectItem = {
  title: "StockSpektra",
  subtitle: "AI equity analytics",
  description:
    "Quantitative trading platform for NSE equities. LightGBM, walk-forward backtested over 9 years with approximately 65% win rate.",
  techStack: ["Python", "SQL", "LightGBM", "Streamlit", "APIs", "CI/CD"],
  stats: [
    { l: "Win rate", v: "~65%" },
    { l: "Trades", v: "703+" },
    { l: "Years", v: "9" },
    { l: "Stack", v: "Full" }
  ]
};

export function formatMonthYear(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric"
  }).format(parsed);
}

export function formatLongDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

export function splitFirstWord(text: string): { first: string; rest: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { first: "", rest: "" };
  }
  const [first, ...rest] = trimmed.split(/\s+/);
  return {
    first,
    rest: rest.join(" ")
  };
}

export function buildSearchItems(content: Pick<SiteContent, "blogs" | "galleries" | "recent">): SearchItem[] {
  return [
    ...content.blogs.map((post) => ({
      kind: "Blog" as const,
      title: post.title,
      subtitle: `${post.cat} - ${formatMonthYear(post.date)}`,
      path: `/blog/${post.slug}`,
      keywords: [post.cat, ...post.tags]
    })),
    ...content.galleries.map((gallery) => ({
      kind: "Gallery" as const,
      title: gallery.title,
      subtitle: `${gallery.location} - ${formatMonthYear(gallery.date)}`,
      path: `/gallery/${gallery.slug}`,
      keywords: [gallery.location, ...(gallery.tags ?? [])]
    })),
    ...content.recent.map((item) => ({
      kind: "Recent" as const,
      title: item.title,
      subtitle: `${item.type} - ${formatMonthYear(item.date)}`,
      path: item.path,
      keywords: [item.type]
    }))
  ];
}

export const FALLBACK_SITE_CONTENT: SiteContent = {
  settings: SETTINGS,
  nowItems: NOW_ITEMS,
  blogs: BLOGS,
  galleries: GALLERIES,
  education: EDUCATION,
  experience: EXPERIENCE,
  skills: SKILLS,
  project: PROJECT,
  recent: RECENT,
  searchItems: buildSearchItems({ blogs: BLOGS, galleries: GALLERIES, recent: RECENT })
};
