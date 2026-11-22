import { agenticCurriculumEn } from "@/data/agenticCurriculum";
import { supabase } from "@/integrations/supabase/client";
import { AGENTIC_COURSE_SLUG } from "@/lib/ensureAgenticPaidCourse";

/**
 * Deletes existing LMS chapters for the course, then seeds the default
 * Agentic curriculum (published sections/lectures + preview flags).
 */
export async function resetAgenticCurriculum(courseId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  await supabase.from("paid_courses").update({ slug: AGENTIC_COURSE_SLUG }).eq("id", courseId);

  const { error: deleteError } = await supabase.from("course_chapters").delete().eq("course_id", courseId);
  if (deleteError) return { ok: false, error: deleteError.message };

  for (let sectionIndex = 0; sectionIndex < agenticCurriculumEn.length; sectionIndex++) {
    const section = agenticCurriculumEn[sectionIndex];
    const { data: chapter, error: chapterError } = await supabase
      .from("course_chapters")
      .insert({
        title: section.title,
        description: null,
        order_index: sectionIndex,
        is_published: true,
        course_id: courseId,
      })
      .select("id")
      .single();

    if (chapterError || !chapter) {
      return { ok: false, error: chapterError?.message || "Could not create section" };
    }

    const lectures = section.lectures || [];
    if (lectures.length === 0) continue;

    const { error: lessonsError } = await supabase.from("course_lessons").insert(
      lectures.map((lecture, lectureIndex) => ({
        chapter_id: chapter.id,
        title: lecture.title,
        description: null,
        video_url: null,
        order_index: lectureIndex,
        is_published: true,
        is_preview: Boolean(lecture.preview),
      })),
    );

    if (lessonsError) {
      return { ok: false, error: lessonsError.message };
    }
  }

  return { ok: true };
}

/** @deprecated use resetAgenticCurriculum */
export async function importAgenticCurriculumIfEmpty(courseId: string) {
  const { count, error: countError } = await supabase
    .from("course_chapters")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (countError) return { imported: false, error: countError.message };
  if ((count || 0) > 0) return { imported: false };

  const result = await resetAgenticCurriculum(courseId);
  return { imported: result.ok, error: result.error };
}
