import { BRAND, getBrand } from "@/lib/brand";
import type { Locale } from "@/i18n/translations";
import studio from "@/assets/karim-studio.jpg";
import flutterForward from "@/assets/gallery/flutter-forward.jpg";
import speakingStage from "@/assets/gallery/speaking-stage.jpg";
import stagePresenter from "@/assets/gallery/stage-presenter.jpg";

export interface CourseModule {
  title: string;
  body: string;
}

export interface CatalogCourse {
  id: string;
  category: string;
  categoryId: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  free?: boolean;
  instructor: string;
  level: string;
  language: string;
  image: string;
  highlights?: string[];
  learnings?: string[];
  modules?: CourseModule[];
}

type CourseSource = Omit<CatalogCourse, "category" | "instructor" | "language" | "level" | "title" | "description" | "highlights" | "learnings" | "modules"> & {
  categoryId: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  level: { en: string; ar: string };
  highlights?: { en: string[]; ar: string[] };
  learnings?: { en: string[]; ar: string[] };
  modules?: { en: CourseModule[]; ar: CourseModule[] };
};

export const courseCategoryMeta = [
  { id: "All", en: "All", ar: "الكل" },
  { id: "Agentic AI", en: "Agentic AI", ar: "الذكاء الاصطناعي الوكيلي" },
  { id: "Automation", en: "Automation", ar: "الأتمتة" },
  { id: "RAG", en: "RAG", ar: "RAG" },
  { id: "n8n", en: "n8n", ar: "n8n" },
  { id: "Python", en: "Python", ar: "Python" },
] as const;

export const courseCategories = courseCategoryMeta.map((c) => c.id);

export type CourseCategory = (typeof courseCategories)[number];

const courseSources: CourseSource[] = [
  {
    id: "agentic-ai-engineering",
    categoryId: "Agentic AI",
    title: {
      en: "Agentic AI Engineering: From Zero to Job-Ready",
      ar: "هندسة الذكاء الاصطناعي الوكيلي: من الصفر إلى الجاهزية للعمل",
    },
    description: {
      en: "A practical learning journey from AI fundamentals and Python to building intelligent agents, RAG systems, multi-agent architectures, and real-world automations.",
      ar: "رحلة عملية من أساسيات الذكاء الاصطناعي وPython إلى بناء وكلاء أذكياء وأنظمة RAG وهياكل متعددة الوكلاء وأتمتة واقعية.",
    },
    href: BRAND.coursePath,
    featured: true,
    level: {
      en: "Beginner to Intermediate",
      ar: "مبتدئ إلى متوسط",
    },
    image: speakingStage,
    highlights: {
      en: [
        "Beginner-friendly foundations",
        "Python and API integrations",
        "Agentic Design Patterns",
        "Tool Calling and RAG",
        "CrewAI and n8n",
        "Practical projects",
      ],
      ar: [
        "أساسيات مناسبة للمبتدئين",
        "Python وتكاملات API",
        "أنماط التصميم الوكيلي",
        "استدعاء الأدوات وRAG",
        "CrewAI و n8n",
        "مشاريع عملية",
      ],
    },
    learnings: {
      en: [
        "Understand how AI Agents and LLMs actually work",
        "Build agentic architectures with design patterns",
        "Implement tool calling and external integrations",
        "Design RAG pipelines with retrieval and vector search",
        "Orchestrate workflows with CrewAI and n8n",
        "Ship practical projects with real-world constraints",
      ],
      ar: [
        "فهم كيف تعمل وكلاء الذكاء الاصطناعي ونماذج اللغة فعليًا",
        "بناء هياكل وكيلية بأنماط تصميم عملية",
        "تنفيذ استدعاء الأدوات والتكاملات الخارجية",
        "تصميم مسارات RAG مع الاسترجاع والبحث المتجهي",
        "تنسيق مسارات العمل باستخدام CrewAI و n8n",
        "تسليم مشاريع عملية بقيود العالم الحقيقي",
      ],
    },
    modules: {
      en: [
        {
          title: "Module 1 — AI & LLM Fundamentals",
          body: "Artificial Intelligence, Generative AI, LLMs, prompting, and APIs.",
        },
        {
          title: "Module 2 — Python & AI Programming Foundations",
          body: "Development environments, Python, APIs, Google Colab, and first Generative AI applications.",
        },
        {
          title: "Module 3 — Agentic AI Systems & Design Patterns",
          body: "Agentic architecture, Prompt Chaining, Routing, Parallelization, Async, Orchestration, and Reviewer-Optimizer.",
        },
        {
          title: "Module 4 — AI Agents & Tool Calling",
          body: "Tool definitions, agent decision-making, external tool execution, and practical integrations.",
        },
        {
          title: "Module 5 — Retrieval-Augmented Generation",
          body: "RAG architecture, chunking, retrieval, vector databases, and Python implementation.",
        },
        {
          title: "Module 6 — Frameworks, Automation & Memory",
          body: "CrewAI, n8n, orchestration, agent memory, and intelligent workflow development.",
        },
        {
          title: "Module 7 — Practical Projects",
          body: "Applied exercises and real-world project implementations based on the verified course curriculum.",
        },
      ],
      ar: [
        {
          title: "الوحدة 1 — أساسيات الذكاء الاصطناعي ونماذج اللغة",
          body: "الذكاء الاصطناعي، التوليدي، نماذج اللغة، التوجيه عبر الـ prompts، وواجهات البرمجة.",
        },
        {
          title: "الوحدة 2 — أساسيات Python وبرمجة الذكاء الاصطناعي",
          body: "بيئات التطوير، Python، واجهات البرمجة، Google Colab، وأول تطبيقات الذكاء الاصطناعي التوليدي.",
        },
        {
          title: "الوحدة 3 — أنظمة الذكاء الاصطناعي الوكيلي وأنماط التصميم",
          body: "البنية الوكيلية، سلسلة الـ prompts، التوجيه، التوازي، غير المتزامن، التنسيق، والمراجع-المُحسِّن.",
        },
        {
          title: "الوحدة 4 — وكلاء الذكاء الاصطناعي واستدعاء الأدوات",
          body: "تعريف الأدوات، اتخاذ القرار لدى الوكيل، تنفيذ الأدوات الخارجية، والتكاملات العملية.",
        },
        {
          title: "الوحدة 5 — التوليد المعزّز بالاسترجاع (RAG)",
          body: "بنية RAG، التقسيم، الاسترجاع، قواعد البيانات المتجهة، والتنفيذ بـ Python.",
        },
        {
          title: "الوحدة 6 — الأطر والأتمتة والذاكرة",
          body: "CrewAI و n8n والتنسيق وذاكرة الوكيل وتطوير مسارات عمل ذكية.",
        },
        {
          title: "الوحدة 7 — مشاريع عملية",
          body: "تمارين تطبيقية ومشاريع واقعية مبنية على منهج الدورة المعتمد.",
        },
      ],
    },
  },
  {
    id: "ai-sales-automation-n8n",
    categoryId: "Automation",
    title: {
      en: "AI Sales Automation using n8n",
      ar: "أتمتة المبيعات بالذكاء الاصطناعي باستخدام n8n",
    },
    description: {
      en: "Learn to automate the sales pipeline with AI and n8n — from lead handling to follow-ups and workflow orchestration.",
      ar: "تعلّم أتمتة مسار المبيعات بالذكاء الاصطناعي وn8n — من التعامل مع العملاء المحتملين إلى المتابعة وتنسيق مسارات العمل.",
    },
    href: BRAND.salesCourseUrl,
    external: true,
    level: {
      en: "Beginner to Intermediate",
      ar: "مبتدئ إلى متوسط",
    },
    image: studio,
    highlights: {
      en: ["n8n Workflows", "AI Integration", "Lead Scoring", "CRM Automation"],
      ar: ["مسارات عمل n8n", "تكامل الذكاء الاصطناعي", "تقييم العملاء المحتملين", "أتمتة CRM"],
    },
    learnings: {
      en: [
        "Build sales automation workflows in n8n",
        "Connect AI models into lead and follow-up flows",
        "Score and route leads with practical automation patterns",
        "Orchestrate CRM-friendly sales processes",
      ],
      ar: [
        "بناء مسارات أتمتة المبيعات في n8n",
        "ربط نماذج الذكاء الاصطناعي بمسارات العملاء المحتملين والمتابعة",
        "تقييم وتوجيه العملاء المحتملين بأنماط أتمتة عملية",
        "تنسيق عمليات مبيعات متوافقة مع أنظمة CRM",
      ],
    },
  },
  {
    id: "n8n-with-karim",
    categoryId: "n8n",
    title: {
      en: "n8n with Karim",
      ar: "n8n with Karim",
    },
    description: {
      en: "A free comprehensive YouTube course on mastering n8n workflow automation from basics to practical integrations.",
      ar: "دورة مجانية شاملة على يوتيوب لإتقان أتمتة مسارات العمل بـ n8n من الأساسيات إلى التكاملات العملية.",
    },
    href: BRAND.n8nPlaylistUrl,
    external: true,
    free: true,
    level: {
      en: "Beginner",
      ar: "مبتدئ",
    },
    image: flutterForward,
    highlights: {
      en: ["Workflow Basics", "Automation", "Integrations", "Hands-on Projects"],
      ar: ["أساسيات مسارات العمل", "الأتمتة", "التكاملات", "مشاريع عملية"],
    },
  },
  {
    id: "advanced-n8n-with-karim",
    categoryId: "n8n",
    title: {
      en: "Advanced n8n with Karim",
      ar: "Advanced n8n with Karim",
    },
    description: {
      en: "A free advanced YouTube series on becoming an AI Automation Engineer with n8n — production workflows, business collaboration, and real systems.",
      ar: "سلسلة يوتيوب مجانية متقدمة لتصبح مهندس أتمتة بالذكاء الاصطناعي مع n8n — مسارات إنتاج، التعاون مع فرق الأعمال، وأنظمة واقعية.",
    },
    href: BRAND.advancedN8nPlaylistUrl,
    external: true,
    free: true,
    level: {
      en: "Intermediate to Advanced",
      ar: "متوسط إلى متقدم",
    },
    image: stagePresenter,
    highlights: {
      en: ["AI Automation Engineering", "Business collaboration", "Production n8n", "Real-world systems"],
      ar: ["هندسة أتمتة الذكاء الاصطناعي", "التعاون مع فرق الأعمال", "n8n للإنتاج", "أنظمة واقعية"],
    },
  },
];

function localizeCategory(categoryId: string, locale: Locale) {
  const meta = courseCategoryMeta.find((item) => item.id === categoryId);
  return meta ? meta[locale] : categoryId;
}

function localizeCourse(source: CourseSource, locale: Locale): CatalogCourse {
  const brand = getBrand(locale);
  return {
    id: source.id,
    categoryId: source.categoryId,
    category: localizeCategory(source.categoryId, locale),
    title: source.title[locale],
    description: source.description[locale],
    href: source.href,
    external: source.external,
    featured: source.featured,
    free: source.free,
    instructor: brand.name,
    level: source.level[locale],
    language: locale === "ar" ? "العربية" : "Arabic",
    image: source.image,
    highlights: source.highlights?.[locale],
    learnings: source.learnings?.[locale],
    modules: source.modules?.[locale],
  };
}

/** Localized catalog for the active site language. All courses are taught in Arabic. */
export function getCatalogCourses(locale: Locale = "en"): CatalogCourse[] {
  return courseSources.map((course) => localizeCourse(course, locale));
}

/** @deprecated Prefer getCatalogCourses(locale) */
export const catalogCourses = getCatalogCourses("en");

export function getCourseById(id: string, locale: Locale = "en") {
  const source = courseSources.find((course) => course.id === id);
  return source ? localizeCourse(source, locale) : undefined;
}

export function getCourseCategories(locale: Locale = "en") {
  return courseCategoryMeta.map((category) => ({
    id: category.id,
    label: category[locale],
  }));
}

export function filterCourses(category: string, locale: Locale = "en") {
  const courses = getCatalogCourses(locale);
  if (!category || category === "All") return courses;
  return courses.filter((course) => {
    if (course.categoryId === category || course.category === category) return true;
    const haystack = [
      course.title,
      course.description,
      ...(course.highlights || []),
      ...(course.learnings || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(category.toLowerCase());
  });
}
