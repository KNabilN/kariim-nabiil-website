import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type FeedbackStage = "mid" | "end";

interface CourseFeedbackDialogProps {
  open: boolean;
  stage: FeedbackStage;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onSubmitted: (stage: FeedbackStage) => void;
}

export default function CourseFeedbackDialog({
  open,
  stage,
  studentId,
  studentName,
  studentEmail,
  courseId,
  courseTitle,
  onClose,
  onSubmitted,
}: CourseFeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const title = stage === "mid" ? "How is the course going so far?" : "How was the course overall?";
  const description =
    stage === "mid"
      ? "You're about halfway through. Rate the course and share any feedback."
      : "You've finished the course. Rate it and leave a short comment for the team.";

  const reset = () => {
    setRating(0);
    setHover(0);
    setComment("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      toast({ title: "Pick a rating", description: "Please choose 1 to 5 stars.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("course_feedback").upsert(
      {
        student_id: studentId,
        course_id: courseId,
        student_name: studentName,
        student_email: studentEmail,
        course_title: courseTitle,
        stage,
        rating,
        comment: comment.trim() || null,
      },
      { onConflict: "student_id,course_id,stage" },
    );
    setSaving(false);

    if (error) {
      toast({ title: "Could not save feedback", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Thanks for your feedback!" });
    reset();
    onSubmitted(stage);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          <div>
            <Label className="mb-2 block">Rating</Label>
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= (hover || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    className="rounded-md p-1 transition-transform hover:scale-110"
                    onMouseEnter={() => setHover(value)}
                    onClick={() => setRating(value)}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && <span className="ms-2 text-sm font-semibold text-navy">{rating}/5</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="course-feedback-comment">
              Feedback <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="course-feedback-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-1.5 min-h-[110px]"
              placeholder="What did you like? What can we improve?"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Skip for now
            </Button>
            <Button type="button" onClick={() => void handleSubmit()} disabled={saving}>
              {saving ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
              Submit feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
