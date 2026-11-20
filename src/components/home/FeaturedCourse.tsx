import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCatalogCourses } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import studio from "@/assets/karim-studio.jpg";

export default function FeaturedCourse() {
  const { t, locale } = useLanguage();
  const courses = getCatalogCourses(locale);
  const agentic = courses[0];
  const sales = courses[1];

  if (!agentic) return null;

  return (
    <section className="section-shell">
      <div className="section-container">
        <p className="eyebrow">02</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title max-w-3xl">{t.featuredCourse.heading}</h2>
          <p className="max-w-sm text-sm leading-6 text-slate-400">{t.featuredCourse.philosophy}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1628]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 md:p-12">
              <p className="text-sm font-medium text-cyan">{agentic.category}</p>
              <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white md:text-4xl">{agentic.title}</h3>
              <p className="mt-4 max-w-xl text-slate-400">{agentic.description}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {agentic.highlights?.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                    <Check className="h-4 w-4 text-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to={agentic.href}>
                    {t.featuredCourse.ctaPrimary}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={`${agentic.href}#curriculum`}>{t.featuredCourse.ctaSecondary}</Link>
                </Button>
              </div>
            </div>
            <div className="relative min-h-[320px]">
              <img src={studio} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080F1F] via-[#080F1F]/55 to-[#2563EB]/25" />
              <div className="absolute bottom-0 p-8">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan">{t.featuredCourse.subtitle}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{t.featuredCourse.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {sales && (
          <a
            href={sales.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 flex flex-col justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.03] px-6 py-5 transition-colors hover:border-cyan/40 md:flex-row md:items-center md:px-8"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{sales.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{sales.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">{sales.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
              {t.course.open}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
