import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface WhatYouLearnProps {
  items: string[];
}

export default function WhatYouLearn({ items }: WhatYouLearnProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-md border border-border bg-card p-6 md:p-8">
      <h2 className="text-xl font-bold text-navy md:text-2xl">{t.course.whatYouLearn}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground md:text-base">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
