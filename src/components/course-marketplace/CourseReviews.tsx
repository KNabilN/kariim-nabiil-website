import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  agenticCourseReviews,
  reviewDisplayName,
  reviewInitials,
  type CourseReview,
} from "@/data/courseReviews";
import { useCmsCourseReviews } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function ReviewCard({
  review,
  anonymousLabel,
  readMoreLabel,
  readLessLabel,
}: {
  review: CourseReview;
  anonymousLabel: string;
  readMoreLabel: string;
  readLessLabel: string;
}) {
  const name = reviewDisplayName(review, anonymousLabel);
  const initials = reviewInitials(review, anonymousLabel);
  const isRtl = review.lang === "ar";
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setExpanded(false);
  }, [review.id, review.quote]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    if (expanded) {
      setNeedsClamp(true);
      return;
    }

    const measure = () => {
      setNeedsClamp(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(frame);
  }, [expanded, review.quote]);

  return (
    <blockquote
      lang={review.lang}
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col rounded-md border border-border bg-background p-5 md:p-6"
    >
      <Quote
        className={cn("h-5 w-5 shrink-0 text-primary/40", isRtl ? "self-end" : "self-start")}
        aria-hidden
      />
      <p
        ref={textRef}
        className={cn(
          "mt-3 text-sm leading-7 text-foreground md:text-[15px] md:leading-7",
          expanded ? "h-auto" : "h-[8.75rem] line-clamp-5",
        )}
      >
        {review.quote}
      </p>
      {/* Reserve the same row height so short and long cards stay aligned */}
      <div className="mt-2 flex min-h-7 items-center">
        {needsClamp ? (
          <button
            type="button"
            className="text-sm font-semibold text-primary hover:underline"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
          >
            {expanded ? readLessLabel : readMoreLabel}
          </button>
        ) : null}
      </div>
      <footer className="mt-auto flex items-center gap-3 border-t border-border/70 pt-4">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
        >
          {initials}
        </span>
        <cite className="not-italic text-sm font-semibold text-navy">{name}</cite>
      </footer>
    </blockquote>
  );
}

interface CourseReviewsProps {
  reviews?: CourseReview[];
}

export default function CourseReviews({ reviews }: CourseReviewsProps) {
  const { t, locale } = useLanguage();
  const { data: cmsReviews } = useCmsCourseReviews();
  const items = reviews ?? cmsReviews ?? agenticCourseReviews;
  const isRtlUi = locale === "ar";

  if (items.length === 0) return null;

  return (
    <section id="reviews" className="rounded-md border border-border bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy md:text-2xl">{t.course.studentReviews}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.course.studentReviewsSubtitle}</p>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {items.length} {t.course.reviewsCountLabel}
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          direction: isRtlUi ? "rtl" : "ltr",
        }}
        className="mt-6"
        dir={isRtlUi ? "rtl" : "ltr"}
      >
        <CarouselContent className="-ml-3 items-start md:-ml-4">
          {items.map((review) => (
            <CarouselItem
              key={review.id}
              className="basis-[88%] pl-3 sm:basis-[70%] md:basis-[55%] md:pl-4 lg:basis-[48%]"
            >
              <ReviewCard
                review={review}
                anonymousLabel={t.course.anonymousStudent}
                readMoreLabel={t.course.readMoreReview}
                readLessLabel={t.course.readLessReview}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-5 flex items-center justify-end gap-2">
          <CarouselPrevious className="static h-9 w-9 translate-y-0 rounded-full" />
          <CarouselNext className="static h-9 w-9 translate-y-0 rounded-full" />
        </div>
      </Carousel>
    </section>
  );
}
