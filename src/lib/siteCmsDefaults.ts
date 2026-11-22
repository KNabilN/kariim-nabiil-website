import { BRAND } from "@/lib/brand";
import { getCatalogCourses } from "@/data/courses";
import { getCv } from "@/data/cv";
import { defaultProjects, defaultProjectsAr } from "@/data/projects";
import { galleryItems } from "@/data/gallery";

export function defaultBrandCms() {
  return {
    en: {
      name: BRAND.name,
      fullName: BRAND.fullName,
      specialty: BRAND.specialty,
      tagline: BRAND.tagline,
      studentsLabel: BRAND.studentsLabel,
      philosophy: "Concepts First. Tools Second. Real-World Projects Throughout.",
    },
    ar: {
      name: "كريم نبيل",
      fullName: "كريم نبيل نوح",
      specialty: "هندسة الذكاء الاصطناعي الوكيلي",
      tagline: "أقل ضجيجًا. مزيد من الهندسة.",
      studentsLabel: "+500 طالب",
      philosophy: "المفاهيم أولًا. الأدوات ثانيًا. مشاريع واقعية طوال الطريق.",
    },
    youtube: BRAND.youtube as string,
    linkedin: BRAND.linkedin as string,
    tiktok: BRAND.tiktok as string,
    instagram: BRAND.instagram as string,
    whatsappUrl: BRAND.whatsappUrl as string,
    coursePath: BRAND.coursePath as string,
    salesCourseUrl: BRAND.salesCourseUrl as string,
    n8nPlaylistUrl: BRAND.n8nPlaylistUrl as string,
    advancedN8nPlaylistUrl: BRAND.advancedN8nPlaylistUrl as string,
  };
}

export function defaultHomeCms() {
  return {
    en: {
      stats: [
        { value: "1M+", label: "YouTube views" },
        { value: "2×", label: "NASA Space Apps" },
        { value: "Sr.", label: "AI Engineer" },
      ],
    },
    ar: {
      stats: [
        { value: "1M+", label: "مشاهدات يوتيوب" },
        { value: "2×", label: "NASA Space Apps" },
        { value: "أول", label: "مهندس ذكاء اصطناعي" },
      ],
    },
  };
}

export function defaultCatalogCms() {
  const en = getCatalogCourses("en");
  const ar = getCatalogCourses("ar");
  return en.map((course, index) => {
    const arCourse = ar[index];
    return {
      id: course.id,
      categoryId: course.categoryId,
      href: course.href,
      external: !!course.external,
      free: !!course.free,
      featured: !!course.featured,
      imageUrl: "",
      title: { en: course.title, ar: arCourse?.title || course.title },
      description: { en: course.description, ar: arCourse?.description || course.description },
      level: { en: course.level, ar: arCourse?.level || course.level },
      highlights: {
        en: course.highlights || [],
        ar: arCourse?.highlights || course.highlights || [],
      },
      learnings: {
        en: course.learnings || [],
        ar: arCourse?.learnings || course.learnings || [],
      },
      modules: {
        en: course.modules || [],
        ar: arCourse?.modules || course.modules || [],
      },
    };
  });
}

export function defaultProjectsCms() {
  return {
    en: defaultProjects,
    ar: defaultProjectsAr,
  };
}

export function defaultCvCms() {
  return {
    en: getCv("en"),
    ar: getCv("ar"),
  };
}

export function defaultGalleryCms() {
  return galleryItems.map((item, index) => ({
    id: item.id,
    src: typeof item.src === "string" ? item.src : "",
    imageUrl: "",
    order: index,
    objectPosition: item.objectPosition || "",
    alt: item.alt,
    caption: item.caption,
    tag: item.tag,
  }));
}
