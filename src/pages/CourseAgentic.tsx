import CourseCurriculum from "@/components/course-marketplace/CourseCurriculum";
import CourseReviews from "@/components/course-marketplace/CourseReviews";
import StickyEnrollCard from "@/components/course-marketplace/StickyEnrollCard";
import WhatYouLearn from "@/components/course-marketplace/WhatYouLearn";
import { getCourseById } from "@/data/courses";
import { usePublicCourseCurriculum } from "@/hooks/usePublicCourseCurriculum";
import { useCmsBrand, useCmsCatalog } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

const COURSE_SLUG = "agentic-ai-engineering";

export default function CourseAgentic() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: catalogCms } = useCmsCatalog(locale);
  const { data: curriculum } = usePublicCourseCurriculum(COURSE_SLUG, locale);
  const brand = brandCms || getBrand(locale);
  const staticCourse = getCourseById(COURSE_SLUG, locale);
  const catalogCourse = catalogCms?.find((item) => item.id === COURSE_SLUG) || staticCourse;

  if (!catalogCourse) return null;

  const modules = curriculum?.modules?.length ? curriculum.modules : catalogCourse.modules || [];
  const course = {
    ...catalogCourse,
    price: curriculum?.price ?? catalogCourse.price,
    currency: curriculum?.currency || catalogCourse.currency || "EGP",
  };

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
                {t.course.priceInEgypt}: {course.price.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")}{" "}
                {course.currency || "EGP"}
              </span>
            )}
            {typeof course.priceIntl === "number" && course.priceIntl > 0 && (
              <span className="font-bold text-white">
                {t.course.priceOutsideEgypt}: {course.priceIntl.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}{" "}
                {course.currencyIntl || "USD"}
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

          {modules.length > 0 && <CourseCurriculum modules={modules} />}

          <CourseReviews />
        </div>
      </div>

      <aside className="sticky top-24 z-20 hidden self-start pt-10 lg:block">
        <StickyEnrollCard course={course} />
      </aside>
    </div>
  );
}
