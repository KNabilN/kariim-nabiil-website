import { useMemo, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultGalleryCms } from "@/lib/siteCmsDefaults";
import { uploadSiteMedia } from "@/lib/siteCms";
import { galleryItems } from "@/data/gallery";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type GalleryDraftItem = ReturnType<typeof defaultGalleryCms>[number];

export default function GalleryCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultGalleryCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("gallery", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const selected = draft.find((item) => item.id === selectedId) || null;

  const previewSrc = (item: GalleryDraftItem) => {
    if (item.imageUrl) return item.imageUrl;
    const fallback = galleryItems.find((g) => g.id === item.id);
    return item.src || fallback?.src || "";
  };

  const updateSelected = (patch: Partial<GalleryDraftItem>) => {
    if (!selected) return;
    setDraft(draft.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)));
  };

  const onUpload = async (file?: File) => {
    if (!file || !selected) return;
    setUploading(true);
    try {
      const url = await uploadSiteMedia(file, "gallery");
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
      title={t.admin.navGallery}
      description={locale === "ar" ? "عدّل شرائح المعرض كما في السلايدر." : "Edit gallery slides as in the homepage slider."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="mb-4 flex items-center justify-between">
        <LocaleTabs value={editLocale} onChange={setEditLocale} />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            const next: GalleryDraftItem = {
              id: `slide-${Date.now()}`,
              src: "",
              imageUrl: "",
              order: draft.length,
              objectPosition: "",
              alt: { en: "", ar: "" },
              caption: { en: "", ar: "" },
              tag: { en: "", ar: "" },
            };
            setDraft([...draft, next]);
            setSelectedId(next.id);
          }}
        >
          <Plus className="me-1 h-4 w-4" />
          {t.admin.add}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...draft]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "overflow-hidden rounded-md border bg-card text-start shadow-sm",
                  selectedId === item.id ? "border-primary ring-2 ring-primary/20" : "border-border",
                )}
              >
                <div className="aspect-[4/3] bg-secondary">
                  {previewSrc(item) ? (
                    <img
                      src={previewSrc(item)}
                      alt=""
                      className="h-full w-full object-cover"
                      style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    {item.tag[editLocale] || item.tag.en || "Tag"}
                  </p>
                  <p className="text-sm font-semibold text-navy">{item.caption[editLocale] || item.caption.en || "Caption"}</p>
                </div>
              </button>
            ))}
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
          {!selected ? (
            <p className="text-sm text-muted-foreground">{locale === "ar" ? "اختَر شريحة" : "Select a slide"}</p>
          ) : (
            <div className="space-y-3">
              <div>
                <Label>Tag</Label>
                <Input
                  className="mt-1"
                  value={selected.tag[editLocale]}
                  onChange={(e) => updateSelected({ tag: { ...selected.tag, [editLocale]: e.target.value } })}
                />
              </div>
              <div>
                <Label>Caption</Label>
                <Input
                  className="mt-1"
                  value={selected.caption[editLocale]}
                  onChange={(e) => updateSelected({ caption: { ...selected.caption, [editLocale]: e.target.value } })}
                />
              </div>
              <div>
                <Label>Alt text</Label>
                <Input
                  className="mt-1"
                  value={selected.alt[editLocale]}
                  onChange={(e) => updateSelected({ alt: { ...selected.alt, [editLocale]: e.target.value } })}
                />
              </div>
              <div>
                <Label>Object position (e.g. 78% 18%)</Label>
                <Input className="mt-1" value={selected.objectPosition} onChange={(e) => updateSelected({ objectPosition: e.target.value })} />
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={selected.order}
                  onChange={(e) => updateSelected({ order: Number(e.target.value) || 0 })}
                />
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
              <Button
                type="button"
                variant="destructive"
                size="sm"
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
          )}
        </aside>
      </div>
    </CmsEditorChrome>
  );
}
