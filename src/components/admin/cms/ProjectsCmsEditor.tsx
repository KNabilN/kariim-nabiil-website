import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultProjectsCms } from "@/lib/siteCmsDefaults";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function emptyProject(): Project {
  return {
    id: String(Date.now()),
    title: "",
    description: "",
    fullDescription: "",
    tools: [],
    domain: "",
    country: "",
    highlight: "",
    challenges: "",
    results: "",
    images: [],
  };
}

export default function ProjectsCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultProjectsCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("projects", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = draft[editLocale];
  const selected = list.find((p) => p.id === selectedId) || null;

  const setList = (next: Project[]) => setDraft({ ...draft, [editLocale]: next });
  const updateSelected = (patch: Partial<Project>) => {
    if (!selected) return;
    setList(list.map((p) => (p.id === selected.id ? { ...p, ...patch } : p)));
  };

  return (
    <CmsEditorChrome
      title={t.admin.navProjects}
      description={locale === "ar" ? "عدّل بطاقات المشاريع كما في صفحة المشاريع." : "Edit project cards as on the projects page."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <LocaleTabs value={editLocale} onChange={setEditLocale} />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            const next = emptyProject();
            setList([next, ...list]);
            setSelectedId(next.id);
          }}
        >
          <Plus className="me-1 h-4 w-4" />
          {t.admin.add}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          {list.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedId(project.id)}
              className={cn(
                "w-full rounded-md border bg-card p-5 text-start shadow-sm",
                selectedId === project.id ? "border-primary ring-2 ring-primary/20" : "border-border",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                {project.domain || "Domain"} · {project.country || "Country"}
              </p>
              <h3 className="mt-2 text-lg font-bold text-navy">{project.title || "Untitled project"}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.challenges || project.description}</p>
            </button>
          ))}
        </div>

        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
          {!selected ? (
            <p className="text-sm text-muted-foreground">{locale === "ar" ? "اختَر مشروعًا" : "Select a project"}</p>
          ) : (
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input className="mt-1" value={selected.title} onChange={(e) => updateSelected({ title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Domain</Label>
                  <Input className="mt-1" value={selected.domain} onChange={(e) => updateSelected({ domain: e.target.value })} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input className="mt-1" value={selected.country} onChange={(e) => updateSelected({ country: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Problem / challenges</Label>
                <Textarea className="mt-1" value={selected.challenges} onChange={(e) => updateSelected({ challenges: e.target.value })} />
              </div>
              <div>
                <Label>Approach / highlight</Label>
                <Textarea className="mt-1" value={selected.highlight} onChange={(e) => updateSelected({ highlight: e.target.value })} />
              </div>
              <div>
                <Label>Outcome / results</Label>
                <Textarea className="mt-1" value={selected.results} onChange={(e) => updateSelected({ results: e.target.value })} />
              </div>
              <div>
                <Label>Tools (comma separated)</Label>
                <Input
                  className="mt-1"
                  value={selected.tools.join(", ")}
                  onChange={(e) =>
                    updateSelected({
                      tools: e.target.value.split(",").map((x) => x.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (!window.confirm(t.admin.confirmDelete)) return;
                  setList(list.filter((p) => p.id !== selected.id));
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
