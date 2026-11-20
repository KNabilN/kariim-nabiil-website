import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  PlayCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { normalizeVideoUrl } from "@/lib/videoUrl";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type PaidCourse = { id: string; title: string; price: number | null; currency: string | null };
type Chapter = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
};
type Lesson = {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  order_index: number;
  is_published: boolean;
};
type Resource = {
  id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
};

type LessonDraft = {
  title: string;
  description: string;
  video_url: string;
  is_published: boolean;
};

export function CourseContentEditor() {
  const { t, locale } = useLanguage();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [paidCourses, setPaidCourses] = useState<PaidCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft | null>(null);
  const [lessonDirty, setLessonDirty] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitleDraft, setSectionTitleDraft] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseCurrency, setCourseCurrency] = useState("EGP");

  const fetchAll = useCallback(async (preferredCourseId?: string) => {
    setLoading(true);
    const [chapRes, coursesRes] = await Promise.all([
      supabase.from("course_chapters").select("*").order("order_index"),
      supabase.from("paid_courses").select("*").order("title"),
    ]);
    const chapterRows = (chapRes.data || []) as Chapter[];
    const courseRows = (coursesRes.data || []) as PaidCourse[];
    setChapters(chapterRows);
    setPaidCourses(courseRows);

    const chapterIds = chapterRows.map((chapter) => chapter.id);
    let lessonRows: Lesson[] = [];
    if (chapterIds.length > 0) {
      const { data } = await supabase.from("course_lessons").select("*").in("chapter_id", chapterIds).order("order_index");
      lessonRows = (data || []) as Lesson[];
    }
    setLessons(lessonRows);

    setSelectedCourseId((current) => {
      if (preferredCourseId) return preferredCourseId;
      if (current && courseRows.some((course) => course.id === current)) return current;
      return courseRows[0]?.id || "";
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const filteredChapters = useMemo(
    () => chapters.filter((chapter) => chapter.course_id === selectedCourseId).sort((a, b) => a.order_index - b.order_index),
    [chapters, selectedCourseId],
  );

  const lessonsByChapter = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const lesson of lessons) {
      const list = map.get(lesson.chapter_id) || [];
      list.push(lesson);
      map.set(lesson.chapter_id, list);
    }
    for (const [key, list] of map) {
      map.set(
        key,
        [...list].sort((a, b) => a.order_index - b.order_index),
      );
    }
    return map;
  }, [lessons]);

  const openLesson = (lesson: Lesson) => {
    if (expandedLessonId === lesson.id) {
      if (lessonDirty && !window.confirm(locale === "ar" ? "في تعديلات غير محفوظة. إلغاء؟" : "Discard unsaved changes?")) {
        return;
      }
      setExpandedLessonId(null);
      setLessonDraft(null);
      setLessonDirty(false);
      return;
    }
    if (lessonDirty && !window.confirm(locale === "ar" ? "في تعديلات غير محفوظة. إلغاء؟" : "Discard unsaved changes?")) {
      return;
    }
    setExpandedLessonId(lesson.id);
    setLessonDraft({
      title: lesson.title,
      description: lesson.description || "",
      video_url: lesson.video_url || "",
      is_published: lesson.is_published,
    });
    setLessonDirty(false);
  };

  const updateDraft = (patch: Partial<LessonDraft>) => {
    setLessonDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    setLessonDirty(true);
  };

  const cancelLessonEdit = () => {
    const lesson = lessons.find((item) => item.id === expandedLessonId);
    if (!lesson) return;
    setLessonDraft({
      title: lesson.title,
      description: lesson.description || "",
      video_url: lesson.video_url || "",
      is_published: lesson.is_published,
    });
    setLessonDirty(false);
  };

  const saveLessonEdit = async () => {
    if (!expandedLessonId || !lessonDraft) return;
    setSavingLesson(true);
    const { error } = await supabase
      .from("course_lessons")
      .update({
        title: lessonDraft.title.trim() || "Untitled lecture",
        description: lessonDraft.description.trim() || null,
        video_url: lessonDraft.video_url.trim() ? normalizeVideoUrl(lessonDraft.video_url) : null,
        is_published: lessonDraft.is_published,
      } as never)
      .eq("id", expandedLessonId);
    if (error) {
      toast({ title: "Lesson could not be saved", description: error.message, variant: "destructive" });
    } else {
      setLessonDirty(false);
      toast({ title: t.admin.saved });
      await fetchAll();
    }
    setSavingLesson(false);
  };

  const createCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!courseTitle.trim()) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("paid_courses")
      .insert({
        title: courseTitle.trim(),
        price: coursePrice ? Number(coursePrice) : 0,
        currency: courseCurrency,
      })
      .select("id")
      .single();
    if (error || !data) {
      toast({ title: "Course could not be created", description: error?.message || "Please try again.", variant: "destructive" });
    } else {
      setCourseTitle("");
      setCoursePrice("");
      await fetchAll(data.id);
    }
    setBusy(false);
  };

  const addSection = async () => {
    if (!selectedCourseId) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("course_chapters")
      .insert({
        title: locale === "ar" ? "قسم جديد" : "New section",
        description: null,
        order_index: filteredChapters.length,
        is_published: false,
        course_id: selectedCourseId,
      })
      .select("*")
      .single();
    if (error) {
      toast({ title: "Section could not be created", description: error.message, variant: "destructive" });
    } else if (data) {
      setEditingSectionId(data.id);
      setSectionTitleDraft(data.title);
      await fetchAll();
    }
    setBusy(false);
  };

  const saveSectionTitle = async (chapterId: string) => {
    const title = sectionTitleDraft.trim();
    if (!title) return;
    const { error } = await supabase.from("course_chapters").update({ title } as never).eq("id", chapterId);
    if (error) toast({ title: "Section could not be updated", description: error.message, variant: "destructive" });
    else {
      setEditingSectionId(null);
      await fetchAll();
    }
  };

  const deleteSection = async (chapterId: string) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    setBusy(true);
    const { error } = await supabase.from("course_chapters").delete().eq("id", chapterId);
    if (error) toast({ title: "Section could not be deleted", description: error.message, variant: "destructive" });
    else {
      if (expandedLessonId) {
        const stillExists = lessons.some((lesson) => lesson.id === expandedLessonId && lesson.chapter_id !== chapterId);
        if (!stillExists) {
          setExpandedLessonId(null);
          setLessonDraft(null);
          setLessonDirty(false);
        }
      }
      await fetchAll();
    }
    setBusy(false);
  };

  const addLecture = async (chapterId: string) => {
    const existing = lessonsByChapter.get(chapterId) || [];
    setBusy(true);
    const { data, error } = await supabase
      .from("course_lessons")
      .insert({
        chapter_id: chapterId,
        title: locale === "ar" ? "محاضرة جديدة" : "New lecture",
        description: null,
        video_url: null,
        order_index: existing.length,
        is_published: false,
      })
      .select("*")
      .single();
    if (error) {
      toast({ title: "Lecture could not be added", description: error.message, variant: "destructive" });
    } else if (data) {
      await fetchAll();
      setExpandedLessonId(data.id);
      setLessonDraft({
        title: data.title,
        description: "",
        video_url: "",
        is_published: false,
      });
      setLessonDirty(false);
    }
    setBusy(false);
  };

  const deleteLecture = async (lessonId: string) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    setBusy(true);
    const { error } = await supabase.from("course_lessons").delete().eq("id", lessonId);
    if (error) toast({ title: "Lecture could not be deleted", description: error.message, variant: "destructive" });
    else {
      if (expandedLessonId === lessonId) {
        setExpandedLessonId(null);
        setLessonDraft(null);
        setLessonDirty(false);
      }
      await fetchAll();
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={createCourse}
        className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[minmax(0,1fr)_140px_110px_auto] md:items-end"
      >
        <div>
          <Label>{locale === "ar" ? "دورة جديدة" : "New course"}</Label>
          <Input
            value={courseTitle}
            onChange={(event) => setCourseTitle(event.target.value)}
            className="mt-1"
            placeholder={locale === "ar" ? "عنوان الدورة" : "Course title"}
            required
          />
        </div>
        <div>
          <Label>{locale === "ar" ? "السعر" : "Price"}</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={coursePrice}
            onChange={(event) => setCoursePrice(event.target.value)}
            className="mt-1"
            placeholder="0.00"
          />
        </div>
        <div>
          <Label>{locale === "ar" ? "العملة" : "Currency"}</Label>
          <select
            value={courseCurrency}
            onChange={(event) => setCourseCurrency(event.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <Button type="submit" disabled={busy || !courseTitle.trim()}>
          {busy ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <Plus className="me-1 h-4 w-4" />}
          {locale === "ar" ? "إنشاء" : "Create"}
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {locale === "ar"
            ? "قسّم دورتك لأقسام، كل قسم لهدف تعليمي واحد. بعدين ضيف محاضرات وفيديوهات وملفات زي يوديمي."
            : "Create your course in sections, each focused on a single learning objective. Then add lectures, videos, and resources."}
        </p>
        <select
          aria-label="Select course"
          value={selectedCourseId}
          onChange={(event) => {
            if (lessonDirty && !window.confirm(locale === "ar" ? "في تعديلات غير محفوظة. إلغاء؟" : "Discard unsaved changes?")) {
              return;
            }
            setExpandedLessonId(null);
            setLessonDraft(null);
            setLessonDirty(false);
            setSelectedCourseId(event.target.value);
          }}
          className="flex h-10 min-w-56 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {paidCourses.length === 0 ? (
            <option value="">{locale === "ar" ? "مفيش دورات" : "No courses yet"}</option>
          ) : (
            paidCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))
          )}
        </select>
      </div>

      {!selectedCourseId ? (
        <p className="py-8 text-sm text-muted-foreground">
          {locale === "ar" ? "أنشئ دورة عشان تبدأ تضيف المحتوى." : "Create a course to start building the curriculum."}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredChapters.map((chapter, sectionIndex) => {
            const sectionLessons = lessonsByChapter.get(chapter.id) || [];
            return (
              <section key={chapter.id} className="overflow-hidden rounded-lg border border-[#d1d2e0] bg-[#f7f9fa]">
                <div className="flex flex-wrap items-center gap-2 border-b border-[#d1d2e0] bg-[#f7f9fa] px-4 py-3">
                  <span className="text-sm font-bold text-[#2d2f31]">
                    {locale === "ar" ? `القسم ${sectionIndex + 1}:` : `Section ${sectionIndex + 1}:`}
                  </span>
                  {editingSectionId === chapter.id ? (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <Input
                        value={sectionTitleDraft}
                        onChange={(event) => setSectionTitleDraft(event.target.value)}
                        className="h-9 max-w-md bg-white"
                        autoFocus
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void saveSectionTitle(chapter.id);
                          }
                          if (event.key === "Escape") setEditingSectionId(null);
                        }}
                      />
                      <Button type="button" size="sm" onClick={() => void saveSectionTitle(chapter.id)}>
                        {t.admin.save}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingSectionId(null)}>
                        {t.admin.cancel}
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex min-w-0 flex-1 items-center gap-2 text-start text-sm font-semibold text-[#2d2f31] hover:text-primary"
                      onClick={() => {
                        setEditingSectionId(chapter.id);
                        setSectionTitleDraft(chapter.title);
                      }}
                    >
                      <FileText className="h-4 w-4 shrink-0 text-[#6a6f73]" />
                      <span className="truncate">{chapter.title}</span>
                    </button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    aria-label={`Delete ${chapter.title}`}
                    onClick={() => void deleteSection(chapter.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-0 bg-white p-3">
                  {sectionLessons.map((lesson, lectureIndex) => {
                    const open = expandedLessonId === lesson.id;
                    const ready = Boolean(lesson.video_url) || lesson.is_published;
                    return (
                      <div key={lesson.id} className="border border-[#d1d2e0] border-b-0 last:border-b first:rounded-t-md last:rounded-b-md">
                        <button
                          type="button"
                          onClick={() => openLesson(lesson)}
                          className="flex w-full items-center gap-3 px-3 py-3 text-start hover:bg-[#f7f9fa]"
                        >
                          {ready ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1e6055]" />
                          ) : (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#6a6f73] text-[10px] text-[#6a6f73]">
                              {lectureIndex + 1}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-[#2d2f31]">
                            {locale === "ar" ? `محاضرة ${lectureIndex + 1}:` : `Lecture ${lectureIndex + 1}:`}
                          </span>
                          <PlayCircle className="h-4 w-4 shrink-0 text-[#6a6f73]" />
                          <span className="min-w-0 flex-1 truncate text-sm text-[#2d2f31]">{lesson.title}</span>
                          {lesson.is_published && (
                            <span className="rounded border border-[#a435f0]/30 bg-[#a435f0]/10 px-2 py-0.5 text-[11px] font-semibold text-[#5624d0]">
                              {locale === "ar" ? "معاينة مفعّلة" : "Preview enabled"}
                            </span>
                          )}
                          {open ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-[#6a6f73]" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-[#6a6f73]" />
                          )}
                        </button>

                        {open && lessonDraft && (
                          <div className="space-y-4 border-t border-[#d1d2e0] bg-[#f7f9fa] p-4">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <Label>{locale === "ar" ? "عنوان المحاضرة" : "Lecture title"}</Label>
                                <Input
                                  className="mt-1 bg-white"
                                  value={lessonDraft.title}
                                  onChange={(event) => updateDraft({ title: event.target.value })}
                                />
                              </div>
                              <div>
                                <Label>{locale === "ar" ? "رابط الفيديو (يوتيوب أو درايف)" : "Video link (YouTube or Drive)"}</Label>
                                <Input
                                  className="mt-1 bg-white"
                                  type="url"
                                  value={lessonDraft.video_url}
                                  onChange={(event) => updateDraft({ video_url: event.target.value })}
                                  placeholder="https://..."
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>{locale === "ar" ? "الوصف" : "Description"}</Label>
                                <Textarea
                                  className="mt-1 bg-white"
                                  value={lessonDraft.description}
                                  onChange={(event) => updateDraft({ description: event.target.value })}
                                  placeholder={locale === "ar" ? "ملاحظات اختيارية" : "Optional lecture notes"}
                                />
                              </div>
                            </div>

                            <label className="inline-flex items-center gap-2 text-sm text-[#2d2f31]">
                              <input
                                type="checkbox"
                                checked={lessonDraft.is_published}
                                onChange={(event) => updateDraft({ is_published: event.target.checked })}
                              />
                              {locale === "ar" ? "تفعيل المعاينة / النشر" : "Enable preview / publish"}
                            </label>

                            <LessonResourcesPanel lessonId={lesson.id} chapterId={chapter.id} />

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#d1d2e0] pt-3">
                              <Button type="button" variant="ghost" size="sm" onClick={() => void deleteLecture(lesson.id)}>
                                <Trash2 className="me-1 h-4 w-4 text-destructive" />
                                {t.admin.delete}
                              </Button>
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" disabled={!lessonDirty || savingLesson} onClick={cancelLessonEdit}>
                                  {t.admin.cancel}
                                </Button>
                                <Button type="button" size="sm" disabled={!lessonDirty || savingLesson} onClick={() => void saveLessonEdit()}>
                                  {savingLesson ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : null}
                                  {t.admin.save}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className={cn("pt-3", sectionLessons.length > 0 && "px-1")}>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#a435f0] text-[#5624d0] hover:bg-[#a435f0]/10 hover:text-[#5624d0]"
                      disabled={busy}
                      onClick={() => void addLecture(chapter.id)}
                    >
                      <Plus className="me-1 h-4 w-4" />
                      {locale === "ar" ? "عنصر منهج" : "Curriculum item"}
                    </Button>
                  </div>
                </div>
              </section>
            );
          })}

          <Button type="button" variant="outline" disabled={busy} onClick={() => void addSection()}>
            <Plus className="me-1 h-4 w-4" />
            {locale === "ar" ? "إضافة قسم" : "Add section"}
          </Button>
        </div>
      )}
    </div>
  );
}

function LessonResourcesPanel({ lessonId, chapterId }: { lessonId: string; chapterId: string }) {
  const { locale, t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fetchResources = useCallback(async () => {
    const { data, error } = await supabase.from("chapter_resources").select("*").eq("lesson_id", lessonId).order("created_at");
    setResources((data || []) as Resource[]);
    if (error) toast({ title: "Could not load resources", description: error.message, variant: "destructive" });
  }, [lessonId]);

  useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const fileName = `${lessonId}/${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage.from("course-resources").upload(fileName, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { error: insertError } = await supabase.from("chapter_resources").insert({
      chapter_id: chapterId,
      lesson_id: lessonId,
      title: file.name,
      file_url: fileName,
      file_type: file.type,
      file_size: file.size,
    });
    if (insertError) {
      await supabase.storage.from("course-resources").remove([fileName]);
      toast({ title: "Resource could not be saved", description: insertError.message, variant: "destructive" });
    } else {
      await fetchResources();
      toast({ title: locale === "ar" ? "تم رفع الملف" : "File uploaded" });
    }
    setUploading(false);
  };

  const deleteResource = async (resource: Resource) => {
    const { error } = await supabase.from("chapter_resources").delete().eq("id", resource.id);
    if (error) {
      toast({ title: "Resource could not be removed", description: error.message, variant: "destructive" });
      return;
    }
    if (!resource.file_url.startsWith("http")) await supabase.storage.from("course-resources").remove([resource.file_url]);
    await fetchResources();
  };

  return (
    <div className="space-y-3">
      <Label>{locale === "ar" ? "ملفات المحاضرة" : "Lecture resources"}</Label>
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-center justify-between gap-3 rounded-md border border-[#d1d2e0] bg-white px-3 py-2 text-sm">
          <span className="min-w-0 truncate">{resource.title}</span>
          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${resource.title}`} onClick={() => void deleteResource(resource)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
          dragging ? "border-[#a435f0] bg-[#a435f0]/5" : "border-[#d1d2e0] bg-white hover:border-[#a435f0]/60",
          uploading && "pointer-events-none opacity-60",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
      >
        {uploading ? <Loader2 className="h-6 w-6 animate-spin text-[#5624d0]" /> : <Upload className="h-6 w-6 text-[#5624d0]" />}
        <span className="text-sm font-semibold text-[#2d2f31]">
          {uploading
            ? locale === "ar"
              ? "جاري الرفع..."
              : "Uploading..."
            : locale === "ar"
              ? "اسحب الملف هنا أو اضغط للرفع"
              : "Drag a file here or click to upload"}
        </span>
        <span className="text-xs text-muted-foreground">
          {locale === "ar" ? "PDF، صور، ملفات، زي يوديمي" : "PDF, images, docs — Udemy-style upload"}
        </span>
        <input
          type="file"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
            event.target.value = "";
          }}
        />
      </label>
      {resources.length === 0 && (
        <p className="text-xs text-muted-foreground">{t.admin.add} — {locale === "ar" ? "اختياري" : "optional"}</p>
      )}
    </div>
  );
}
