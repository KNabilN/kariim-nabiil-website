import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultHomeCms } from "@/lib/siteCmsDefaults";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function HomeCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultHomeCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("home", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const stats = draft[editLocale].stats;

  const setStats = (next: typeof stats) => {
    setDraft({ ...draft, [editLocale]: { ...draft[editLocale], stats: next } });
  };

  return (
    <CmsEditorChrome
      title={t.admin.navHome}
      description={locale === "ar" ? "عدّل إحصائيات الهيرو كما تظهر في الصفحة الرئيسية." : "Edit hero stats as shown on the homepage."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <LocaleTabs value={editLocale} onChange={setEditLocale} />
          <Button
            type="button"
            size="sm"
            onClick={() => setStats([...stats, { value: "", label: "" }])}
          >
            <Plus className="me-1 h-4 w-4" />
            {t.admin.add}
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#1c1d1f] bg-[#1c1d1f] p-6 text-white">
          <p className="mb-4 text-sm text-white/60">{locale === "ar" ? "معاينة الهيرو" : "Hero preview"}</p>
          <div className="grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-lg font-bold">{stat.value || "—"}</p>
                <p className="text-xs text-white/60">{stat.label || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <Label>Value</Label>
                <Input
                  className="mt-1"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[index] = { ...stat, value: e.target.value };
                    setStats(next);
                  }}
                />
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  className="mt-1"
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...stats];
                    next[index] = { ...stat, label: e.target.value };
                    setStats(next);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="self-end"
                onClick={() => setStats(stats.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </CmsEditorChrome>
  );
}
