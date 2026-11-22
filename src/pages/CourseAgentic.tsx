import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import StickyEnrollCard from "@/components/course-marketplace/StickyEnrollCard";
import WhatYouLearn from "@/components/course-marketplace/WhatYouLearn";
import { getCourseById } from "@/data/courses";
import { getCv } from "@/data/cv";
import { portraits } from "@/data/gallery";
import { useCmsBrand, useCmsCatalog, useCmsCv } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function CourseAgentic() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: cvCms } = useCmsCv(locale);
  const { data: catalogCms } = useCmsCatalog(locale);
  const brand = brandCms || getBrand(locale);
  const cv = cvCms || getCv(locale);
  const course =
    catalogCms?.find((item) => item.id === "agentic-ai-engineering") ||
    getCourseById("agentic-ai-engineering", locale);

  if (!course) return null;

  return (
    <div className="section-container grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <header className="relative isolate py-10 text-white md:py-12">
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[#1c1d1f]"
          />
          <p className="text-sm font-semibold text-blue-300">{course.category}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{course.title}</h1>
          <p className="mt-4 text-base leading-7 text-white/80 md:text-lg">{course.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
            <span>
              {t.course.createdBy} <span className="font-semibold text-blue-300">{course.instructor}</span>
            </span>
            <span>{course.level}</span>
            <span>{course.language}</span>
            <span className="font-semibold text-white">{brand.studentsLabel}</span>
            {typeof course.price === "number" && course.price > 0 && (
              <span className="font-bold text-white">
                {course.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")} {course.currency || "EGP"}
              </span>
            )}
          </div>
          <p className="mt-4 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-200">
            {t.course.studentDiscountBadge}
          </p>
          <p className="mt-4 text-sm font-medium text-white/85">{brand.philosophy}</p>
        </header>

        <div className="space-y-8 py-10">
          <div className="lg:hidden">
            <StickyEnrollCard course={course} />
          </div>

          {course.learnings && <WhatYouLearn items={course.learnings} />}

          <section id="curriculum" className="rounded-md border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-navy md:text-2xl">{t.course.courseContent}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {course.modules?.length || 0} {t.course.modules}
            </p>
            <Accordion type="single" collapsible className="mt-4">
              {(course.modules || []).map((module, index) => (
                <AccordionItem key={module.title} value={`module-${index}`}>
                  <AccordionTrigger className="text-start text-base font-semibold">{module.title}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{module.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="rounded-md border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-navy md:text-2xl">{t.course.instructor}</h2>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
              <img src={portraits.suit} alt={brand.fullName} className="h-24 w-24 rounded-full object-cover object-top" />
              <div>
                <h3 className="text-lg font-bold text-navy">{brand.fullName}</h3>
                <p className="text-sm text-primary">{brand.specialty}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{cv.summary}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/about">{t.course.moreAboutMe}</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={brand.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <aside className="sticky top-24 z-20 hidden self-start pt-10 lg:block">
        <StickyEnrollCard course={course} />
      </aside>
    </div>
  );
}
