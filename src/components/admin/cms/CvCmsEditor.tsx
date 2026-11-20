import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CmsEditorChrome from "@/components/admin/cms/CmsEditorChrome";
import LocaleTabs from "@/components/admin/cms/LocaleTabs";
import { useCmsDraft } from "@/hooks/useCmsDraft";
import { defaultCvCms } from "@/lib/siteCmsDefaults";
import type { CvJob, CvSkill } from "@/data/cv";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function CvCmsEditor() {
  const { t, locale } = useLanguage();
  const defaults = useMemo(() => defaultCvCms(), []);
  const { draft, setDraft, loading, saving, dirty, save, cancel, resetDefaults } = useCmsDraft("cv", defaults);
  const [editLocale, setEditLocale] = useState<"en" | "ar">("en");
  const cv = draft[editLocale];

  const setCv = (next: typeof cv) => setDraft({ ...draft, [editLocale]: next });

  const updateJob = (index: number, patch: Partial<CvJob>) => {
    const experience = cv.experience.map((job, i) => (i === index ? { ...job, ...patch } : job));
    setCv({ ...cv, experience });
  };

  return (
    <CmsEditorChrome
      title={t.admin.navCv}
      description={locale === "ar" ? "عدّل السيرة كما تظهر في صفحة عني." : "Edit the CV as shown on the About page."}
      loading={loading}
      saving={saving}
      dirty={dirty}
      onSave={() => void save()}
      onCancel={cancel}
      onResetDefaults={resetDefaults}
    >
      <div className="mb-4">
        <LocaleTabs value={editLocale} onChange={setEditLocale} />
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <Label>Summary</Label>
          <Textarea className="mt-1 min-h-[120px]" value={cv.summary} onChange={(e) => setCv({ ...cv, summary: e.target.value })} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy">{t.about.experience}</h2>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                setCv({
                  ...cv,
                  experience: [
                    {
                      role: "",
                      org: "",
                      period: "",
                      location: "",
                      industry: "",
                      bullets: [""],
                    },
                    ...cv.experience,
                  ],
                })
              }
            >
              <Plus className="me-1 h-4 w-4" />
              {t.admin.add}
            </Button>
          </div>
          {cv.experience.map((job, index) => (
            <article key={`${job.org}-${index}`} className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Role</Label>
                  <Input className="mt-1" value={job.role} onChange={(e) => updateJob(index, { role: e.target.value })} />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input className="mt-1" value={job.org} onChange={(e) => updateJob(index, { org: e.target.value })} />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input className="mt-1" value={job.period} onChange={(e) => updateJob(index, { period: e.target.value })} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input className="mt-1" value={job.location} onChange={(e) => updateJob(index, { location: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Industry</Label>
                <Input className="mt-1" value={job.industry} onChange={(e) => updateJob(index, { industry: e.target.value })} />
              </div>
              <div>
                <Label>Bullets (one per line)</Label>
                <Textarea
                  className="mt-1"
                  value={job.bullets.join("\n")}
                  onChange={(e) =>
                    updateJob(index, {
                      bullets: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCv({ ...cv, experience: cv.experience.filter((_, i) => i !== index) })}
              >
                <Trash2 className="me-1 h-4 w-4 text-destructive" />
                {t.admin.delete}
              </Button>
            </article>
          ))}
        </section>

        {(
          [
            ["education", t.about.education],
            ["certifications", t.about.certifications],
            ["accomplishments", t.about.accomplishments],
            ["languages", t.about.languages],
          ] as const
        ).map(([key, label]) => (
          <section key={key} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Label>{label}</Label>
            <Textarea
              className="mt-1 min-h-[100px]"
              value={cv[key].join("\n")}
              onChange={(e) =>
                setCv({
                  ...cv,
                  [key]: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                })
              }
            />
          </section>
        ))}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy">{t.about.skills}</h2>
            <Button
              type="button"
              size="sm"
              onClick={() => setCv({ ...cv, skills: [...cv.skills, { title: "", items: "" } as CvSkill] })}
            >
              <Plus className="me-1 h-4 w-4" />
              {t.admin.add}
            </Button>
          </div>
          {cv.skills.map((skill, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_2fr_auto]">
              <div>
                <Label>Title</Label>
                <Input
                  className="mt-1"
                  value={skill.title}
                  onChange={(e) => {
                    const skills = cv.skills.map((s, i) => (i === index ? { ...s, title: e.target.value } : s));
                    setCv({ ...cv, skills });
                  }}
                />
              </div>
              <div>
                <Label>Items</Label>
                <Input
                  className="mt-1"
                  value={skill.items}
                  onChange={(e) => {
                    const skills = cv.skills.map((s, i) => (i === index ? { ...s, items: e.target.value } : s));
                    setCv({ ...cv, skills });
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="self-end"
                onClick={() => setCv({ ...cv, skills: cv.skills.filter((_, i) => i !== index) })}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </section>
      </div>
    </CmsEditorChrome>
  );
}
