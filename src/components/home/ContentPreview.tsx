import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BRAND } from "@/lib/brand";
import studio from "@/assets/karim-studio.jpg";
import speaking from "@/assets/karim-speaking.jpg";

export default function ContentPreview() {
  const { t } = useLanguage();

  const cards = [
    {
      title: "Agentic AI Engineering",
      topic: "Agentic AI",
      href: BRAND.coursePath,
      external: false,
      image: speaking,
    },
    {
      title: "AI Sales Automation using n8n",
      topic: "Automation",
      href: BRAND.salesCourseUrl,
      external: true,
      image: studio,
    },
  ];

  return (
    <section className="section-shell">
      <div className="section-container">
        <p className="eyebrow">05</p>
        <h2 className="section-title mt-4 max-w-3xl">{t.content.heading}</h2>
        <p className="mt-4 max-w-2xl text-slate-400 md:text-lg">{t.content.description}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {cards.map((item) => {
            const inner = (
              <>
                <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080F1F] via-[#080F1F]/55 to-[#080F1F]/10" />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{item.topic}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-slate-200">
                    Open <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </>
            );
            const className = "group relative block min-h-[280px] overflow-hidden rounded-[1.8rem] border border-white/10";
            return item.external ? (
              <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                {inner}
              </a>
            ) : (
              <Link key={item.title} to={item.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </div>

        <a
          href={BRAND.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between rounded-[1.6rem] border border-white/10 px-6 py-5 text-white transition-colors hover:border-cyan/40 md:px-8"
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.22em] text-cyan">YouTube</span>
            <span className="mt-1 block text-lg font-semibold">{t.content.cta}</span>
          </span>
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
