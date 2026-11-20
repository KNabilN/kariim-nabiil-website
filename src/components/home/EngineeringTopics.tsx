import { useLanguage } from "@/i18n/LanguageProvider";

export default function EngineeringTopics() {
  const { t } = useLanguage();

  return (
    <section className="section-shell">
      <div className="section-container">
        <p className="eyebrow">03</p>
        <h2 className="section-title mt-4 max-w-3xl">{t.topics.heading}</h2>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {t.topics.items.map((topic, index) => (
            <div
              key={topic}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101a2e] px-5 py-6 transition-colors hover:border-cyan/40"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-slate-500">0{index + 1}</span>
              <p className="mt-6 text-lg font-semibold tracking-tight text-white">{topic}</p>
              <span className="absolute -end-6 -top-6 h-16 w-16 rounded-full bg-cyan/0 blur-2xl transition-colors group-hover:bg-cyan/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
