import type { Locale } from "@/i18n/translations";

export interface CvJob {
  role: string;
  org: string;
  period: string;
  location: string;
  industry: string;
  bullets: string[];
}

export interface CvSkill {
  title: string;
  items: string;
}

export interface CvContent {
  summary: string;
  experience: CvJob[];
  education: string[];
  certifications: string[];
  skills: CvSkill[];
  accomplishments: string[];
  languages: string[];
}

const cvEn: CvContent = {
  summary:
    "Senior Agentic AI Engineer specializing in architecting high-throughput multi-agent systems and enterprise automations currently running in production. Proven track record designing mission-critical AI workflows for sovereign-tier clients and global enterprises, significantly cutting operational costs and reducing execution times. Combines deep technical expertise in multi-LLM orchestration, hybrid RAG, and knowledge retrieval with a strong product and business background to build reliable, high-ROI solutions.",
  experience: [
    {
      role: "Sr. AI Engineer",
      org: "FPT Software",
      period: "February 2026 – Ongoing",
      location: "Egypt · Full-time, hybrid",
      industry: "Global AI powerhouse originating from Vietnam, operations spanning 30+ countries",
      bullets: [
        "Architected and deployed production multi-agent systems for a +$100B sovereign-tier client, automating mission-critical enterprise workflows.",
        "Built automated HR validation agents for payroll audits and employee requests that can reduce manual verification effort by 80% and accelerate approval SLAs from days to minutes.",
        "Deployed an end-to-end procurement agentic suite (PR/PO/invoice reconciliation and supplier evaluation), cutting document processing overhead by nearly 70%.",
        "Implemented a Text-to-SQL finance engine reducing ad-hoc query turnaround from hours to seconds.",
      ],
    },
    {
      role: "Head of GenAI | Founding Employee",
      org: "Zaher AI",
      period: "August 2025 – August 2026",
      location: "Egypt · Part-time, remote",
      industry: "Agentic Generative Engine Optimization (GEO), pre-seed funded by $150,000",
      bullets: [
        "Built the Agentic system that enhanced GEO analysis and report generation from +hours to less than 15 minutes using parallelization architecture and n8n, increasing quality by +50% and reducing system operating costs by 80%.",
        "Built a full SEO AI engine using n8n to turn Zaher into a digital existence platform.",
      ],
    },
    {
      role: "AI Product and Business Manager | Founding Employee",
      org: "Trigz",
      period: "March 2025 – January 2026",
      location: "Canada · Full-time, remote",
      industry: "Agentic AI Operating System — founded by a global team from AWS, Meta, and Microsoft",
      bullets: [
        "Led product discovery by engaging target users to uncover pain points, validate core problems, and define solution fit and AI features.",
        "Designed comprehensive user flows, personas, and user stories to guide MVP development with development and AI teams.",
        "Built and launched the functional prototype using vibe coding and no-code tools to rapidly test hypotheses.",
      ],
    },
    {
      role: "Head of Business Development",
      org: "Provin",
      period: "October 2023 – March 2025",
      location: "USA · Full-time, remote",
      industry: "Technical Recruitment",
      bullets: [
        "Cultivated strategic partnerships through discovery calls and hypothesis validation, leading to engagements with product experts from Google, Apple, Microsoft, and Boeing.",
        "Led marketing and sales for product launch, reaching break-even in six months and contracts sold at +$200,000.",
        "Created Provin AI Agent from scratch to help clients find talent faster using n8n.",
      ],
    },
    {
      role: "Business and Product Development Engineer",
      org: "Sahara Complete Services for Petroleum Services",
      period: "October 2021 – September 2024",
      location: "Part-time",
      industry: "Oil and Gas",
      bullets: [
        "Strategized business growth for 5 subsidiaries across Industry Services and Advanced Technology.",
        "Facilitated international technology transfer partnerships (including DTS for gas wells and Drone Leak Detection) with end-to-end technical presentations, demos, and pre-sales.",
      ],
    },
  ],
  education: [
    "BCs in Mechanical Design and Production Engineering, Zagazig University, 2021 — 92%, Excellent with Honor, 1st of department.",
    "Google career certificate in Automation using Python.",
  ],
  certifications: [
    "Certified OpenAI Technical Practitioner",
    "Agentic AI Engineering course by Ed Donner",
    "Master AI, LLM, MCP and Agents by Ed Donner",
    "MixPanel Product Analytics from Product School",
    "Growth Strategies from Wharton Business School on Coursera",
    "Algorithms and data structures from Princeton University on Coursera",
  ],
  skills: [
    {
      title: "Agentic Frameworks & Orchestration",
      items:
        "Multi-agent architectures (CrewAI, LangGraph, n8n), tool-calling, workflow automation, dynamic agent builders, context/prompt engineering",
    },
    {
      title: "Generative AI & LLMs",
      items: "LLM orchestration, advanced RAG pipelines, knowledge graphs, Text-to-SQL, latency & cost optimization",
    },
    {
      title: "Programming & Backend",
      items: "Python, REST APIs, Supabase, PostgreSQL, vector databases, SQL, Oracle Fusion",
    },
    {
      title: "System Design & Optimization",
      items: "Nested parallelization, concurrency control, dynamic batching, production workflows, metadata-driven architecture",
    },
    {
      title: "Product & Engineering Leadership",
      items: "Technical product management, enterprise discovery, GTM strategy, technical solution architecture, cross-functional leadership",
    },
    {
      title: "Rapid Prototyping",
      items: "Vibe coding (Cursor AI, Lovable), full-stack prototyping, React, TypeScript, fast MVP delivery",
    },
  ],
  accomplishments: [
    "NASA Space Apps Cairo winner and global nominee twice",
    "2nd place in YLP (Youth Leadership Program) with UNDP",
    "African Youth Forum for Entrepreneurs winner",
    "+1,000,000 views on the n8n_with_karim course on YouTube",
  ],
  languages: ["Arabic — Native", "English — Fluent (spoken & written)"],
};

const cvAr: CvContent = {
  summary:
    "مهندس أول في الذكاء الاصطناعي الوكيلي متخصص في تصميم أنظمة متعددة الوكلاء عالية الإنتاجية وأتمتة مؤسسية تعمل فعليًا في الإنتاج. خبرة مثبتة في بناء مسارات ذكاء اصطناعي حرجة لعملاء سياديين وشركات عالمية، مع خفض كبير في التكاليف التشغيلية وأوقات التنفيذ. يجمع بين خبرة تقنية عميقة في تنسيق نماذج اللغة المتعددة وRAG الهجين واسترجاع المعرفة، وخلفية قوية في المنتج والأعمال لبناء حلول موثوقة وعائد استثمار مرتفع.",
  experience: [
    {
      role: "مهندس ذكاء اصطناعي أول",
      org: "FPT Software",
      period: "فبراير 2026 – مستمر",
      location: "مصر · دوام كامل، هجين",
      industry: "شركة عالمية رائدة في الذكاء الاصطناعي من فيتنام، تعمل في أكثر من 30 دولة",
      bullets: [
        "صممت ونشرت أنظمة متعددة الوكلاء في الإنتاج لعميل سيادي بقيمة +100 مليار دولار، لأتمتة مسارات عمل مؤسسية حرجة.",
        "بنيت وكلاء تحقق للموارد البشرية لتدقيق الرواتب وطلبات الموظفين يمكنها تقليل الجهد اليدوي بنسبة 80% وتسريع الموافقات من أيام إلى دقائق.",
        "نشرت منظومة وكيلية متكاملة للمشتريات (طلب شراء / أمر شراء / مطابقة الفواتير وتقييم الموردين)، وخفضت عبء معالجة المستندات بنحو 70%.",
        "نفذت محرك Text-to-SQL للمالية يقلل زمن الاستعلامات العارضة من ساعات إلى ثوانٍ.",
      ],
    },
    {
      role: "رئيس GenAI | موظف مؤسس",
      org: "Zaher AI",
      period: "أغسطس 2025 – أغسطس 2026",
      location: "مصر · دوام جزئي، عن بُعد",
      industry: "تحسين محركات التوليد الوكيلي (GEO)، تمويل ما قبل البذرة 150,000 دولار",
      bullets: [
        "بنيت النظام الوكيلي الذي حسّن تحليل GEO وتوليد التقارير من ساعات إلى أقل من 15 دقيقة باستخدام التوازي وn8n، مع رفع الجودة +50% وخفض تكاليف التشغيل 80%.",
        "بنيت محرك SEO بالذكاء الاصطناعي بالكامل عبر n8n لتحويل Zaher إلى منصة وجود رقمي.",
      ],
    },
    {
      role: "مدير منتج وأعمال الذكاء الاصطناعي | موظف مؤسس",
      org: "Trigz",
      period: "مارس 2025 – يناير 2026",
      location: "كندا · دوام كامل، عن بُعد",
      industry: "نظام تشغيل للذكاء الاصطناعي الوكيلي — فريق عالمي من AWS وMeta وMicrosoft",
      bullets: [
        "قدت اكتشاف المنتج عبر التواصل مع المستخدمين المستهدفين لكشف نقاط الألم والتحقق من المشكلات وتحديد ملاءمة الحل وميزات الذكاء الاصطناعي.",
        "صممت تدفقات مستخدمين وشخصيات وقصص مستخدم شاملة لتوجيه تطوير الـ MVP مع فرق التطوير والذكاء الاصطناعي.",
        "بنيت وأطلقت النموذج الأولي الوظيفي باستخدام vibe coding وأدوات بدون كود لاختبار الفرضيات بسرعة.",
      ],
    },
    {
      role: "رئيس تطوير الأعمال",
      org: "Provin",
      period: "أكتوبر 2023 – مارس 2025",
      location: "الولايات المتحدة · دوام كامل، عن بُعد",
      industry: "التوظيف التقني",
      bullets: [
        "بنيت شراكات استراتيجية عبر مكالمات اكتشاف والتحقق من الفرضيات، أدت إلى تعاون مع خبراء منتجات من Google وApple وMicrosoft وBoeing.",
        "قدت التسويق والمبيعات لإطلاق المنتج، والوصول لنقطة التعادل خلال ستة أشهر وعقود بأكثر من 200,000 دولار.",
        "أنشأت وكيل Provin بالذكاء الاصطناعي من الصفر لمساعدة العملاء على إيجاد المواهب أسرع باستخدام n8n.",
      ],
    },
    {
      role: "مهندس تطوير أعمال ومنتجات",
      org: "Sahara Complete Services for Petroleum Services",
      period: "أكتوبر 2021 – سبتمبر 2024",
      location: "دوام جزئي",
      industry: "النفط والغاز",
      bullets: [
        "وضعت استراتيجيات نمو لـ 5 شركات تابعة عبر الخدمات الصناعية والتكنولوجيا المتقدمة.",
        "سهّلت شراكات نقل تكنولوجيا دولية (بما فيها DTS لآبار الغاز وكشف التسرب بالطائرات بدون طيار) بعروض تقنية وعروض تجريبية ومبيعات أولية من البداية للنهاية.",
      ],
    },
  ],
  education: [
    "بكالوريوس هندسة التصميم الميكانيكي والإنتاج، جامعة الزقازيق، 2021 — 92%، امتياز مع مرتبة الشرف، الأول على القسم.",
    "شهادة Google المهنية في الأتمتة باستخدام Python.",
  ],
  certifications: [
    "ممارس تقني معتمد من OpenAI",
    "دورة هندسة الذكاء الاصطناعي الوكيلي مع Ed Donner",
    "إتقان AI وLLM وMCP والوكلاء مع Ed Donner",
    "تحليلات المنتجات MixPanel من Product School",
    "استراتيجيات النمو من Wharton Business School على Coursera",
    "الخوارزميات وهياكل البيانات من جامعة برينستون على Coursera",
  ],
  skills: [
    {
      title: "الأطر الوكيلية والتنسيق",
      items:
        "هياكل متعددة الوكلاء (CrewAI وLangGraph وn8n)، استدعاء الأدوات، أتمتة مسارات العمل، بناء وكلاء ديناميكي، هندسة السياق والـ prompts",
    },
    {
      title: "الذكاء الاصطناعي التوليدي ونماذج اللغة",
      items: "تنسيق نماذج اللغة، مسارات RAG متقدمة، رسوم معرفة، Text-to-SQL، تحسين زمن الاستجابة والتكلفة",
    },
    {
      title: "البرمجة والخلفية",
      items: "Python وREST APIs وSupabase وPostgreSQL وقواعد بيانات متجهة وSQL وOracle Fusion",
    },
    {
      title: "تصميم الأنظمة والتحسين",
      items: "توازٍ متداخل، التحكم في التزامن، تجميع ديناميكي، مسارات إنتاج، بنية مدفوعة بالبيانات الوصفية",
    },
    {
      title: "قيادة المنتج والهندسة",
      items: "إدارة منتج تقنية، اكتشاف مؤسسي، استراتيجية دخول السوق، هندسة حلول تقنية، قيادة متعددة الوظائف",
    },
    {
      title: "النماذج الأولية السريعة",
      items: "Vibe coding (Cursor AI وLovable)، نماذج أولية كاملة، React وTypeScript، تسليم MVP سريع",
    },
  ],
  accomplishments: [
    "فائز NASA Space Apps Cairo ومرشح عالمي مرتين",
    "المركز الثاني في برنامج قيادة الشباب (YLP) مع UNDP",
    "فائز منتدى الشباب الأفريقي لرواد الأعمال",
    "+1,000,000 مشاهدة لدورة n8n_with_karim على يوتيوب",
  ],
  languages: ["العربية — لغة أم", "الإنجليزية — طلاقة (تحدثًا وكتابة)"],
};

export function getCv(locale: Locale = "en"): CvContent {
  return locale === "ar" ? cvAr : cvEn;
}

/** English defaults kept for backward compatibility */
export const cvSummary = cvEn.summary;
export const cvExperience = cvEn.experience;
export const cvEducation = cvEn.education;
export const cvCertifications = cvEn.certifications;
export const cvSkills = cvEn.skills;
export const cvAccomplishments = cvEn.accomplishments;
export const cvLanguages = cvEn.languages;
