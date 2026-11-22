import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import PresenceGallery from "@/components/brand/PresenceGallery";
import TikTokIcon from "@/components/brand/TikTokIcon";
import CourseCard from "@/components/course-marketplace/CourseCard";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { portraits } from "@/data/gallery";
import { useCmsBrand, useCmsCatalog, useCmsCv, useCmsHome } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";
import { getCv } from "@/data/cv";
import { getCatalogCourses } from "@/data/courses";
import nasaSpaceApps from "@/assets/gallery/nasa-space-apps.jpg";
import webSummit from "@/assets/gallery/web-summit-qatar.jpg";
import arabYouthAward from "@/assets/gallery/arab-youth-award.jpg";
import speakingStage from "@/assets/gallery/speaking-stage.jpg";

const BIO_PREVIEW_LENGTH = 260;

export default function Index() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: homeCms } = useCmsHome(locale);
  const { data: cvCms } = useCmsCv(locale);
  const { data: coursesCms } = useCmsCatalog(locale);
  const brand = brandCms || getBrand(locale);
  const cv = cvCms || getCv(locale);
  const courses = coursesCms || getCatalogCourses(locale);
  const experiencePreview = cv.experience.slice(0, 3);
  const heroStats = homeCms?.stats;
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioNeedsTruncate = cv.summary.length > BIO_PREVIEW_LENGTH;
  const bioText =
    bioExpanded || !bioNeedsTruncate ? cv.summary : `${cv.summary.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <>
      <section className="border-b border-border bg-[#1c1d1f] text-white">
        <div className="section-container grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-300">{t.hero.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">{t.hero.headline}</h1>
            <p className="mt-3 text-xl font-semibold text-blue-300">{t.hero.tagline}</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/75 md:text-lg">{t.hero.description}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
                <Link to="/courses">{t.hero.ctaPrimary}</Link>
              </Button>
              <a
                href={brand.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={brand.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={brand.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center sm:text-start">
              {(heroStats || [
                { value: "1M+", label: t.hero.statViews },
                { value: "2×", label: t.hero.statNasa },
                { value: locale === "ar" ? "أول" : "Sr.", label: t.hero.statRole },
              ]).map((stat) => (
                <div key={`${stat.value}-${stat.label}`}>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-md border border-white/10 shadow-2xl">
                <img src={nasaSpaceApps} alt={`${brand.name} at NASA Space Apps`} className="aspect-[3/4] h-full w-full object-cover" />
              </div>
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-md border border-white/10">
                  <img src={webSummit} alt={`${brand.name} at Web Summit Qatar`} className="aspect-[4/3] w-full object-cover object-top" />
                </div>
                <div className="overflow-hidden rounded-md border border-white/10">
                  <img src={arabYouthAward} alt={`${brand.name} receiving recognition`} className="aspect-[4/3] w-full object-cover" />
                </div>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-md border border-white/10">
              <img src={speakingStage} alt={`${brand.name} speaking on stage`} className="aspect-[21/9] w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-card">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">{t.home.experienceTitle}</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">{t.home.experienceSubtitle}</p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              {t.home.experienceCta} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {experiencePreview.map((job) => (
              <article key={`${job.org}-${job.role}`} className="rounded-md border border-border bg-background p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{job.period}</p>
                <h3 className="mt-2 text-lg font-bold text-navy">{job.role}</h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{job.org}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{job.bullets[0]}</p>
              </article>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {cv.accomplishments.slice(0, 3).map((item) => (
              <li key={item} className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PresenceGallery compact />

      <section className="section-shell">
        <div className="section-container">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">{t.home.featuredCoursesTitle}</h2>
              <p className="mt-2 text-muted-foreground">{t.home.featuredCoursesSubtitle}</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              {t.home.viewAllCourses} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-container flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="mx-auto shrink-0 text-center sm:mx-0 sm:text-start">
            <img
              src={portraits.suit}
              alt={brand.fullName}
              className="mx-auto h-36 w-36 rounded-full border border-border object-cover object-top shadow-sm sm:mx-0"
            />
            <p className="mt-2 text-xs font-semibold text-primary">
              {locale === "ar" ? "تمثيل دولي، روسيا" : "International representation, Russia"}
            </p>
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-start">
            <p className="eyebrow justify-center sm:justify-start">{t.home.instructorEyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold text-navy md:text-3xl">{t.aboutPreview.heading}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {bioText}
              {bioNeedsTruncate && (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => setBioExpanded((open) => !open)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {bioExpanded ? t.aboutPreview.showLess : t.aboutPreview.readMore}
                  </button>
                </>
              )}
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">{brand.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Button asChild size="sm">
                <Link to="/about">{t.aboutPreview.cta}</Link>
              </Button>
              <a
                href={brand.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-[#0A66C2] transition-colors hover:bg-secondary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={brand.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-[#FF0000] transition-colors hover:bg-secondary"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={brand.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-[#E4405F] transition-colors hover:bg-secondary"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell border-t border-border bg-card">
        <div className="section-container grid items-start gap-8 lg:grid-cols-2">
          <div>
            <h2 className="section-title">{t.home.contactTitle}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{t.home.contactSubtitle}</p>
            <Button asChild className="mt-5" size="lg">
              <Link to="/enroll">{t.home.orEnroll}</Link>
            </Button>
          </div>
          <LeadCaptureForm intent="contact" submitLabel={t.lead.continue} />
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="section-container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy md:text-3xl">{t.finalCta.heading}</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">{t.finalCta.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to={brand.coursePath}>{t.finalCta.ctaPrimary}</Link>
            </Button>
            <a
              href={brand.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-card text-[#FF0000] transition-colors hover:bg-background"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
