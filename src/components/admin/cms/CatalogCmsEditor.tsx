import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultCatalogCms } from "@/lib/siteCmsDefaults";
import { uploadSiteMedia } from "@/lib/siteCms";
import { getCatalogCourses, courseCategoryMeta } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CatalogItem = ReturnType<typeof defaultCatalogCms>[number];

function emptyCourse(): CatalogItem {
  return {
    id: `course-${Date.now()}`,
    categoryId: "Agentic AI",
    href: "/courses",
    external: false,
    free: false,
    featured: false,
    imageUrl: "",
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    level: { en: "Beginner", ar: "مبتدئ" },
    highlights: { en: [], ar: [] },
    learnings: { en: [], ar: [] },
    modules: { en: [], ar: [] },
  };
}

export default function CatalogCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultCatalogCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("catalog", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const selected = draft.find((item) => item.id === selectedId) || null;
  const previewCourses = useMemo(() => {
    const staticCourses = getCatalogCourses(locale);
    return draft.map((item) => {
      const fallback = staticCourses.find((c) => c.id === item.id);
      return {
        ...item,
        previewImage: item.imageUrl || fallback?.image || "",
        previewTitle: item.title[locale] || item.title.en,
        previewDescription: item.description[locale] || item.description.en,
        previewLevel: item.level[locale] || item.level.en,
        previewCategory: courseCategoryMeta.find((c) => c.id === item.categoryId)?.[locale] || item.categoryId,
      };
    });
  }, [draft, locale]);

  const updateSelected = (patch: Partial<CatalogItem>) => {
    if (!selectedId) return;
    setDraft(draft.map((item) => (item.id === selectedId ? { ...item, ...patch } : item)));
  };

  const updateLocalized = (field: "title" | "description" | "level", value: string) => {
    if (!selected) return;
    updateSelected({ [field]: { ...selected[field], [editLocale]: value } } as Partial<CatalogItem>);
  };

  const updateListField = (field: "highlights" | "learnings", value: string) => {
    if (!selected) return;
    const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
    updateSelected({ [field]: { ...selected[field], [editLocale]: lines } } as Partial<CatalogItem>);
  };

  const onUpload = async (file: File | undefined) => {
    if (!file || !selected) return;
    setUploading(true);
    try {
      const url = await uploadSiteMedia(file, "catalog");
      updateSelected({ imageUrl: url });
      toast({ title: "Image uploaded" });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : String(error), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <CmsEditorChrome
      title={t.admin.navCatalog}
      description={locale === "ar" ? "عدّل كروت الدورات كما تظهر في الموقع، ثم احفظ أو ألغِ." : "Edit course cards as they appear on the site, then save or cancel."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-navy">{locale === "ar" ? "معاينة الكتالوج" : "Catalog preview"}</h2>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const next = emptyCourse();
                setDraft([...draft, next]);
                setSelectedId(next.id);
              }}
            >
              <Plus className="me-1 h-4 w-4" />
              {t.admin.add}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {previewCourses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedId(course.id)}
                className={cn(
                  "overflow-hidden rounded-md border bg-card text-start shadow-sm transition-shadow hover:shadow-md",
                  selectedId === course.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                )}
              >
                <div className="relative aspect-video bg-secondary">
                  {course.previewImage ? (
                    <img src={course.previewImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                  {course.free && (
                    <span className="absolute start-2 top-2 rounded bg-[#1c1d1f] px-2 py-0.5 text-[11px] font-bold text-white">
                      {t.course.free}
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <h3 className="line-clamp-2 text-sm font-bold text-navy">{course.previewTitle || "Untitled"}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{course.previewDescription}</p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {course.previewCategory}
                    </span>
                    <span className="text-[11px] font-bold text-primary">{course.previewLevel}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
          {!selected ? (
            <p className="text-sm text-muted-foreground">{locale === "ar" ? "اختَر كورس للتعديل" : "Select a course to edit"}</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-navy">{t.admin.edit}</h3>
                <LocaleTabs value={editLocale} onChange={setEditLocale} />
              </div>

              <div>
                <Label>ID</Label>
                <Input value={selected.id} onChange={(e) => updateSelected({ id: e.target.value })} className="mt-1 font-mono text-xs" />
              </div>

              <div>
                <Label>{editLocale === "ar" ? "العنوان" : "Title"}</Label>
                <Input value={selected.title[editLocale]} onChange={(e) => updateLocalized("title", e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label>{editLocale === "ar" ? "الوصف" : "Description"}</Label>
                <Textarea value={selected.description[editLocale]} onChange={(e) => updateLocalized("description", e.target.value)} className="mt-1 min-h-[100px]" />
              </div>

              <div>
                <Label>{editLocale === "ar" ? "المستوى" : "Level"}</Label>
                <Input value={selected.level[editLocale]} onChange={(e) => updateLocalized("level", e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label>Category</Label>
                <select
                  value={selected.categoryId}
                  onChange={(e) => updateSelected({ categoryId: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {courseCategoryMeta.filter((c) => c.id !== "All").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c[editLocale]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Link (href)</Label>
                <Input value={selected.href} onChange={(e) => updateSelected({ href: e.target.value })} className="mt-1" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <input type="checkbox" checked={!!selected.free} onChange={(e) => updateSelected({ free: e.target.checked })} />
                  Free
                </label>
                <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <input type="checkbox" checked={!!selected.featured} onChange={(e) => updateSelected({ featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <input type="checkbox" checked={!!selected.external} onChange={(e) => updateSelected({ external: e.target.checked })} />
                  External
                </label>
              </div>

              <div>
                <Label>Image</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={selected.imageUrl} onChange={(e) => updateSelected({ imageUrl: e.target.value })} placeholder="URL or upload" />
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => void onUpload(e.target.files?.[0])} />
                    </label>
                  </Button>
                </div>
              </div>

              <div>
                <Label>{editLocale === "ar" ? "النقاط (سطر لكل نقطة)" : "Highlights (one per line)"}</Label>
                <Textarea
                  value={(selected.highlights[editLocale] || []).join("\n")}
                  onChange={(e) => updateListField("highlights", e.target.value)}
                  className="mt-1 min-h-[90px]"
                />
              </div>

              <div>
                <Label>{editLocale === "ar" ? "ماذا ستتعلم" : "Learnings (one per line)"}</Label>
                <Textarea
                  value={(selected.learnings[editLocale] || []).join("\n")}
                  onChange={(e) => updateListField("learnings", e.target.value)}
                  className="mt-1 min-h-[90px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {selected.href && (
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={selected.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="me-1 h-4 w-4" /> Preview
                    </a>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    if (!window.confirm(t.admin.confirmDelete)) return;
                    setDraft(draft.filter((item) => item.id !== selected.id));
                    setSelectedId(null);
                  }}
                >
                  <Trash2 className="me-1 h-4 w-4" />
                  {t.admin.delete}
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </CmsEditorChrome>
  );
}
