import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultBrandCms } from "@/lib/siteCmsDefaults";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function BrandCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultBrandCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("brand", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const loc = draft[editLocale];

  const setLoc = (field: keyof typeof loc, value: string) => {
    setDraft({ ...draft, [editLocale]: { ...draft[editLocale], [field]: value } });
  };

  return (
    <CmsEditorChrome
      title={t.admin.navBrand}
      description={locale === "ar" ? "عدّل اسم العلامة والروابط كما تظهر في الهيدر والفوتر." : "Edit brand name and links as shown in header and footer."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-navy">{locale === "ar" ? "معاينة" : "Preview"}</h2>
            <LocaleTabs value={editLocale} onChange={setEditLocale} />
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <p className="text-lg font-extrabold text-navy">{loc.name}</p>
            <p className="text-sm font-semibold text-primary">{loc.specialty}</p>
            <p className="mt-2 text-sm text-muted-foreground">{loc.tagline}</p>
            <p className="mt-3 text-xs font-semibold text-navy">{loc.studentsLabel}</p>
            <p className="mt-2 text-xs text-muted-foreground">{loc.philosophy}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div>
            <Label>Name</Label>
            <Input className="mt-1" value={loc.name} onChange={(e) => setLoc("name", e.target.value)} />
          </div>
          <div>
            <Label>Full name</Label>
            <Input className="mt-1" value={loc.fullName} onChange={(e) => setLoc("fullName", e.target.value)} />
          </div>
          <div>
            <Label>Specialty</Label>
            <Input className="mt-1" value={loc.specialty} onChange={(e) => setLoc("specialty", e.target.value)} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input className="mt-1" value={loc.tagline} onChange={(e) => setLoc("tagline", e.target.value)} />
          </div>
          <div>
            <Label>Students label</Label>
            <Input className="mt-1" value={loc.studentsLabel} onChange={(e) => setLoc("studentsLabel", e.target.value)} />
          </div>
          <div>
            <Label>Philosophy</Label>
            <Input className="mt-1" value={loc.philosophy} onChange={(e) => setLoc("philosophy", e.target.value)} />
          </div>
          <div>
            <Label>YouTube</Label>
            <Input className="mt-1" value={draft.youtube} onChange={(e) => setDraft({ ...draft, youtube: e.target.value })} />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input className="mt-1" value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} />
          </div>
          <div>
            <Label>TikTok</Label>
            <Input className="mt-1" value={draft.tiktok} onChange={(e) => setDraft({ ...draft, tiktok: e.target.value })} />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input className="mt-1" value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} />
          </div>
          <div>
            <Label>WhatsApp URL</Label>
            <Input
              className="mt-1"
              value={draft.whatsappUrl}
              onChange={(e) => setDraft({ ...draft, whatsappUrl: e.target.value })}
              placeholder="https://wa.me/201132680858"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Use a phone link (wa.me/20…) so prefilled messages work. Message short links ignore draft text.
            </p>
          </div>
        </div>
      </div>
    </CmsEditorChrome>
  );
}
