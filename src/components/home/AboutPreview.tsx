import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BRAND } from "@/lib/brand";
import portrait from "@/assets/karim-portrait.png";
import speaking from "@/assets/karim-speaking.jpg";

export default function AboutPreview() {
  const { t } = useLanguage();

  return (
    <section className="section-shell">
      <div className="section-container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-[460px]">
          <img src={speaking} alt={`${BRAND.name} speaking`} className="h-full w-[78%] rounded-[1.8rem] object-cover" />
          <img
            src={portrait}
            alt=""
            className="absolute bottom-6 end-0 h-48 w-40 rounded-2xl border-4 border-[#080F1F] object-cover object-top shadow-2xl"
          />
        </div>
        <div>
          <p className="eyebrow">06</p>
          <h2 className="section-title mt-4">{t.aboutPreview.heading}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{t.aboutPreview.body}</p>
          <p className="mt-4 text-gradient font-medium">{BRAND.tagline}</p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
            {t.aboutPreview.cta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
