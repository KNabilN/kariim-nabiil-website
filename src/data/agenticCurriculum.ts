import type { CourseModule } from "@/data/courses";

/** Full Agentic AI Engineering curriculum (sections → lectures). */
export const agenticCurriculumEn: CourseModule[] = [
  {
    title: "Start Here",
    lectures: [{ title: "Introduction" }],
  },
  {
    title: "Let's Learn More About AI!",
    lectures: [
      { title: "Section Introduction" },
      { title: "Introduction to AI", preview: true },
      { title: "What are LLMs" },
      { title: "Prompt Engineering" },
      { title: "LLMs Models" },
    ],
  },
  {
    title: "Programming Basics",
    lectures: [
      { title: "Section Introduction" },
      { title: "Programming Basics" },
      { title: "API" },
      { title: "Environment" },
      { title: "Google Colab" },
      { title: "Your First GenAI Application" },
      { title: "AI Generated Code" },
      { title: "AI Agent Code" },
    ],
  },
  {
    title: "Agentic System",
    lectures: [
      { title: "Code Flow" },
      { title: "LLM Flow Control - Part 1" },
      { title: "LLM Flow Control - Part 2" },
      { title: "LLM Flow Control - Part 3" },
    ],
  },
  {
    title: "Agentic Design Patterns",
    lectures: [
      { title: "Agentic System Mindset", preview: true },
      { title: "What is an AI Agent?" },
      { title: "Prompt Chaining" },
      { title: "Router" },
      { title: "Parallelization" },
      { title: "Async" },
      { title: "Orchestration" },
      { title: "Reviewer Optimizer" },
      { title: "Gradio" },
      { title: "Practice" },
    ],
  },
  {
    title: "Quick Revision",
    lectures: [{ title: "Revision Project" }],
  },
  {
    title: "Agent Tools",
    lectures: [
      { title: "LLMs Limitations and Tools Effect" },
      { title: "What are Tools?" },
      { title: "OpenRouter" },
      { title: "Tools Description" },
      { title: "Not That Smart" },
      { title: "Tool Decision" },
      { title: "Tool Calling" },
      { title: "Push Notification Project" },
    ],
  },
  {
    title: "RAG",
    lectures: [
      { title: "RAG Introduction" },
      { title: "Retrieval" },
      { title: "Fixed Size Chunking" },
      { title: "Semantic Chunking" },
      { title: "How Vector Database Works" },
    ],
  },
  {
    title: "RAG in Code",
    lectures: [
      { title: "Pre-processing" },
      { title: "RAG Coding - Part 1" },
      { title: "RAG Coding - Part 2" },
      { title: "RAG Coding - Part 3" },
      { title: "RAG Coding - Part 4" },
    ],
  },
  {
    title: "RAG in n8n",
    lectures: [
      { title: "Revision" },
      { title: "Fetch Files" },
      { title: "Pre-processing" },
      { title: "RAG Agent" },
    ],
  },
  {
    title: "HR RAG Case",
    lectures: [
      { title: "Case Introduction" },
      { title: "Revision" },
      { title: "Case Implementation - Part 1" },
      { title: "Case Implementation - Part 2" },
      { title: "Case Implementation - Part 3" },
    ],
  },
  {
    title: "CrewAI",
    lectures: [
      { title: "CrewAI Introduction" },
      { title: "Agent" },
      { title: "Task" },
      { title: "Crew" },
      { title: "Tools" },
      { title: "Custom Tools" },
      { title: "Output Style" },
      { title: "Memory" },
    ],
  },
];

export const agenticCurriculumAr: CourseModule[] = [
  {
    title: "ابدأ من هنا",
    lectures: [{ title: "مقدمة" }],
  },
  {
    title: "تعال نتعرّف أكتر على الذكاء الاصطناعي!",
    lectures: [
      { title: "مقدمة القسم" },
      { title: "مقدمة في الذكاء الاصطناعي", preview: true },
      { title: "ما هي نماذج اللغة (LLMs)" },
      { title: "هندسة الـ Prompt" },
      { title: "نماذج الـ LLMs" },
    ],
  },
  {
    title: "أساسيات البرمجة",
    lectures: [
      { title: "مقدمة القسم" },
      { title: "أساسيات البرمجة" },
      { title: "واجهات البرمجة (API)" },
      { title: "بيئة العمل" },
      { title: "Google Colab" },
      { title: "أول تطبيق GenAI لك" },
      { title: "كود مولَّد بالذكاء الاصطناعي" },
      { title: "كود وكيل الذكاء الاصطناعي" },
    ],
  },
  {
    title: "النظام الوكيلي",
    lectures: [
      { title: "مسار الكود" },
      { title: "التحكم في تدفق الـ LLM — الجزء 1" },
      { title: "التحكم في تدفق الـ LLM — الجزء 2" },
      { title: "التحكم في تدفق الـ LLM — الجزء 3" },
    ],
  },
  {
    title: "أنماط التصميم الوكيلي",
    lectures: [
      { title: "عقلية النظام الوكيلي", preview: true },
      { title: "ما هو وكيل الذكاء الاصطناعي؟" },
      { title: "سلسلة الـ Prompts" },
      { title: "الموجّه (Router)" },
      { title: "التوازي (Parallelization)" },
      { title: "غير المتزامن (Async)" },
      { title: "التنسيق (Orchestration)" },
      { title: "المراجع والمُحسِّن" },
      { title: "Gradio" },
      { title: "تدريب عملي" },
    ],
  },
  {
    title: "مراجعة سريعة",
    lectures: [{ title: "مشروع المراجعة" }],
  },
  {
    title: "أدوات الوكيل",
    lectures: [
      { title: "حدود نماذج اللغة وتأثير الأدوات" },
      { title: "ما هي الأدوات؟" },
      { title: "OpenRouter" },
      { title: "وصف الأدوات" },
      { title: "مش بالذكاء ده كله" },
      { title: "قرار استخدام الأداة" },
      { title: "استدعاء الأدوات" },
      { title: "مشروع إشعارات Push" },
    ],
  },
  {
    title: "RAG",
    lectures: [
      { title: "مقدمة RAG" },
      { title: "الاسترجاع (Retrieval)" },
      { title: "التقسيم بحجم ثابت" },
      { title: "التقسيم الدلالي" },
      { title: "كيف تعمل قواعد البيانات المتجهة" },
    ],
  },
  {
    title: "RAG في الكود",
    lectures: [
      { title: "المعالجة المسبقة" },
      { title: "برمجة RAG — الجزء 1" },
      { title: "برمجة RAG — الجزء 2" },
      { title: "برمجة RAG — الجزء 3" },
      { title: "برمجة RAG — الجزء 4" },
    ],
  },
  {
    title: "RAG في n8n",
    lectures: [
      { title: "مراجعة" },
      { title: "جلب الملفات" },
      { title: "المعالجة المسبقة" },
      { title: "وكيل RAG" },
    ],
  },
  {
    title: "حالة عملية: HR RAG",
    lectures: [
      { title: "مقدمة الحالة" },
      { title: "مراجعة" },
      { title: "تنفيذ الحالة — الجزء 1" },
      { title: "تنفيذ الحالة — الجزء 2" },
      { title: "تنفيذ الحالة — الجزء 3" },
    ],
  },
  {
    title: "CrewAI",
    lectures: [
      { title: "مقدمة CrewAI" },
      { title: "Agent" },
      { title: "Task" },
      { title: "Crew" },
      { title: "Tools" },
      { title: "أدوات مخصصة" },
      { title: "أسلوب المخرجات" },
      { title: "الذاكرة" },
    ],
  },
];
