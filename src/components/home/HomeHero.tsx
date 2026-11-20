import { Link } from "react-router-dom";
import { ArrowUpRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BRAND } from "@/lib/brand";
import portrait from "@/assets/karim-portrait.png";

export default function HomeHero() {
  const { t, locale } = useLanguage();
  const metrics =
    locale === "ar"
      ? [
          { value: "1M+", label: "مشاهدة على يوتيوب" },
          { value: "2×", label: "فائز NASA Space Apps" },
          { value: "Sr.", label: "مهندس ذكاء اصطناعي وكيل" },
        ]
      : [
          { value: "1M+", label: "YouTube course views" },
          { value: "2×", label: "NASA Space Apps winner" },
          { value: "Sr.", label: "Agentic AI Engineer" },
        ];

  return (
    <section className="relative overflow-hidden pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 tech-grid" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,hsl(217_91%_60%/0.18),transparent_68%)]" />

      <div className="section-container relative grid items-center gap-14 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-6">
        <div className="text-center lg:text-start">
          <p className="eyebrow justify-center lg:justify-start">{t.hero.eyebrow}</p>
          <h1 className="mt-6 text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5.1rem]">
            {t.hero.headline}
          </h1>
          <p className="mt-5 text-2xl font-medium tracking-tight text-gradient md:text-3xl">{t.hero.tagline}</p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg lg:mx-0">{t.hero.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button asChild variant="hero" size="lg">
              <Link to={BRAND.coursePath}>
                {t.hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <a href={BRAND.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4 w-4" />
                {t.hero.ctaSecondary}
              </a>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,hsl(189_94%_43%/0.12),transparent_65%)]" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#111827] shadow-[0_40px_120px_hsl(217_91%_40%/0.18)]">
            <img
              src={portrait}
              alt={`${BRAND.fullName} — Agentic AI Engineer`}
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080F1F]/90 via-[#080F1F]/35 to-transparent p-6 pt-24">
              <p className="text-sm font-semibold text-white">{BRAND.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan">{BRAND.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container relative pb-16">
        <div className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics.map((metric) => (
            <div key={metric.label} className="px-6 py-5 text-center sm:text-start">
              <p className="text-3xl font-semibold tracking-tight text-white">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
