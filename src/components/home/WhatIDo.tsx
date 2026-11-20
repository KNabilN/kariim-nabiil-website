import { Bot, GraduationCap, Workflow } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const icons = [Bot, Workflow, GraduationCap];

export default function WhatIDo() {
  const { t } = useLanguage();

  return (
    <section className="section-shell pt-6">
      <div className="section-container">
        <p className="eyebrow">01</p>
        <h2 className="section-title mt-4 max-w-3xl">{t.whatIDo.heading}</h2>
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {t.whatIDo.items.map((item, index) => {
            const Icon = icons[index] ?? Bot;
            return (
              <article key={item.title} className="grid gap-4 py-8 md:grid-cols-[88px_1fr_1.4fr] md:items-center md:gap-8">
                <div className="flex items-center gap-4 text-cyan md:block">
                  <span className="font-mono text-sm tracking-[0.2em] text-slate-500">0{index + 1}</span>
                  <Icon className="h-5 w-5 md:mt-3" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{item.title}</h3>
                <p className="max-w-xl text-base leading-7 text-slate-400">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
