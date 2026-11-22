import { useEffect, useMemo, useState } from "react";
import { Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

type FeedbackRow = {
  id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  stage: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-3.5 w-3.5 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

export default function FeedbackPage() {
  const { t, locale } = useLanguage();
  const a = t.admin;
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<"all" | "mid" | "end">("all");

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_feedback")
      .select("id, student_name, student_email, course_title, stage, rating, comment, created_at")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load feedback", description: error.message, variant: "destructive" });
    setRows((data as FeedbackRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchRows();
  }, []);

  const filtered = useMemo(
    () => rows.filter((row) => stageFilter === "all" || row.stage === stageFilter),
    [rows, stageFilter],
  );

  const avg =
    filtered.length > 0 ? filtered.reduce((sum, row) => sum + row.rating, 0) / filtered.length : 0;

  const remove = async (id: string) => {
    const { error } = await supabase.from("course_feedback").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else void fetchRows();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{a.navFeedback}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} {locale === "ar" ? "تقييم" : "reviews"}
          {filtered.length > 0 ? ` · ${locale === "ar" ? "متوسط" : "avg"} ${avg.toFixed(1)}/5` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={stageFilter}
          onChange={(event) => setStageFilter(event.target.value as "all" | "mid" | "end")}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">{locale === "ar" ? "كل المراحل" : "All stages"}</option>
          <option value="mid">{locale === "ar" ? "منتصف الكورس" : "Mid-course"}</option>
          <option value="end">{locale === "ar" ? "نهاية الكورس" : "End of course"}</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">{a.empty}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => (
            <article key={row.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-navy">{row.student_name}</p>
                    <Stars rating={row.rating} />
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {row.stage === "mid"
                        ? locale === "ar"
                          ? "منتصف"
                          : "Mid"
                        : locale === "ar"
                          ? "نهاية"
                          : "End"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {row.student_email} · {row.course_title}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
                  {row.comment ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{row.comment}</p>
                  ) : (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      {locale === "ar" ? "بدون تعليق" : "No comment"}
                    </p>
                  )}
                </div>
                <Button type="button" size="sm" variant="ghost" onClick={() => void remove(row.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
