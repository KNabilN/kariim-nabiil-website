import { Link } from "react-router-dom";
import { ExternalLink, Play } from "lucide-react";
import type { CatalogCourse } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: CatalogCourse;
  className?: string;
}

export default function CourseCard({ course, className }: CourseCardProps) {
  const { t } = useLanguage();

  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img src={course.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        {course.free && (
          <span className="absolute start-2 top-2 rounded bg-[#1c1d1f] px-2 py-0.5 text-[11px] font-bold text-white">
            {t.course.free}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-navy group-hover:text-primary">{course.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{course.instructor}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {course.category}
          </span>
          {course.free ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-white">
              <Play className="h-3 w-3 fill-current" />
              {t.course.watchNow}
            </span>
          ) : course.external ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
              {t.course.open} <ExternalLink className="h-3 w-3" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">{t.course.viewCourse}</span>
          )}
        </div>
      </div>
    </>
  );

  const classes = cn(
    "group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
    className,
  );

  if (course.external) {
    return (
      <a href={course.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link to={course.href} className={classes}>
      {content}
    </Link>
  );
}
