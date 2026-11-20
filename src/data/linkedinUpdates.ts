import { BRAND } from "@/lib/brand";
import type { Locale } from "@/i18n/translations";

export interface LinkedInUpdate {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  href: string;
}

const updatesEn: LinkedInUpdate[] = [
  {
    id: "1",
    title: "Production multi-agent systems at enterprise scale",
    excerpt:
      "Building high-throughput agentic workflows for sovereign-tier clients — HR validation agents, procurement suites, and Text-to-SQL finance engines running in production.",
    tag: "Agentic AI · Production",
    href: BRAND.linkedin,
  },
  {
    id: "2",
    title: "From hours to 15 minutes: Agentic GEO systems",
    excerpt:
      "How nested parallelization and n8n orchestration cut GEO analysis time dramatically while improving quality and reducing operating costs.",
    tag: "n8n · Multi-LLM",
    href: BRAND.linkedin,
  },
  {
    id: "3",
    title: "Teaching Agentic AI Engineering — concepts first",
    excerpt:
      "Less hype, more engineering: sharing the principles behind AI agents, RAG, tool calling, and real-world projects with students worldwide.",
    tag: "Education · Course",
    href: BRAND.linkedin,
  },
];

const updatesAr: LinkedInUpdate[] = [
  {
    id: "1",
    title: "أنظمة متعددة الوكلاء في الإنتاج على نطاق مؤسسي",
    excerpt:
      "بناء مسارات عمل وكيلية عالية الإنتاجية لعملاء سياديين — وكلاء تحقق الموارد البشرية، ومنظومات المشتريات، ومحركات Text-to-SQL المالية تعمل في الإنتاج.",
    tag: "ذكاء اصطناعي وكيلي · إنتاج",
    href: BRAND.linkedin,
  },
  {
    id: "2",
    title: "من ساعات إلى 15 دقيقة: أنظمة GEO وكيلية",
    excerpt:
      "كيف خفّض التوازي المتداخل وتنسيق n8n زمن تحليل GEO بشكل كبير مع تحسين الجودة وخفض تكاليف التشغيل.",
    tag: "n8n · نماذج لغة متعددة",
    href: BRAND.linkedin,
  },
  {
    id: "3",
    title: "تعليم هندسة الذكاء الاصطناعي الوكيلي — المفاهيم أولًا",
    excerpt:
      "أقل ضجيجًا ومزيد من الهندسة: مشاركة المبادئ وراء وكلاء الذكاء الاصطناعي وRAG واستدعاء الأدوات والمشاريع الواقعية مع الطلاب.",
    tag: "تعليم · دورة",
    href: BRAND.linkedin,
  },
];

export function getLinkedinUpdates(locale: Locale = "en"): LinkedInUpdate[] {
  return locale === "ar" ? updatesAr : updatesEn;
}

/** @deprecated Prefer getLinkedinUpdates(locale) */
export const linkedinUpdates = updatesEn;
