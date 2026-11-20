import PageHero from "@/components/layout/PageHero";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function Enroll() {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.lead.enrollTitle} description={t.lead.enrollDescription} />
      <section className="section-shell">
        <div className="section-container">
          <LeadCaptureForm
            intent="enroll"
            title={t.lead.enrollFormTitle}
            subtitle={t.lead.enrollFormSubtitle}
            submitLabel={t.lead.continue}
          />
        </div>
      </section>
    </>
  );
}
