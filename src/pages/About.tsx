import { Link } from "react-router-dom";
import { Linkedin, Youtube } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import PresenceGallery from "@/components/brand/PresenceGallery";
import { Button } from "@/components/ui/button";
import { getCv } from "@/data/cv";
import { portraits } from "@/data/gallery";
import { useCmsBrand, useCmsCv } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";
import nasaSpaceApps from "@/assets/gallery/nasa-space-apps.jpg";
import webSummit from "@/assets/gallery/web-summit-qatar.jpg";
import arabYouthAward from "@/assets/gallery/arab-youth-award.jpg";
import speakingStage from "@/assets/gallery/speaking-stage.jpg";
import flutterForward from "@/assets/gallery/flutter-forward.jpg";

export default function About() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: cvCms } = useCmsCv(locale);
  const brand = brandCms || getBrand(locale);
  const cv = cvCms || getCv(locale);

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.pages.aboutTitle} description={t.about.subtitle} />

      <section className="border-b border-border bg-card py-8 md:py-10">
        <div className="section-container">
          <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="mx-auto w-full max-w-[280px] lg:mx-0">
              <figure>
                <img
                  src={portraits.suit}
                  alt={`${brand.fullName} professional portrait`}
                  className="aspect-[4/5] w-full rounded-md border border-border object-cover object-top shadow-sm"
                />
                <figcaption className="mt-2 text-center text-sm font-semibold text-primary lg:text-start">
                  {locale === "ar" ? "تمثيل دولي، روسيا" : "International representation, Russia"}
                </figcaption>
              </figure>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <img src={webSummit} alt={`${brand.name} at Web Summit Qatar`} className="aspect-square w-full rounded-md border border-border object-cover object-top" />
                <img src={speakingStage} alt={`${brand.name} speaking`} className="aspect-square w-full rounded-md border border-border object-cover object-top" />
              </div>
            </div>

            <div className="min-w-0 text-center lg:text-start">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">{brand.fullName}</h2>
              <p className="mt-1 font-semibold text-primary">{brand.specialty}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{cv.summary}</p>
              <p className="mt-3 text-sm font-bold text-navy">{brand.tagline}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.about.philosophyLabel}{" "}
                <span className="font-semibold text-navy">{brand.philosophy}</span>
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="overflow-hidden rounded-md border border-border">
                  <img src={nasaSpaceApps} alt="NASA Space Apps" className="aspect-[16/10] w-full object-cover" />
                  <p className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">NASA Space Apps</p>
                </div>
                <div className="overflow-hidden rounded-md border border-border">
                  <img src={arabYouthAward} alt="Arab Youth recognition" className="aspect-[16/10] w-full object-cover" />
                  <p className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
                    {locale === "ar" ? "عام الشباب العربي" : "Arab Youth Year"}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-border">
                  <img src={flutterForward} alt="Flutter Forward" className="aspect-[16/10] w-full object-cover object-top" />
                  <p className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">Flutter Forward</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <a
                  href={brand.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-[#0A66C2] transition-colors hover:bg-secondary"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={brand.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-[#FF0000] transition-colors hover:bg-secondary"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <Button asChild size="sm" className="ms-1">
                  <Link to={brand.coursePath}>{t.nav.exploreCourse}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PresenceGallery />

      <section className="section-shell border-t border-border bg-card">
        <div className="section-container">
          <h2 className="section-title">{t.about.experience}</h2>
          <div className="relative mt-8 space-y-0 border-s border-border ps-6 md:ps-10">
            {cv.experience.map((job) => (
              <article key={`${job.org}-${job.role}`} className="relative pb-8">
                <span className="absolute -start-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-card md:-start-[2.65rem]" />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-navy">{job.role}</h3>
                    <p className="mt-1 font-semibold text-primary">{job.org}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.period}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {job.location} · {job.industry}
                </p>
                <ul className="mt-4 space-y-2">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm leading-relaxed text-foreground md:text-base">
                      · {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-navy">{t.about.education}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {cv.education.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-navy">{t.about.certifications}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {cv.certifications.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-shell border-t border-border bg-card">
        <div className="section-container">
          <h2 className="section-title">{t.about.skills}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {cv.skills.map((skill) => (
              <div key={skill.title} className="rounded-md border border-border bg-background p-5">
                <h3 className="font-bold text-navy">{skill.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{skill.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-navy">{t.about.accomplishments}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {cv.accomplishments.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-navy">{t.about.languages}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {cv.languages.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
