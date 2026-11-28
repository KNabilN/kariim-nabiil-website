import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { interleaveNamedAndAnonymous, type CourseReview } from "@/data/courseReviews";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { defaultCourseReviewsCms } from "@/lib/siteCmsDefaults";
import { cn } from "@/lib/utils";

type ReviewDraft = ReturnType<typeof defaultCourseReviewsCms>[number];

export default function CourseReviewsCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultCourseReviewsCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft(
    "course_reviews",
    defaults,
  );
  const [selectedId, setSelectedId] = useState<string | null>(draft[0]?.id ?? null);
  const [quoteErrorId, setQuoteErrorId] = useState<string | null>(null);
  const selected = draft.find((item) => item.id === selectedId) || null;

  const updateSelected = (patch: Partial<ReviewDraft>) => {
    if (!selected) return;
    setDraft(draft.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  };

  const moveSelected = (direction: -1 | 1) => {
    if (!selected) return;
    const index = draft.findIndex((item) => item.id === selected.id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= draft.length) return;
    const next = [...draft];
    const [row] = next.splice(index, 1);
    next.splice(nextIndex, 0, row);
    setDraft(next);
  };

  const addReview = () => {
    const next: CourseReview = {
      id: `review-${Date.now()}`,
      name: null,
      quote: "",
      lang: locale === "ar" ? "ar" : "en",
    };
    setDraft([...draft, next]);
    setSelectedId(next.id);
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!window.confirm(t.admin.confirmDelete)) return;
    const next = draft.filter((item) => item.id !== selected.id);
    setDraft(next);
    setSelectedId(next[0]?.id ?? null);
    if (quoteErrorId === selected.id) setQuoteErrorId(null);
  };

  const handleSave = async () => {
    const empty = draft.find((item) => !item.quote.trim());
    if (empty) {
      setSelectedId(empty.id);
      setQuoteErrorId(empty.id);
      toast({
        title: locale === "ar" ? "نص الرأي مطلوب" : "Review text is required",
        description:
          locale === "ar"
            ? "مش هينفع تحفظ رأي من غير نص التعليق. اكتب التعليق أو احذف الرأي الفاضي."
            : "You can't save a review with empty text. Add the comment or delete the empty review.",
        variant: "destructive",
      });
      return;
    }
    setQuoteErrorId(null);
    await save();
  };

  return (
    <CmsEditorChrome
      title={t.admin.navCourseReviews}
      description={
        locale === "ar"
          ? "عدّل آراء الطلاب الظاهرة في صفحة كورس Agentic AI Engineering. رتّب الأسماء والمجهولين بالتبادل للعرض الأفضل."
          : "Edit student reviews shown on the Agentic AI Engineering course page. Alternate named and anonymous entries for a better carousel mix."
      }
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void handleSave()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDraft(interleaveNamedAndAnonymous(draft))}
        >
          {locale === "ar" ? "تبديل الأسماء/المجهولين" : "Mix named / anonymous"}
        </Button>
        <Button type="button" size="sm" onClick={addReview}>
          <Plus className="me-1 h-4 w-4" />
          {t.admin.add}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-2">
          {draft.length === 0 ? (
            <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
              {t.admin.empty}
            </p>
          ) : (
            draft.map((item, index) => {
              const label = item.name?.trim() || t.course.anonymousStudent;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "w-full rounded-md border bg-card p-3 text-start shadow-sm transition-colors",
                    selectedId === item.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                    !item.quote.trim() && "border-destructive/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        #{index + 1} · {item.lang.toUpperCase()}
                        {!item.name?.trim() ? ` · ${t.course.anonymousStudent}` : ""}
                        {!item.quote.trim()
                          ? ` · ${locale === "ar" ? "نص فاضي" : "Empty text"}`
                          : ""}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-navy">{label}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground" dir="auto">
                        {item.quote || "—"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          {!selected ? (
            <p className="text-sm text-muted-foreground">{t.admin.empty}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => moveSelected(-1)}>
                  <ArrowUp className="me-1 h-4 w-4" />
                  {locale === "ar" ? "أعلى" : "Up"}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => moveSelected(1)}>
                  <ArrowDown className="me-1 h-4 w-4" />
                  {locale === "ar" ? "أسفل" : "Down"}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={deleteSelected}>
                  <Trash2 className="me-1 h-4 w-4" />
                  {t.admin.delete}
                </Button>
              </div>

              <div>
                <Label htmlFor="review-name">
                  {locale === "ar" ? "الاسم (اختياري)" : "Name (optional)"}
                </Label>
                <Input
                  id="review-name"
                  className="mt-1.5"
                  value={selected.name || ""}
                  placeholder={t.course.anonymousStudent}
                  onChange={(e) => updateSelected({ name: e.target.value || null })}
                />
              </div>

              <div>
                <Label htmlFor="review-lang">{locale === "ar" ? "لغة الرأي" : "Review language"}</Label>
                <select
                  id="review-lang"
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selected.lang}
                  onChange={(e) => updateSelected({ lang: e.target.value === "en" ? "en" : "ar" })}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <Label htmlFor="review-quote">
                  {locale === "ar" ? "نص الرأي" : "Review text"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review-quote"
                  required
                  aria-invalid={quoteErrorId === selected.id}
                  className={cn(
                    "mt-1.5 min-h-[180px]",
                    quoteErrorId === selected.id && "border-destructive focus-visible:ring-destructive",
                  )}
                  dir={selected.lang === "ar" ? "rtl" : "ltr"}
                  value={selected.quote}
                  onChange={(e) => {
                    updateSelected({ quote: e.target.value });
                    if (e.target.value.trim()) setQuoteErrorId(null);
                  }}
                />
                {quoteErrorId === selected.id && !selected.quote.trim() && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {locale === "ar"
                      ? "نص التعليق مطلوب — مش هينفع تحفظ الرأي وهو فاضي."
                      : "Review text is required — you can't save an empty comment."}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CmsEditorChrome>
  );
}
