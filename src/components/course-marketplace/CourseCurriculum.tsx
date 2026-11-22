import { useMemo, useState } from "react";
import { CheckCircle2, Eye, FileText, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CourseModule } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getVideoEmbedUrl } from "@/lib/videoUrl";

interface CourseCurriculumProps {
  modules: CourseModule[];
}

export default function CourseCurriculum({ modules }: CourseCurriculumProps) {
  const { t, locale } = useLanguage();
  const [preview, setPreview] = useState<{ title: string; embedUrl: string } | null>(null);

  const sections = useMemo(() => {
    let lectureCounter = 0;
    return modules.map((module) => {
      const lectures = module.lectures || [];
      const startLecture = lectureCounter + 1;
      lectureCounter += lectures.length;
      return { module, lectures, startLecture };
    });
  }, [modules]);

  const lectureCount = sections.reduce((sum, section) => sum + section.lectures.length, 0);
  const sectionLabel = locale === "ar" ? "القسم" : "Section";
  const lectureLabel = locale === "ar" ? "محاضرة" : "Lecture";
  const previewLabel = locale === "ar" ? "معاينة مفعّلة" : "Preview enabled";
  const previewCta = locale === "ar" ? "معاينة" : "Preview";
  const lecturesWord = locale === "ar" ? "محاضرة" : lectureCount === 1 ? "lecture" : "lectures";

  return (
    <section id="curriculum" className="rounded-md border border-border bg-card p-6 md:p-8">
      <h2 className="text-xl font-bold text-navy md:text-2xl">{t.course.courseContent}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {modules.length} {t.course.sections} · {lectureCount} {lecturesWord}
      </p>

      <Accordion type="multiple" defaultValue={sections.slice(0, 2).map((_, i) => `section-${i}`)} className="mt-5 space-y-3">
        {sections.map(({ module, lectures, startLecture }, sectionIndex) => {
          const sectionHasPreview = lectures.some((lecture) => lecture.preview);
          return (
          <AccordionItem
            key={`${module.title}-${sectionIndex}`}
            value={`section-${sectionIndex}`}
            className="overflow-hidden rounded-lg border border-[#d1d2e0] bg-[#f7f9fa] px-0"
          >
            <AccordionTrigger className="px-4 py-3 text-start hover:no-underline">
              <span className="flex min-w-0 flex-1 items-center gap-2 pe-2">
                <span className="text-sm font-bold text-[#2d2f31]">
                  {sectionLabel} {sectionIndex + 1}:
                </span>
                <FileText
                  className={`h-4 w-4 shrink-0 ${sectionHasPreview ? "text-[#5624d0]" : "text-[#6a6f73]"}`}
                />
                <span
                  className={`truncate text-sm font-semibold ${
                    sectionHasPreview ? "text-[#5624d0]" : "text-[#2d2f31]"
                  }`}
                >
                  {module.title}
                </span>
                {sectionHasPreview && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#a435f0]/40 bg-[#a435f0]/10 px-2 py-0.5 text-[11px] font-bold text-[#5624d0]">
                    <Eye className="h-3 w-3" />
                    {previewCta}
                  </span>
                )}
                <span className="ms-auto hidden shrink-0 text-xs font-medium text-muted-foreground sm:inline">
                  {lectures.length} {locale === "ar" ? "محاضرة" : lectures.length === 1 ? "lecture" : "lectures"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="border-t border-[#d1d2e0] bg-white px-0 pb-0">
              {module.body && !lectures.length ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">{module.body}</p>
              ) : null}
              <ul className="divide-y divide-[#d1d2e0]">
                {lectures.map((lecture, lectureIndex) => {
                  const number = startLecture + lectureIndex;
                  const embedUrl = lecture.preview && lecture.videoUrl ? getVideoEmbedUrl(lecture.videoUrl) : null;
                  return (
                    <li key={`${lecture.title}-${number}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1e6055]" />
                      <span className="text-sm font-semibold text-[#2d2f31]">
                        {lectureLabel} {number}:
                      </span>
                      <PlayCircle className="h-4 w-4 shrink-0 text-[#6a6f73]" />
                      <span className="min-w-0 flex-1 text-sm text-[#2d2f31]">{lecture.title}</span>
                      {lecture.preview && (
                        <span className="rounded border border-[#a435f0]/30 bg-[#a435f0]/10 px-2 py-0.5 text-[11px] font-semibold text-[#5624d0]">
                          {previewLabel}
                        </span>
                      )}
                      {embedUrl && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#a435f0] text-[#5624d0] hover:bg-[#a435f0]/10"
                          onClick={() => setPreview({ title: lecture.title, embedUrl })}
                        >
                          {previewCta}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0 sm:rounded-lg">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>{preview?.title}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="aspect-video w-full bg-black">
              <iframe
                title={preview.title}
                src={preview.embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
