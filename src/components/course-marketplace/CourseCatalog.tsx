import { useMemo, useState } from "react";
import { filterCourses, getCatalogCourses } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import CategoryChips from "./CategoryChips";
import CourseCard from "./CourseCard";

interface CourseCatalogProps {
  initialCategory?: string;
  showFilters?: boolean;
  title?: string;
  description?: string;
}

export default function CourseCatalog({
  initialCategory = "All",
  showFilters = true,
  title,
  description,
}: CourseCatalogProps) {
  const { t, locale } = useLanguage();
  const [category, setCategory] = useState(initialCategory);
  const courses = useMemo(() => filterCourses(category, locale), [category, locale]);
  const heading = title || t.pages.coursesTitle;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">{heading}</h2>
        {description && <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>}
        <p className="mt-2 text-sm text-muted-foreground">
          {courses.length} {courses.length === 1 ? t.course.result : t.course.results}
          {category !== "All" ? ` ${t.course.inCategory} ${category}` : ""}
        </p>
      </div>
      {showFilters && <CategoryChips active={category} onChange={setCategory} />}
      {courses.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          {t.course.noMatch}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {getCatalogCourses(locale).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
