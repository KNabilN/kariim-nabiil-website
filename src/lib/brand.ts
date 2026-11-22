import type { Locale } from "@/i18n/translations";

const brandBase = {
  monogram: "KN",
  email: "karimnouh112@gmail.com",
  phone: "+201273091969",
  youtube: "https://www.youtube.com/@kariimnabiil",
  linkedin: "https://www.linkedin.com/in/kariim-nabiil/",
  coursePath: "/courses/agentic-ai-engineering",
  salesCourseUrl: "https://www.udemy.com/course/ai-sales-automation-using-n8n/",
  n8nPlaylistUrl: "https://www.youtube.com/playlist?list=PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto",
  advancedN8nPlaylistUrl: "https://www.youtube.com/playlist?list=PLLHIYYlcgk6KUa7VI3Fvi1Tuy4FsR27fd",
  enrollUrl: import.meta.env.VITE_COURSE_ENROLL_URL || "/enroll",
  contactUrl: "/contact",
  whatsappUrl: "https://wa.me/message/3J6SMTFRTNR7I1",
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
