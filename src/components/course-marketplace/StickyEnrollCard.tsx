import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { CatalogCourse } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

interface StickyEnrollCardProps {
  course: CatalogCourse;
}

export default function StickyEnrollCard({ course }: StickyEnrollCardProps) {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);

  return (
    <aside className="overflow-hidden rounded-md border border-border bg-card shadow-lg">
      <div className="aspect-video overflow-hidden bg-secondary">
        <img src={course.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{course.level}</p>
          <p className="mt-1 text-sm text-muted-foreground">{course.language}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{brand.studentsLabel}</p>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link to="/enroll">{t.course.enrollNow}</Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link to="/course/learn">{t.nav.studentLogin}</Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <a href="#curriculum">{t.course.viewCurriculum}</a>
        </Button>
        <ul className="space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
          <li>
            {t.course.instructorLabel} {course.instructor}
          </li>
          <li>
            {t.course.categoryLabel} {course.category}
          </li>
          <li>{brand.philosophy}</li>
        </ul>
      </div>
    </aside>
  );
}
