import type { Locale } from "@/i18n/translations";

const brandBase = {
  monogram: "KN",
  email: "karimnouh112@gmail.com",
  // Team WhatsApp inbox — lead form messages open a chat with this number.
  phone: "+201132680858",
  youtube: "https://www.youtube.com/@kariimnabiil",
  linkedin: "https://www.linkedin.com/in/kariim-nabiil/",
  tiktok: "https://www.tiktok.com/@kariimnabiil",
  instagram: "https://www.instagram.com/kariim_nabiil/",
  coursePath: "/courses/agentic-ai-engineering",
  salesCourseUrl: "https://www.udemy.com/course/ai-sales-automation-using-n8n/",
  n8nPlaylistUrl: "https://www.youtube.com/playlist?list=PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto",
  advancedN8nPlaylistUrl: "https://www.youtube.com/playlist?list=PLLHIYYlcgk6KUa7VI3Fvi1Tuy4FsR27fd",
  enrollUrl: import.meta.env.VITE_COURSE_ENROLL_URL || "/enroll",
  contactUrl: "/contact",
  // Phone-based link so ?text= prefills work (wa.me/message/... short links ignore text).
  whatsappUrl: "https://wa.me/201132680858",
} as const;

export const BRAND = {
  ...brandBase,
  name: "Karim Nabil",
  fullName: "Karim Nabil Nouh",
  specialty: "Agentic AI Engineering",
  tagline: "Less Hype. More Engineering.",
  studentsLabel: "500+ students",
} as const;

export function getBrand(locale: Locale = "en") {
  if (locale === "ar") {
    return {
      ...brandBase,
      name: "كريم نبيل",
      fullName: "كريم نبيل نوح",
      specialty: "هندسة الذكاء الاصطناعي الوكيلي",
      tagline: "أقل ضجيجًا. مزيد من الهندسة.",
      studentsLabel: "+500 طالب",
      philosophy: "المفاهيم أولًا. الأدوات ثانيًا. مشاريع واقعية طوال الطريق.",
    };
  }

  return {
    ...brandBase,
    name: BRAND.name,
    fullName: BRAND.fullName,
    specialty: BRAND.specialty,
    tagline: BRAND.tagline,
    studentsLabel: BRAND.studentsLabel,
    philosophy: "Concepts First. Tools Second. Real-World Projects Throughout.",
  };
}
