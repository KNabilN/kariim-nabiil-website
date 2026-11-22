import { useQuery } from "@tanstack/react-query";
import type { CourseLecture, CourseModule } from "@/data/courses";
import { getCourseById } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import type { Locale } from "@/i18n/translations";

export type PublicCoursePricing = {
  price?: number;
  currency?: string;
  paidCourseId?: string;
  paidCourseTitle?: string;
};

export type PublicCourseCurriculumResult = PublicCoursePricing & {
  modules: CourseModule[];
  fromLms: boolean;
};

async function fetchLmsCurriculum(slug: string): Promise<PublicCourseCurriculumResult | null> {
  const { data: paid, error: paidError } = await supabase
    .from("paid_courses")
    .select("id, title, price, currency, slug, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (paidError || !paid || paid.is_active === false) return null;

  const pricing = {
    price: typeof paid.price === "number" ? Number(paid.price) : undefined,
    currency: paid.currency || undefined,
    paidCourseId: paid.id,
    paidCourseTitle: paid.title,
  };

  const { data: chapters, error: chaptersError } = await supabase
    .from("course_chapters")
    .select("id, title, description, order_index, is_published")
    .eq("course_id", paid.id)
    .eq("is_published", true)
    .order("order_index");

  if (chaptersError) return null;

  const chapterRows = chapters || [];
  if (chapterRows.length === 0) {
    return { modules: [], fromLms: true, ...pricing };
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("course_lessons")
    .select("id, chapter_id, title, order_index, is_published, is_preview, video_url")
    .in(
      "chapter_id",
      chapterRows.map((chapter) => chapter.id),
    )
    .eq("is_published", true)
    .order("order_index");

  if (lessonsError) return null;

  const lessonsByChapter = new Map<string, CourseLecture[]>();
  for (const lesson of lessons || []) {
    const list = lessonsByChapter.get(lesson.chapter_id) || [];
    const isPreview = Boolean(lesson.is_preview);
    list.push({
      title: lesson.title,
      preview: isPreview || undefined,
      // Only expose video URLs for free-preview lectures on the public page
      videoUrl: isPreview && lesson.video_url ? lesson.video_url : undefined,
    });
    lessonsByChapter.set(lesson.chapter_id, list);
  }

  const modules: CourseModule[] = chapterRows.map((chapter) => ({
    title: chapter.title,
    body: chapter.description || undefined,
    lectures: lessonsByChapter.get(chapter.id) || [],
  }));

  return { modules, fromLms: true, ...pricing };
}

export function usePublicCourseCurriculum(slug: string, locale: Locale) {
  return useQuery({
    queryKey: ["public-course-curriculum", slug, locale],
    queryFn: async (): Promise<PublicCourseCurriculumResult> => {
      const lms = await fetchLmsCurriculum(slug);

      // Linked LMS course → always trust Supabase (even if outline is empty)
      if (lms) return lms;

      const staticCourse = getCourseById(slug, locale);
      return {
        modules: staticCourse?.modules || [],
        fromLms: false,
        price: staticCourse?.price,
        currency: staticCourse?.currency,
      };
    },
    staleTime: 30_000,
  });
}
