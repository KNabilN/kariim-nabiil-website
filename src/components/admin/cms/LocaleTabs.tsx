import { cn } from "@/lib/utils";

interface LocaleTabsProps {
  value: "en" | "ar";
  onChange: (value: "en" | "ar") => void;
}

export default function LocaleTabs({ value, onChange }: LocaleTabsProps) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5 text-xs font-semibold">
      <button
        type="button"
        className={cn("rounded px-3 py-1.5", value === "en" && "bg-secondary text-navy")}
        onClick={() => onChange("en")}
      >
        English
      </button>
      <button
        type="button"
        className={cn("rounded px-3 py-1.5", value === "ar" && "bg-secondary text-navy")}
        onClick={() => onChange("ar")}
      >
        العربية
      </button>
    </div>
  );
}
