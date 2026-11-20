import { ExternalLink } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/course-marketplace/CourseCard";
import { getCatalogCourses } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function ContentPage() {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);
  const courses = getCatalogCourses(locale);

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.pages.contentTitle} description={t.content.description} />
      <section className="section-shell">
        <div className="section-container space-y-8">
          <div className="flex flex-wrap gap-2">
            {t.content.categories.map((category) => (
              <span key={category} className="udemy-chip">
                {category}
              </span>
            ))}
          </div>

          <div>
            <h2 className="section-title">{t.content.coursesHeading}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-navy">{t.content.youtubeHeading}</h2>
            <p className="mt-2 text-muted-foreground">{t.content.youtubeBody}</p>
            <Button asChild variant="outline" className="mt-4">
              <a href={brand.youtube} target="_blank" rel="noopener noreferrer">
                {t.content.cta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
