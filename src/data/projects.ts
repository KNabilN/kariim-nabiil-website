import { useState } from "react";
import type { Locale } from "@/i18n/translations";

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  tools: string[];
  domain: string;
  country: string;
  highlight: string;
  challenges: string;
  results: string;
  images: string[];
}

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI Legal Assistant for Qatari Procurement Law",
    description:
      "Built an AI assistant using RAG + Knowledge Graph that answers questions on Qatari procurement law while correctly handling multi-year legal amendments (2015, 2019, 2024).",
    fullDescription:
      "Developed a sophisticated AI legal assistant that leverages Retrieval-Augmented Generation (RAG) combined with a custom Knowledge Graph to provide accurate answers about Qatari procurement law. The system intelligently handles multi-year legal amendments from 2015, 2019, and 2024, ensuring users always get the most current and contextually relevant legal information via Telegram.",
    tools: ["n8n", "Supabase", "pgvector", "LLM", "Telegram"],
    domain: "Legal Tech",
    country: "Qatar",
    highlight: "Semantic chunking + custom knowledge graph with amendment relations",
    challenges:
      "Handling overlapping legal amendments across different years while maintaining accuracy and context. Traditional RAG approaches failed to capture the temporal relationships between amendments.",
    results:
      "Delivered a production-ready legal assistant that correctly resolves amendment conflicts and provides cited, accurate legal guidance. Deployed on Telegram for easy access by legal professionals.",
    images: [],
  },
  {
    id: "2",
    title: "Agentic GEO/SEO Optimization System",
    description:
      "Developed a deep technical agentic system for Zaher AI startup, reducing analysis time from hours to 15 minutes and cutting costs by 80%.",
    fullDescription:
      "Built a multi-agent system for Zaher AI (pre-seed funded startup, $150K) that automates Generative Engine Optimization analysis. The system uses multiple LLMs in a parallelized architecture to analyze content, generate recommendations, and produce comprehensive reports.",
    tools: ["n8n", "Multiple LLMs", "Parallelization"],
    domain: "GEO (Generative Engine Optimization)",
    country: "Egypt",
    highlight: "Pre-seed funded startup ($150K)",
    challenges:
      "Coordinating multiple LLMs for parallel analysis while maintaining consistency across outputs. Required custom orchestration patterns to handle concurrent processing efficiently.",
    results:
      "Reduced analysis time from hours to under 15 minutes. Cut operational costs by 80% while increasing output quality by 50%. System processes 10+ analysis units concurrently.",
    images: [],
  },
  {
    id: "3",
    title: "Sales AI Automation for Marketing Agency",
    description:
      "Developed a full AI-driven system to automate the entire sales process — from lead generation to follow-ups, proposal, and contract creation.",
    fullDescription:
      "Created an end-to-end AI-powered sales automation system for a marketing agency in Bahrain. The system handles the complete sales lifecycle: lead generation, qualification, automated follow-ups, proposal generation, and contract creation — all orchestrated through intelligent AI workflows.",
    tools: ["Notion CRM", "n8n", "Google Sheets", "AI"],
    domain: "Marketing & Sales",
    country: "Bahrain",
    highlight: "End-to-end sales automation",
    challenges:
      "Integrating multiple platforms (Notion, Google Sheets, email) into a cohesive automated pipeline while maintaining personalization in AI-generated communications.",
    results:
      "Fully automated the sales pipeline, reducing manual work by 90%. The agency can now handle 3x more leads with the same team size.",
    images: [],
  },
  {
    id: "4",
    title: "Sales Rep Reporting System",
    description:
      "Built an end-to-end reporting platform for 39 branches to record daily sales and generate daily, weekly, and monthly performance reports.",
    fullDescription:
      "Designed and built a comprehensive reporting platform that enables 39 branches to record daily sales data and automatically generates performance reports at daily, weekly, and monthly intervals. The system provides management with real-time visibility into sales performance across all locations.",
    tools: ["Lovable", "Supabase"],
    domain: "Sales Analytics",
    country: "Egypt",
    highlight: "39 branches reporting system",
    challenges:
      "Handling concurrent data entry from 39 branches while ensuring data integrity and generating accurate aggregated reports across multiple time periods.",
    results:
      "Deployed to 39 branches with real-time reporting. Management now has instant visibility into performance metrics, replacing manual Excel-based reporting.",
    images: [],
  },
  {
    id: "5",
    title: "AI Financial Analysis Platform",
    description:
      "Built a platform for finance professionals to analyze financial sheets like balance sheets and cash flows using AI, providing recommendations and performance evaluations.",
    fullDescription:
      "Created an AI-powered financial analysis platform that enables finance professionals to upload and analyze financial documents including balance sheets, income statements, and cash flow statements. The AI provides detailed recommendations, performance evaluations, and trend analysis.",
    tools: ["AI Models", "n8n", "Financial Tools"],
    domain: "Finance & AI",
    country: "Saudi Arabia",
    highlight: "AI-powered financial insights",
    challenges:
      "Accurately parsing diverse financial document formats and ensuring AI-generated financial advice meets professional standards and regulatory requirements.",
    results:
      "Platform processes financial documents in minutes instead of hours, providing actionable insights that financial professionals can immediately use in their decision-making.",
    images: [],
  },
  {
    id: "6",
    title: "Agentic LLM Orchestration Engine",
    description:
      "Built a multi-LLM agentic system reducing runtime for 10-unit jobs from ~7 minutes to ~3 minutes using custom nested parallelization pattern in n8n.",
    fullDescription:
      "Invented a novel nested parallelization pattern in n8n to orchestrate multiple LLMs concurrently. This custom architecture enables processing of complex multi-unit jobs by distributing work across LLM instances with intelligent batching and result aggregation.",
    tools: ["n8n", "Multiple LLMs", "Custom Batching"],
    domain: "AI Infrastructure",
    country: "Egypt",
    highlight: "Invented nested parallelization pattern",
    challenges:
      "n8n's native parallelization doesn't support nested concurrent processing. Required inventing a custom pattern to achieve true parallel execution across multiple LLM calls.",
    results:
      "Reduced runtime for 10-unit jobs from ~7 minutes to ~3 minutes (57% improvement). The pattern is now reusable across multiple projects and has been adopted by other engineers.",
    images: [],
  },
  {
    id: "7",
    title: "Environmental Compliance Management Platform",
    description:
      "Built a multi-role platform for factories and companies in Saudi Arabia to manage environmental license documentation using advanced OCR and LLMs.",
    fullDescription:
      "Designed and developed a comprehensive Environmental Compliance Management Platform tailored for the Saudi Arabian market. The system helps factories and companies organize, process, and manage all required documents for their environmental licenses. Leveraging advanced OCR and LLM technologies, the platform automatically extracts, classifies, and validates document data. It features a multi-role architecture supporting consultants, company admins, and department admins — each with tailored dashboards and permissions.",
    tools: ["OCR", "LLMs", "Multi-Role Auth", "Document Processing"],
    domain: "Environmental Compliance",
    country: "Saudi Arabia",
    highlight: "Advanced OCR + LLM-powered document management with multi-role access",
    challenges:
      "Processing diverse document formats with varying quality through OCR while maintaining high accuracy. Designing a flexible role-based access system that accommodates the complex relationships between consultants, company admins, and department admins.",
    results:
      "Delivered a production-ready platform that streamlines environmental license compliance, significantly reducing manual document processing time and ensuring regulatory adherence for multiple companies.",
    images: [],
  },
  {
    id: "8",
    title: "NGO Service Provider Marketplace",
    description:
      "Developed an Upwork-style marketplace platform for NGOs in Saudi Arabia to discover and engage qualified service providers.",
    fullDescription:
      "Built a marketplace platform inspired by Upwork, specifically designed for the NGO sector in Saudi Arabia. The platform connects non-governmental organizations with qualified service providers, enabling NGOs to post service requirements, review provider profiles, and manage engagements — all within a streamlined digital workflow tailored to the unique needs of the Saudi NGO ecosystem.",
    tools: ["Lovable", "Supabase", "Matching Algorithm"],
    domain: "NGO & Marketplace",
    country: "Saudi Arabia",
    highlight: "Upwork-style marketplace tailored for Saudi NGOs",
    challenges:
      "Adapting a general marketplace model to the specific regulatory and operational requirements of NGOs in Saudi Arabia. Building trust mechanisms and qualification verification for service providers in the non-profit sector.",
    results:
      "Launched a functional marketplace that enables NGOs to efficiently find and engage service providers, reducing procurement cycles and increasing transparency in vendor selection.",
    images: [],
  },
];

export const defaultProjectsAr: Project[] = [
  {
    id: "1",
    title: "مساعد قانوني بالذكاء الاصطناعي لقانون المشتريات القطري",
    description:
      "بنيت مساعدًا بالذكاء الاصطناعي باستخدام RAG ورسم معرفة يجيب عن أسئلة قانون المشتريات القطري مع التعامل الصحيح مع التعديلات عبر السنوات (2015 و2019 و2024).",
    fullDescription:
      "طورت مساعدًا قانونيًا متقدمًا يعتمد على التوليد المعزز بالاسترجاع (RAG) مع رسم معرفة مخصص لتقديم إجابات دقيقة عن قانون المشتريات القطري، مع معالجة ذكية للتعديلات عبر السنوات عبر تيليجرام.",
    tools: ["n8n", "Supabase", "pgvector", "LLM", "Telegram"],
    domain: "التقنية القانونية",
    country: "قطر",
    highlight: "تقسيم دلالي + رسم معرفة مخصص لعلاقات التعديلات",
    challenges:
      "التعامل مع تعديلات قانونية متداخلة عبر سنوات مختلفة مع الحفاظ على الدقة والسياق. أساليب RAG التقليدية فشلت في التقاط العلاقات الزمنية بين التعديلات.",
    results:
      "سلّمت مساعدًا قانونيًا جاهزًا للإنتاج يحل تعارضات التعديلات ويقدّم إرشادًا قانونيًا موثقًا. نُشر على تيليجرام لسهولة وصول المختصين.",
    images: [],
  },
  {
    id: "2",
    title: "نظام وكيل لتحسين GEO/SEO",
    description:
      "طورت نظامًا وكيليًا تقنيًا عميقًا لشركة Zaher AI الناشئة، خفّض زمن التحليل من ساعات إلى 15 دقيقة وخفض التكاليف بنسبة 80%.",
    fullDescription:
      "بنيت نظامًا متعدد الوكلاء لـ Zaher AI (تمويل ما قبل البذرة 150 ألف دولار) لأتمتة تحليل تحسين محركات التوليد باستخدام عدة نماذج لغة بهيكلة متوازية.",
    tools: ["n8n", "Multiple LLMs", "Parallelization"],
    domain: "GEO (تحسين محركات التوليد)",
    country: "مصر",
    highlight: "شركة ناشئة بتمويل ما قبل البذرة (150 ألف دولار)",
    challenges:
      "تنسيق عدة نماذج لغة للتحليل المتوازي مع الحفاظ على اتساق المخرجات. تطلب أنماط تنسيق مخصصة للمعالجة المتزامنة بكفاءة.",
    results:
      "خفّض زمن التحليل من ساعات إلى أقل من 15 دقيقة. خفض التكاليف التشغيلية 80% ورفع جودة المخرجات 50%. يعالج أكثر من 10 وحدات تحليل بالتوازي.",
    images: [],
  },
  {
    id: "3",
    title: "أتمتة مبيعات بالذكاء الاصطناعي لوكالة تسويق",
    description:
      "طورت نظامًا كاملًا مدفوعًا بالذكاء الاصطناعي لأتمتة عملية المبيعات بالكامل — من توليد العملاء المحتملين إلى المتابعة والعروض والعقود.",
    fullDescription:
      "أنشأت نظام أتمتة مبيعات متكامل لوكالة تسويق في البحرين يغطي دورة المبيعات كاملة عبر مسارات عمل ذكية.",
    tools: ["Notion CRM", "n8n", "Google Sheets", "AI"],
    domain: "التسويق والمبيعات",
    country: "البحرين",
    highlight: "أتمتة مبيعات من البداية للنهاية",
    challenges:
      "دمج منصات متعددة (Notion وجداول Google والبريد) في مسار آلي متماسك مع الحفاظ على التخصيص في التواصل المولَّد بالذكاء الاصطناعي.",
    results:
      "أتمتة كاملة لمسار المبيعات وتقليل العمل اليدوي بنسبة 90%. أصبحت الوكالة تتعامل مع 3 أضعاف العملاء المحتملين بنفس حجم الفريق.",
    images: [],
  },
  {
    id: "4",
    title: "نظام تقارير مندوبي المبيعات",
    description:
      "بنيت منصة تقارير متكاملة لـ 39 فرعًا لتسجيل المبيعات اليومية وتوليد تقارير أداء يومية وأسبوعية وشهرية.",
    fullDescription:
      "صمّمت وبنيت منصة تقارير شاملة تمكّن 39 فرعًا من تسجيل بيانات المبيعات اليومية وتوليد تقارير أداء تلقائية عبر فترات متعددة مع رؤية فورية للإدارة.",
    tools: ["Lovable", "Supabase"],
    domain: "تحليلات المبيعات",
    country: "مصر",
    highlight: "نظام تقارير لـ 39 فرعًا",
    challenges:
      "التعامل مع إدخال بيانات متزامن من 39 فرعًا مع ضمان سلامة البيانات وتقارير مجمّعة دقيقة عبر فترات زمنية متعددة.",
    results:
      "نُشر على 39 فرعًا بتقارير لحظية. أصبحت الإدارة ترى مؤشرات الأداء فورًا بدل التقارير اليدوية على Excel.",
    images: [],
  },
  {
    id: "5",
    title: "منصة تحليل مالي بالذكاء الاصطناعي",
    description:
      "بنيت منصة للمحترفين الماليين لتحليل القوائم المالية مثل الميزانيات والتدفقات النقدية بالذكاء الاصطناعي مع توصيات وتقييم أداء.",
    fullDescription:
      "أنشأت منصة تحليل مالي بالذكاء الاصطناعي تتيح رفع وتحليل المستندات المالية وتقديم توصيات وتقييمات واتجاهات.",
    tools: ["AI Models", "n8n", "Financial Tools"],
    domain: "المالية والذكاء الاصطناعي",
    country: "السعودية",
    highlight: "رؤى مالية مدعومة بالذكاء الاصطناعي",
    challenges:
      "تحليل دقيق لصيغ مستندات مالية متنوعة وضمان أن النصائح المولَّدة تلبي المعايير المهنية والمتطلبات التنظيمية.",
    results:
      "تعالج المنصة المستندات المالية خلال دقائق بدل ساعات، وتقدّم رؤى قابلة للتنفيذ فورًا في اتخاذ القرار.",
    images: [],
  },
  {
    id: "6",
    title: "محرك تنسيق نماذج لغة وكيلية",
    description:
      "بنيت نظامًا وكيليًا متعدد نماذج اللغة خفّض زمن تنفيذ مهام من 10 وحدات من ~7 دقائق إلى ~3 دقائق بنمط توازٍ متداخل مخصص في n8n.",
    fullDescription:
      "ابتكرت نمط توازٍ متداخل في n8n لتنسيق عدة نماذج لغة بالتزامن مع تجميع ذكي للنتائج.",
    tools: ["n8n", "Multiple LLMs", "Custom Batching"],
    domain: "بنية تحتية للذكاء الاصطناعي",
    country: "مصر",
    highlight: "ابتكار نمط التوازي المتداخل",
    challenges:
      "التوازي الأصلي في n8n لا يدعم المعالجة المتزامنة المتداخلة. تطلب ابتكار نمط مخصص لتنفيذ متوازٍ حقيقي عبر استدعاءات متعددة.",
    results:
      "خفّض زمن المهام من ~7 دقائق إلى ~3 دقائق (تحسّن 57%). أصبح النمط قابلًا لإعادة الاستخدام واعتمده مهندسون آخرون.",
    images: [],
  },
  {
    id: "7",
    title: "منصة إدارة الامتثال البيئي",
    description:
      "بنيت منصة متعددة الأدوار للمصانع والشركات في السعودية لإدارة وثائق التراخيص البيئية باستخدام OCR متقدم ونماذج اللغة.",
    fullDescription:
      "صمّمت وطورت منصة شاملة للامتثال البيئي في السوق السعودي مع استخراج وتصنيف والتحقق من المستندات وصلاحيات متعددة الأدوار.",
    tools: ["OCR", "LLMs", "Multi-Role Auth", "Document Processing"],
    domain: "الامتثال البيئي",
    country: "السعودية",
    highlight: "إدارة مستندات بـ OCR ونماذج لغة مع صلاحيات متعددة",
    challenges:
      "معالجة صيغ مستندات متنوعة بجودة متفاوتة عبر OCR بدقة عالية، وتصميم صلاحيات مرنة للعلاقات بين المستشارين ومسؤولي الشركات والأقسام.",
    results:
      "سلّمت منصة جاهزة للإنتاج تبسّط الامتثال للتراخيص البيئية وتقلل زمن المعالجة اليدوية وتضمن الالتزام التنظيمي.",
    images: [],
  },
  {
    id: "8",
    title: "سوق مقدمي الخدمات للمنظمات غير الربحية",
    description:
      "طورت منصة سوق بأسلوب Upwork للمنظمات غير الربحية في السعودية لاكتشاف والتعاقد مع مقدمي خدمات مؤهلين.",
    fullDescription:
      "بنيت منصة سوق مصممة لقطاع المنظمات غير الربحية في السعودية لربط المنظمات بمقدمي الخدمات وإدارة التعاقدات ضمن مسار رقمي مبسّط.",
    tools: ["Lovable", "Supabase", "Matching Algorithm"],
    domain: "المنظمات غير الربحية والأسواق",
    country: "السعودية",
    highlight: "سوق بأسلوب Upwork مخصص للمنظمات غير الربحية السعودية",
    challenges:
      "تكييف نموذج سوق عام مع المتطلبات التنظيمية والتشغيلية للمنظمات غير الربحية في السعودية، وبناء آليات ثقة والتحقق من أهلية مقدمي الخدمات.",
    results:
      "أطلقت سوقًا وظيفيًا يمكّن المنظمات من إيجاد مقدمي الخدمات بكفاءة وتقليل دورات الشراء وزيادة الشفافية في اختيار الموردين.",
    images: [],
  },
];

export function getProjects(locale: Locale = "en"): Project[] {
  return locale === "ar" ? defaultProjectsAr : defaultProjects;
}

const STORAGE_KEY = "portfolio_projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { projects, saveProjects };
}
