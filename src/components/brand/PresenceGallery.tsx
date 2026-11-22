import { useEffect, useRef } from "react";
import { useCmsGallery } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface PresenceGalleryProps {
  className?: string;
  compact?: boolean;
}

const AUTO_SPEED = 0.45; // px per frame (~27px/s at 60fps)

export default function PresenceGallery({ className, compact = false }: PresenceGalleryProps) {
  const { t, locale } = useLanguage();
  const { data: items = [] } = useCmsGallery(locale);
  const visible = compact ? items.slice(0, 6) : items;
  const track = [...visible, ...visible];

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = media.matches;
    const onChange = () => {
      reduceMotionRef.current = media.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl || visible.length === 0) return;

    const measure = () => {
      halfWidthRef.current = trackEl.scrollWidth / 2;
      if (offsetRef.current === 0 && halfWidthRef.current > 0) {
        // Match previous CSS start: translateX(-50%)
        offsetRef.current = -halfWidthRef.current;
      }
      normalizeOffset();
      applyTransform();
    };

    const normalizeOffset = () => {
      const half = halfWidthRef.current;
      if (half <= 0) return;
      while (offsetRef.current >= 0) offsetRef.current -= half;
      while (offsetRef.current < -half) offsetRef.current += half;
    };

    const applyTransform = () => {
      trackEl.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);

    let raf = 0;
    const tick = () => {
      if (!draggingRef.current && !reduceMotionRef.current && halfWidthRef.current > 0) {
        offsetRef.current += AUTO_SPEED;
        normalizeOffset();
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [visible.length, locale]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    draggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    lastXRef.current = event.clientX;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return;
    const dx = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    offsetRef.current += dx;

    const half = halfWidthRef.current;
    if (half > 0) {
      while (offsetRef.current >= 0) offsetRef.current -= half;
      while (offsetRef.current < -half) offsetRef.current += half;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    viewportRef.current?.classList.remove("is-dragging");
    try {
      viewportRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
  };

  if (visible.length === 0) return null;

  return (
    <section className={cn("section-shell border-y border-border bg-card", className)}>
      <div className="section-container">
        <div className="max-w-2xl">
          <h2 className="section-title">{t.presence.heading}</h2>
          <p className="mt-2 text-muted-foreground">{t.presence.subtitle}</p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="presence-marquee-viewport mt-8 cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing"
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="presence-marquee flex w-max gap-4 px-4 will-change-transform md:px-6">
          {track.map((item, index) => (
            <figure
              key={`${item.id}-${index}`}
              className="group w-[280px] shrink-0 overflow-hidden rounded-md border border-border bg-background shadow-sm sm:w-[320px] md:w-[360px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
