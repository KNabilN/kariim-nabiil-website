import PageHero from "@/components/layout/PageHero";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function Contact() {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.lead.contactTitle} description={t.lead.contactDescription} />
      <section className="section-shell">
        <div className="section-container">
          <LeadCaptureForm
            intent="contact"
            title={t.lead.contactFormTitle}
            subtitle={t.lead.contactFormSubtitle}
            submitLabel={t.lead.continue}
          />
        </div>
      </section>
    </>
  );
}
