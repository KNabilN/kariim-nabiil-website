import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogCourse } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

interface StickyEnrollCardProps {
  course: CatalogCourse;
}

function formatPrice(price: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

function financialAidWhatsAppUrl(whatsappUrl: string, message: string) {
  const base = whatsappUrl.split("?")[0];
  return `${base}?text=${encodeURIComponent(message)}`;
}

export default function StickyEnrollCard({ course }: StickyEnrollCardProps) {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);
  const showPrice = typeof course.price === "number" && course.price > 0;
  const aidWhatsApp = financialAidWhatsAppUrl(brand.whatsappUrl, t.course.financialAidWhatsAppMessage);

  return (
    <aside className="overflow-hidden rounded-md border border-border bg-card shadow-lg">
      <div className="aspect-video overflow-hidden bg-secondary">
        <img src={course.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="space-y-4 p-5">
        {showPrice && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.course.priceLabel}</p>
            <p className="mt-0.5 text-3xl font-bold leading-none text-navy">
              {formatPrice(course.price!, course.currency || "EGP", locale)}
            </p>
          </div>
        )}

        <p className="inline-flex items-center gap-1.5 rounded-md bg-primary/5 px-2.5 py-1.5 text-sm font-semibold text-primary">
          <GraduationCap className="h-4 w-4 shrink-0" />
          {t.course.studentDiscountBadge}
        </p>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{course.level}</p>
          <p>{course.language}</p>
          <p className="font-semibold text-navy">{brand.studentsLabel}</p>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full" size="lg">
            <Link to="/enroll">{t.course.enrollNow}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <a href={aidWhatsApp} target="_blank" rel="noopener noreferrer">
              {t.course.requestFinancialAid}
            </a>
          </Button>
        </div>

        <ul className="space-y-1.5 border-t border-border pt-3 text-sm text-muted-foreground">
          <li>
            {t.course.instructorLabel} {course.instructor}
          </li>
          <li>
            {t.course.categoryLabel} {course.category}
          </li>
        </ul>
      </div>
    </aside>
  );
}
