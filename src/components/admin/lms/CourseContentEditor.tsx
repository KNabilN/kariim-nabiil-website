import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  PlayCircle,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import {
  AGENTIC_COURSE_SLUG,
  ensureAgenticPaidCourse,
} from "@/lib/ensureAgenticPaidCourse";
import { resetAgenticCurriculum } from "@/lib/importAgenticCurriculum";
import { normalizeVideoUrl } from "@/lib/videoUrl";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const AGENTIC_SLUG = AGENTIC_COURSE_SLUG;

type PaidCourse = {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  slug: string | null;
};
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
  is_preview: boolean;
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
  is_preview: boolean;
};

export function CourseContentEditor() {
  const { t, locale } = useLanguage();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [paidCourses, setPaidCourses] = useState<PaidCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft | null>(null);
  const [lessonDirty, setLessonDirty] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitleDraft, setSectionTitleDraft] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseCurrency, setCourseCurrency] = useState("EGP");
  const [courseSlug, setCourseSlug] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  const fetchAll = useCallback(
    async (preferredCourseId?: string, opts?: { silent?: boolean }) => {
      // Avoid blanking the whole editor when revisiting / soft-refreshing
      if (!opts?.silent) setLoading(true);

      const ensured = await ensureAgenticPaidCourse();

      const coursesRes = await supabase
        .from("paid_courses")
        .select("id, title, price, currency, slug")
        .order("title");

      let courseRows: PaidCourse[] = [];
      if (coursesRes.error) {
        if (/slug/i.test(coursesRes.error.message || "")) {
          const withoutSlug = await supabase.from("paid_courses").select("id, title, price, currency").order("title");
          if (withoutSlug.error) {
            toast({
              title: locale === "ar" ? "فشل تحميل الدورات" : "Could not load courses",
              description: withoutSlug.error.message,
              variant: "destructive",
            });
          } else {
            courseRows = (withoutSlug.data || []).map((course) => ({ ...course, slug: null }));
          }
        } else {
          toast({
            title: locale === "ar" ? "فشل تحميل الدورات" : "Could not load courses",
            description: coursesRes.error.message,
            variant: "destructive",
          });
        }
      } else {
        courseRows = coursesRes.data || [];
      }

      const chapRes = await supabase.from("course_chapters").select("*").order("order_index");
      const chapterRows = (chapRes.data || []) as Chapter[];

      if (ensured && !courseRows.some((course) => course.id === ensured.id)) {
        courseRows = [...courseRows, ensured];
      }

      setChapters(chapterRows);
      setPaidCourses(courseRows);

      const chapterIds = chapterRows.map((chapter) => chapter.id);
      let lessonRows: Lesson[] = [];
      if (chapterIds.length > 0) {
        const { data } = await supabase
          .from("course_lessons")
          .select("*")
          .in("chapter_id", chapterIds)
          .order("order_index");
        lessonRows = ((data || []) as Lesson[]).map((lesson) => ({
          ...lesson,
          is_preview: Boolean(lesson.is_preview),
        }));
      }
      setLessons(lessonRows);

      const agenticId =
        courseRows.find((course) => course.slug === AGENTIC_SLUG)?.id ||
        courseRows.find((course) => /agentic/i.test(course.title))?.id ||
        ensured?.id;

      setSelectedCourseId((current) => {
        if (preferredCourseId) return preferredCourseId;
        if (current && courseRows.some((course) => course.id === current)) return current;
        return agenticId || courseRows[0]?.id || "";
      });
      setLoading(false);
    },
    [locale],
  );

  useEffect(() => {
    void fetchAll(undefined, { silent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; avoid refetch loops on locale/callback identity
  }, []);

  useEffect(() => {
    const selected = paidCourses.find((course) => course.id === selectedCourseId);
    if (!selected) {
      setSelectedPrice("");
      setSelectedCurrency("EGP");
      setSelectedSlug("");
      return;
    }
    setSelectedPrice(selected.price != null ? String(selected.price) : "");
    setSelectedCurrency(selected.currency || "EGP");
    setSelectedSlug(selected.slug || "");
  }, [paidCourses, selectedCourseId]);

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
      is_preview: lesson.is_preview,
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
      is_preview: lesson.is_preview,
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
        is_preview: lessonDraft.is_preview,
      } as never)
      .eq("id", expandedLessonId);
    if (error) {
      toast({ title: "Lesson could not be saved", description: error.message, variant: "destructive" });
    } else {
      setLessonDirty(false);
      toast({ title: t.admin.saved });
      await fetchAll(selectedCourseId, { silent: true });
    }
    setSavingLesson(false);
  };

  const createCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!courseTitle.trim()) return;
    setBusy(true);
    const slug = courseSlug.trim() || null;
    const { data, error } = await supabase
      .from("paid_courses")
      .insert({
        title: courseTitle.trim(),
        price: coursePrice ? Number(coursePrice) : 0,
        currency: courseCurrency,
        slug,
      })
      .select("id")
      .single();
    if (error || !data) {
      toast({ title: "Course could not be created", description: error?.message || "Please try again.", variant: "destructive" });
    } else {
      setCourseTitle("");
      setCoursePrice("");
      setCourseSlug("");
      setShowNewCourse(false);
      await fetchAll(data.id);
    }
    setBusy(false);
  };

  const saveCourseMeta = async () => {
    if (!selectedCourseId) return;
    setSavingMeta(true);
    const slugValue = selectedSlug.trim() || null;
    const { error } = await supabase
      .from("paid_courses")
      .update({
        price: selectedPrice ? Number(selectedPrice) : 0,
        currency: selectedCurrency,
        slug: slugValue,
      } as never)
      .eq("id", selectedCourseId);
    if (error) {
      toast({ title: "Course settings could not be saved", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t.admin.saved });
      await fetchAll(selectedCourseId, { silent: true });
    }
    setSavingMeta(false);
  };

  const resetDefaultCurriculum = async () => {
    if (!selectedCourseId) return;
    if (
      !window.confirm(
        locale === "ar"
          ? "هيتبدل كل المحتوى الحالي بمنهج Agentic الافتراضي (12 قسم / 64 محاضرة). متأكد؟"
          : "This replaces all current content with the default Agentic curriculum (12 sections / 64 lectures). Continue?",
      )
    ) {
      return;
    }

    setBusy(true);
    const result = await resetAgenticCurriculum(selectedCourseId);
    if (!result.ok) {
      toast({ title: "Reset failed", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: locale === "ar" ? "تم إعادة ضبط المنهج" : "Curriculum reset",
        description: locale === "ar" ? "هيظهر على صفحة الكورس العامة." : "It will show on the public course page.",
      });
    }
    await fetchAll(selectedCourseId, { silent: true });
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
        is_published: true,
        course_id: selectedCourseId,
      })
      .select("*")
      .single();
    if (error) {
      toast({ title: "Section could not be created", description: error.message, variant: "destructive" });
    } else if (data) {
      setEditingSectionId(data.id);
      setSectionTitleDraft(data.title);
      await fetchAll(selectedCourseId, { silent: true });
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
      await fetchAll(selectedCourseId, { silent: true });
    }
  };

  const toggleSectionPublished = async (chapter: Chapter) => {
    const { error } = await supabase
      .from("course_chapters")
      .update({ is_published: !chapter.is_published } as never)
      .eq("id", chapter.id);
    if (error) toast({ title: "Section could not be updated", description: error.message, variant: "destructive" });
    else await fetchAll(selectedCourseId, { silent: true });
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
      await fetchAll(selectedCourseId, { silent: true });
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
        is_published: true,
        is_preview: false,
      })
      .select("*")
      .single();
    if (error) {
      toast({ title: "Lecture could not be added", description: error.message, variant: "destructive" });
    } else if (data) {
      await fetchAll(selectedCourseId, { silent: true });
      setExpandedLessonId(data.id);
      setLessonDraft({
        title: data.title,
        description: "",
        video_url: "",
        is_published: true,
        is_preview: false,
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
      await fetchAll(selectedCourseId, { silent: true });
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

  const publicPath = selectedSlug.trim() ? `/courses/${selectedSlug.trim()}` : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {locale === "ar"
            ? "عدّل الأقسام والمحاضرات من هنا — التغييرات تظهر على صفحة الكورس العامة."
            : "Edit sections and lectures here — changes show on the public course page."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
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
                  {course.slug ? ` (${course.slug})` : ""}
                </option>
              ))
            )}
          </select>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowNewCourse((open) => !open)}>
            <Plus className="me-1 h-4 w-4" />
            {locale === "ar" ? "دورة جديدة" : "New course"}
          </Button>
        </div>
      </div>

      {showNewCourse && (
        <form
          onSubmit={createCourse}
          className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          <div className="lg:col-span-2">
            <Label>{locale === "ar" ? "عنوان الدورة" : "Course title"}</Label>
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
          <div>
            <Label>Slug</Label>
            <Input
              value={courseSlug}
              onChange={(event) => setCourseSlug(event.target.value)}
              className="mt-1"
              placeholder={AGENTIC_SLUG}
            />
          </div>
          <div className="flex gap-2 lg:col-span-5">
            <Button type="submit" disabled={busy || !courseTitle.trim()}>
              {busy ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <Plus className="me-1 h-4 w-4" />}
              {locale === "ar" ? "إنشاء" : "Create"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowNewCourse(false)}>
              {t.admin.cancel}
            </Button>
          </div>
        </form>
      )}

      {!selectedCourseId ? (
        <p className="py-8 text-sm text-muted-foreground">
          {locale === "ar" ? "أنشئ دورة عشان تبدأ تضيف المحتوى." : "Create a course to start building the curriculum."}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label>Slug ({locale === "ar" ? "رابط صفحة الكورس" : "public course id"})</Label>
                <Input
                  value={selectedSlug}
                  onChange={(event) => setSelectedSlug(event.target.value)}
                  className="mt-1"
                  placeholder={AGENTIC_SLUG}
                />
              </div>
              <div>
                <Label>{locale === "ar" ? "السعر" : "Price"}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedPrice}
                  onChange={(event) => setSelectedPrice(event.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{locale === "ar" ? "العملة" : "Currency"}</Label>
                <select
                  value={selectedCurrency}
                  onChange={(event) => setSelectedCurrency(event.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={savingMeta || busy} onClick={() => void saveCourseMeta()}>
                {savingMeta ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : null}
                {locale === "ar" ? "حفظ الإعدادات" : "Save settings"}
              </Button>
              <Button type="button" variant="outline" disabled={busy} onClick={() => void resetDefaultCurriculum()}>
                {locale === "ar" ? "إعادة ضبط المنهج الافتراضي" : "Reset to default curriculum"}
              </Button>
              {publicPath && (
                <Button asChild type="button" variant="ghost">
                  <Link to={publicPath} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="me-1 h-4 w-4" />
                    {locale === "ar" ? "عرض صفحة الكورس" : "View course page"}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {filteredChapters.map((chapter, sectionIndex) => {
            const sectionLessons = lessonsByChapter.get(chapter.id) || [];
            const sectionHasPreview = sectionLessons.some((lesson) => lesson.is_preview);
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
                      className={cn(
                        "inline-flex min-w-0 flex-1 items-center gap-2 text-start text-sm font-semibold hover:text-primary",
                        sectionHasPreview ? "text-[#5624d0]" : "text-[#2d2f31]",
                      )}
                      onClick={() => {
                        setEditingSectionId(chapter.id);
                        setSectionTitleDraft(chapter.title);
                      }}
                    >
                      <FileText className={cn("h-4 w-4 shrink-0", sectionHasPreview ? "text-[#5624d0]" : "text-[#6a6f73]")} />
                      <span className="truncate">{chapter.title}</span>
                      {sectionHasPreview && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#a435f0]/40 bg-[#a435f0]/10 px-2 py-0.5 text-[11px] font-bold text-[#5624d0]">
                          <Eye className="h-3 w-3" />
                          {locale === "ar" ? "بريفيو" : "Preview"}
                        </span>
                      )}
                    </button>
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {sectionLessons.length}{" "}
                    {locale === "ar" ? "محاضرة" : sectionLessons.length === 1 ? "lecture" : "lectures"}
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2d2f31]">
                    <input
                      type="checkbox"
                      checked={chapter.is_published}
                      onChange={() => void toggleSectionPublished(chapter)}
                    />
                    {locale === "ar" ? "منشور" : "Published"}
                  </label>
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
                      <div
                        key={lesson.id}
                        className="border border-[#d1d2e0] border-b-0 first:rounded-t-md last:rounded-b-md last:border-b"
                      >
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
                          <span
                            className={cn(
                              "rounded border px-2 py-0.5 text-[11px] font-semibold",
                              lesson.is_published
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                                : "border-border bg-muted text-muted-foreground",
                            )}
                          >
                            {lesson.is_published
                              ? locale === "ar"
                                ? "منشور"
                                : "Published"
                              : locale === "ar"
                                ? "مسودة"
                                : "Draft"}
                          </span>
                          {lesson.is_preview && (
                            <span className="rounded border border-[#a435f0]/30 bg-[#a435f0]/10 px-2 py-0.5 text-[11px] font-semibold text-[#5624d0]">
                              {locale === "ar" ? "بريفيو" : "Preview"}
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
                                <Label>
                                  {locale === "ar" ? "رابط الفيديو (يوتيوب أو درايف)" : "Video link (YouTube or Drive)"}
                                </Label>
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

                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                              <label className="inline-flex items-center gap-2 text-sm text-[#2d2f31]">
                                <input
                                  type="checkbox"
                                  checked={lessonDraft.is_published}
                                  onChange={(event) => updateDraft({ is_published: event.target.checked })}
                                />
                                {locale === "ar" ? "منشور (يظهر في صفحة الكورس)" : "Published (shows on course page)"}
                              </label>
                              <label className="inline-flex items-center gap-2 text-sm text-[#2d2f31]">
                                <input
                                  type="checkbox"
                                  checked={lessonDraft.is_preview}
                                  onChange={(event) => updateDraft({ is_preview: event.target.checked })}
                                />
                                {locale === "ar"
                                  ? "بريفيو مجاني (ظاهر لغير الطلاب)"
                                  : "Free preview (visible to non-students)"}
                              </label>
                            </div>

                            <LessonResourcesPanel lessonId={lesson.id} chapterId={chapter.id} />

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#d1d2e0] pt-3">
                              <Button type="button" variant="ghost" size="sm" onClick={() => void deleteLecture(lesson.id)}>
                                <Trash2 className="me-1 h-4 w-4 text-destructive" />
                                {t.admin.delete}
                              </Button>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={!lessonDirty || savingLesson}
                                  onClick={cancelLessonEdit}
                                >
                                  {t.admin.cancel}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={!lessonDirty || savingLesson}
                                  onClick={() => void saveLessonEdit()}
                                >
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
