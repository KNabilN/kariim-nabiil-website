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
    id: "uae-1",
    title: "Finance Agentic System",
    description:
      "Text-to-SQL agents that help finance teams chat with their databases to enhance productivity and analysis capabilities.",
    fullDescription:
      "Built a production Text-to-SQL agentic system for a +$100B client in the UAE. Finance teams can ask natural-language questions and get accurate answers from enterprise databases — improving analysis speed and day-to-day productivity without writing SQL.",
    tools: ["LLMs", "Text-to-SQL", "Agentic Workflows", "Enterprise Databases"],
    domain: "Finance & Agentic AI",
    country: "United Arab Emirates",
    highlight: "Main project for a +$100B UAE client",
    challenges:
      "Mapping natural language to correct SQL over complex enterprise schemas while keeping answers accurate, auditable, and safe for finance workflows.",
    results:
      "Enabled finance teams to query databases conversationally, reducing dependency on analysts for routine questions and accelerating financial analysis.",
    images: [],
  },
  {
    id: "uae-2",
    title: "External Chatbot",
    description:
      "Conversational AI agent that helps customers get information about services and custom brochures tailored to their needs.",
    fullDescription:
      "Designed and deployed an external-facing conversational AI agent for a +$100B UAE client. The agent answers customer questions about services and generates custom brochures matched to each visitor’s needs.",
    tools: ["Conversational AI", "LLMs", "Content Generation", "Knowledge Base"],
    domain: "Customer Experience",
    country: "United Arab Emirates",
    highlight: "Main project for a +$100B UAE client",
    challenges:
      "Keeping answers on-brand and accurate across a large service catalog while personalizing brochure content in real time.",
    results:
      "Gave customers instant, guided answers and tailored brochures — reducing wait time for basic inquiries and improving engagement.",
    images: [],
  },
  {
    id: "uae-3",
    title: "Custom Agents for Employees",
    description:
      "A sophisticated system that lets each employee create custom agents with department-specific tools, then chat with them to get needed data — powered by a dynamic, on-the-fly metadata architecture.",
    fullDescription:
      "Built an enterprise employee-agent platform for a +$100B UAE client. Each employee can create custom agents with the tools their department needs, then chat with those agents to retrieve data. The core innovation is a dynamic, on-the-fly system architecture driven by a metadata approach.",
    tools: ["Multi-Agent Systems", "Metadata Architecture", "Tool Calling", "LLMs"],
    domain: "Enterprise Agentic Platforms",
    country: "United Arab Emirates",
    highlight: "Dynamic on-the-fly metadata architecture · +$100B UAE client",
    challenges:
      "Supporting per-employee custom agents safely at scale, with department-scoped tools and a flexible metadata model that configures agents dynamically without redeploying the system.",
    results:
      "Employees across departments can spin up tailored agents and get the data they need through chat — without waiting on custom engineering for every use case.",
    images: [],
  },
  {
    id: "uae-4",
    title: "Procurement Agentic System",
    description:
      "Introduced AI across the full procurement lifecycle — from Policy AI Assistant and SCD generation to PR/PO/invoices assistance, supplier search, and deep evaluation.",
    fullDescription:
      "Delivered an end-to-end procurement agentic system for a +$100B UAE client, embedding AI across the procurement lifecycle: Policy AI Assistant, SCD generation, PR/PO/invoices assistance, supplier search, and deep supplier evaluation.",
    tools: ["Agentic AI", "Document Generation", "Supplier Evaluation", "Enterprise Workflows"],
    domain: "Procurement & Supply Chain",
    country: "United Arab Emirates",
    highlight: "Full procurement lifecycle AI · +$100B UAE client",
    challenges:
      "Covering many procurement stages with consistent policy compliance, reliable document generation, and deep supplier evaluation in a complex enterprise process.",
    results:
      "Streamlined procurement workflows with AI assistance at every major step — from policy guidance through supplier evaluation — cutting manual effort and cycle time.",
    images: [],
  },
  {
    id: "uae-5",
    title: "HR Agentic AI Support System",
    description:
      "Agentic system that helps the HR team validate internal employee requests such as sick leave and leave credit.",
    fullDescription:
      "Built an HR agentic support system for a +$100B UAE client to help HR validate internal employee requests (e.g. sick leave, leave credit) with consistent policy checks and faster turnaround.",
    tools: ["Agentic AI", "Policy Validation", "HR Workflows", "LLMs"],
    domain: "HR & People Operations",
    country: "United Arab Emirates",
    highlight: "Main project for a +$100B UAE client",
    challenges:
      "Encoding HR policies into reliable agent checks so requests are validated consistently while staying clear and usable for HR staff.",
    results:
      "Helped HR process and validate employee requests faster with consistent policy-aligned decisions.",
    images: [],
  },
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
    tools: ["React", "Supabase"],
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
    tools: ["React", "Supabase", "Matching Algorithm"],
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
    id: "uae-1",
    title: "نظام مالي وكيلي",
    description:
      "وكلاء Text-to-SQL يساعدون فرق المالية على الدردشة مع قواعد بياناتهم لرفع الإنتاجية وقدرات التحليل.",
    fullDescription:
      "بنيت نظام Text-to-SQL وكيليًا للإنتاج لعميل بأكثر من 100 مليار دولار في الإمارات. فرق المالية تسأل بلغة طبيعية وتحصل على إجابات دقيقة من قواعد بيانات المؤسسة — بسرعة أعلى ودون كتابة SQL.",
    tools: ["LLMs", "Text-to-SQL", "Agentic Workflows", "Enterprise Databases"],
    domain: "المالية والذكاء الاصطناعي الوكيلي",
    country: "الإمارات العربية المتحدة",
    highlight: "مشروع رئيسي لعميل إماراتي بأكثر من 100 مليار دولار",
    challenges:
      "تحويل اللغة الطبيعية إلى SQL صحيح على مخططات مؤسسية معقّدة مع الحفاظ على الدقة وقابلية التدقيق وأمان سير العمل المالي.",
    results:
      "مكّن فرق المالية من الاستعلام عن قواعد البيانات محادثةً، وقلّل الاعتماد على المحللين للأسئلة الروتينية وسرّع التحليل المالي.",
    images: [],
  },
  {
    id: "uae-2",
    title: "شات بوت خارجي",
    description:
      "وكيل محادثة بالذكاء الاصطناعي يساعد العملاء على معرفة الخدمات والحصول على بروشورات مخصّصة لاحتياجاتهم.",
    fullDescription:
      "صمّمت ونشرت وكيل محادثة موجّهًا للعملاء لعميل بأكثر من 100 مليار دولار في الإمارات. يجيب عن أسئلة الخدمات ويولّد بروشورات مخصّصة حسب احتياج كل زائر.",
    tools: ["Conversational AI", "LLMs", "Content Generation", "Knowledge Base"],
    domain: "تجربة العملاء",
    country: "الإمارات العربية المتحدة",
    highlight: "مشروع رئيسي لعميل إماراتي بأكثر من 100 مليار دولار",
    challenges:
      "الحفاظ على إجابات دقيقة ومتوافقة مع العلامة عبر كتالوج خدمات كبير، مع تخصيص محتوى البروشور في الوقت الفعلي.",
    results:
      "منح العملاء إجابات فورية موجهة وبروشورات مخصّصة — وقلّل وقت الانتظار للاستفسارات الأساسية وزاد التفاعل.",
    images: [],
  },
  {
    id: "uae-3",
    title: "وكلاء مخصّصة للموظفين",
    description:
      "نظام متقدم يتيح لكل موظف إنشاء وكلاء مخصّصة بأدوات قسمه ثم الدردشة معها للحصول على البيانات — بهندسة ديناميكية قائمة على البيانات الوصفية.",
    fullDescription:
      "بنيت منصة وكلاء للموظفين لعميل بأكثر من 100 مليار دولار في الإمارات. كل موظف ينشئ وكلاء بأدوات قسمه ويتحدث معهم لاسترجاع البيانات. الابتكار في هندسة ديناميكية تعمل أثناء التشغيل بمنهج البيانات الوصفية.",
    tools: ["Multi-Agent Systems", "Metadata Architecture", "Tool Calling", "LLMs"],
    domain: "منصات وكيلية للمؤسسات",
    country: "الإمارات العربية المتحدة",
    highlight: "هندسة بيانات وصفية ديناميكية · عميل إماراتي +100 مليار دولار",
    challenges:
      "دعم وكلاء مخصّصة لكل موظف بأمان وعلى نطاق واسع، مع أدوات محدودة بالقسم ونموذج بيانات وصفية يضبط الوكلاء ديناميكيًا دون إعادة نشر النظام.",
    results:
      "الموظفون عبر الأقسام ينشئون وكلاء مخصّصة ويحصلون على البيانات عبر الدردشة — دون انتظار هندسة مخصّصة لكل حالة استخدام.",
    images: [],
  },
  {
    id: "uae-4",
    title: "نظام مشتريات وكيلي",
    description:
      "أدخلت الذكاء الاصطناعي في دورة المشتريات كاملة — من مساعد السياسات وتوليد SCD إلى مساعدة PR/PO/الفواتير، والبحث عن الموردين والتقييم العميق.",
    fullDescription:
      "سلّمت نظام مشتريات وكيلي متكامل لعميل بأكثر من 100 مليار دولار في الإمارات، يغطي دورة المشتريات: مساعد سياسات، توليد SCD، مساعدة طلبات الشراء وأوامر الشراء والفواتير، والبحث عن الموردين وتقييمهم بعمق.",
    tools: ["Agentic AI", "Document Generation", "Supplier Evaluation", "Enterprise Workflows"],
    domain: "المشتريات وسلسلة الإمداد",
    country: "الإمارات العربية المتحدة",
    highlight: "ذكاء اصطناعي لدورة المشتريات كاملة · عميل إماراتي +100 مليار دولار",
    challenges:
      "تغطية مراحل مشتريات متعددة مع التزام ثابت بالسياسات، وتوليد مستندات موثوق، وتقييم مورّدين عميق داخل عملية مؤسسية معقّدة.",
    results:
      "بسّط مسارات المشتريات بمساعدة الذكاء الاصطناعي في كل خطوة رئيسية — من الإرشاد بالسياسات إلى تقييم الموردين — وقلّل الجهد اليدوي وزمن الدورة.",
    images: [],
  },
  {
    id: "uae-5",
    title: "نظام دعم الموارد البشرية بالذكاء الاصطناعي الوكيلي",
    description:
      "نظام وكيلي يساعد فريق الموارد البشرية على التحقق من الطلبات الداخلية للموظفين مثل الإجازة المرضية ورصيد الإجازات.",
    fullDescription:
      "بنيت نظام دعم وكيلي للموارد البشرية لعميل بأكثر من 100 مليار دولار في الإمارات للتحقق من طلبات الموظفين الداخلية (مثل الإجازة المرضية ورصيد الإجازات) بفحوصات سياسات متسقة واستجابة أسرع.",
    tools: ["Agentic AI", "Policy Validation", "HR Workflows", "LLMs"],
    domain: "الموارد البشرية وعمليات الأفراد",
    country: "الإمارات العربية المتحدة",
    highlight: "مشروع رئيسي لعميل إماراتي بأكثر من 100 مليار دولار",
    challenges:
      "ترميز سياسات الموارد البشرية في فحوصات وكيل موثوقة بحيث تُتحقق الطلبات باتساق مع بقاء التجربة واضحة لفريق HR.",
    results:
      "ساعد الموارد البشرية على معالجة والتحقق من طلبات الموظفين بسرعة أكبر بقرارات متوافقة مع السياسات.",
    images: [],
  },
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
    tools: ["React", "Supabase"],
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
    tools: ["React", "Supabase", "Matching Algorithm"],
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
