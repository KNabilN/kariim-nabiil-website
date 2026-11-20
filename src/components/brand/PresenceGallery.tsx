import { useCmsGallery } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface PresenceGalleryProps {
  className?: string;
  compact?: boolean;
}

export default function PresenceGallery({ className, compact = false }: PresenceGalleryProps) {
  const { t, locale } = useLanguage();
  const { data: items = [] } = useCmsGallery(locale);
  const visible = compact ? items.slice(0, 6) : items;
  const track = [...visible, ...visible];

  if (visible.length === 0) return null;

  return (
    <section className={cn("section-shell border-y border-border bg-card", className)}>
      <div className="section-container">
        <div className="max-w-2xl">
          <h2 className="section-title">{t.presence.heading}</h2>
          <p className="mt-2 text-muted-foreground">{t.presence.subtitle}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden" dir="ltr">
        <div className="presence-marquee flex w-max gap-4 px-4 hover:[animation-play-state:paused] md:px-6">
          {track.map((item, index) => (
            <figure
              key={`${item.id}-${index}`}
              className="group w-[280px] shrink-0 overflow-hidden rounded-md border border-border bg-background shadow-sm sm:w-[320px] md:w-[360px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <figcaption className="space-y-1 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{item.tag}</p>
                <p className="text-sm font-semibold leading-snug text-navy">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
