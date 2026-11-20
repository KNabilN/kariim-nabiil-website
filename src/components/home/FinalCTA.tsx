import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BRAND } from "@/lib/brand";
import speaking from "@/assets/karim-speaking.jpg";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="section-shell pb-24">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          <img src={speaking} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080F1F] via-[#080F1F]/85 to-[#2563EB]/30" />
          <div className="relative max-w-3xl px-8 py-16 md:px-14 md:py-20">
            <h2 className="section-title">{t.finalCta.heading}</h2>
            <p className="mt-4 max-w-xl text-lg text-slate-300">{t.finalCta.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero">
                <Link to={BRAND.coursePath}>{t.finalCta.ctaPrimary}</Link>
              </Button>
              <Button asChild size="lg" variant="heroOutline">
                <a href={BRAND.youtube} target="_blank" rel="noopener noreferrer">
                  {t.finalCta.ctaSecondary}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
