import { Link } from "react-router-dom";
import { BookOpen, CreditCard, MessageSquare, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const cards = [
  { to: "/admin/home", icon: Sparkles, titleKey: "navHome" as const },
  { to: "/admin/catalog", icon: BookOpen, titleKey: "navCatalog" as const },
  { to: "/admin/leads", icon: MessageSquare, titleKey: "navLeads" as const },
  { to: "/admin/lms/payments", icon: CreditCard, titleKey: "navPayments" as const },
];

export default function OverviewPage() {
  const { t } = useLanguage();
  const a = t.admin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{a.overview}</h1>
        <p className="mt-1 text-muted-foreground">{a.overviewHint}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-bold text-navy">{a[card.titleKey]}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
