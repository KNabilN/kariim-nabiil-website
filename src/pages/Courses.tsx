import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import CategoryChips from "@/components/course-marketplace/CategoryChips";
import CourseCard from "@/components/course-marketplace/CourseCard";
import { getCatalogCourses, getCourseCategories } from "@/data/courses";
import { useCmsBrand, useCmsCatalog } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function Courses() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: catalogCms } = useCmsCatalog(locale);
  const brand = brandCms || getBrand(locale);
  const catalog = catalogCms || getCatalogCourses(locale);
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const query = (params.get("q") || "").trim().toLowerCase();
  const categories = getCourseCategories(locale);
  const activeLabel = categories.find((item) => item.id === category)?.label || category;

  const courses = useMemo(() => {
    let list =
      !category || category === "All"
        ? catalog
        : catalog.filter((course) => course.categoryId === category || course.category === category);
    if (query) {
      list = list.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.highlights?.some((item) => item.toLowerCase().includes(query)),
      );
    }
    return list;
  }, [catalog, category, query]);

  const setCategory = (next: string) => {
    const updated = new URLSearchParams(params);
    if (next === "All") updated.delete("category");
    else updated.set("category", next);
    setParams(updated);
  };

  const resultWord = courses.length === 1 ? t.course.result : t.course.results;
  const resultSuffix = query
    ? ` ${t.course.forQuery} “${query}”`
    : category !== "All"
      ? ` ${t.course.inCategory} ${activeLabel}`
      : "";

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.pages.coursesTitle} description={t.course.catalogDescription} />
      <section className="section-shell">
        <div className="section-container space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-navy">
                {courses.length} {resultWord}
                {resultSuffix}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.course.catalogSubtitle}</p>
            </div>
          </div>

          <CategoryChips active={category} onChange={setCategory} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {courses.length === 0 && (
            <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              {t.course.noMatch}
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
