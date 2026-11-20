import { getCourseCategories } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryChips({ active, onChange }: CategoryChipsProps) {
  const { locale } = useLanguage();
  const categories = getCourseCategories(locale);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={cn("udemy-chip", active === category.id && "udemy-chip-active")}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
