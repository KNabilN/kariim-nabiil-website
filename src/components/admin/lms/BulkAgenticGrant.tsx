import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BULK_AGENTIC_EMAILS } from "@/data/bulkAgenticEmails";
import { supabase } from "@/integrations/supabase/client";
import { AGENTIC_COURSE_SLUG, AGENTIC_COURSE_TITLE } from "@/lib/ensureAgenticPaidCourse";

const PAYMENTS_CHANGED_EVENT = "payment-submissions-changed";

function nameFromEmail(email: string) {
  const local = email.split("@")[0] || email;
  return local.replace(/[._+-]+/g, " ").replace(/\s+/g, " ").trim() || email;
}

async function resolveAgenticCourseId(): Promise<string | null> {
  const bySlug = await supabase
    .from("paid_courses")
    .select("id")
    .eq("slug", AGENTIC_COURSE_SLUG)
    .maybeSingle();
  if (bySlug.data?.id) return bySlug.data.id;

  const byTitle = await supabase
    .from("paid_courses")
    .select("id")
    .ilike("title", `%${AGENTIC_COURSE_TITLE.split(":")[0]}%`)
    .limit(1)
    .maybeSingle();
  return byTitle.data?.id || null;
}

/** One-click grant of the prepared Agentic student email list (team/admin session required). */
export default function BulkAgenticGrant() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");

  const onGrant = async () => {
    setRunning(true);
    setProgress("Resolving Agentic course…");
    try {
      const courseId = await resolveAgenticCourseId();
      if (!courseId) {
        toast({
          title: "Agentic course not found",
          description: "Create/link the paid course in admin first.",
          variant: "destructive",
        });
        return;
      }

      const emails = [...BULK_AGENTIC_EMAILS];
      const chunkSize = 80;
      let upserted = 0;
      let accessRows = 0;
      let paymentRows = 0;

      for (let i = 0; i < emails.length; i += chunkSize) {
        const chunk = emails.slice(i, i + chunkSize);
        setProgress(`Adding students ${Math.min(i + chunk.length, emails.length)} / ${emails.length}`);

        const { data: students, error: upsertError } = await supabase
          .from("course_students")
          .upsert(
            chunk.map((email) => ({
              email,
              full_name: nameFromEmail(email),
              is_active: true,
              added_by: "bulk",
            })),
            { onConflict: "email" },
          )
          .select("id, email, full_name");

        if (upsertError) throw new Error(upsertError.message);
        upserted += students?.length || 0;

        if (students?.length) {
          const { error: accessError } = await supabase.from("course_student_access").upsert(
            students.map((s) => ({ student_id: s.id, course_id: courseId })),
            { onConflict: "student_id,course_id" },
          );
          if (accessError) throw new Error(accessError.message);
          accessRows += students.length;

          const { data: existingPayments, error: existingError } = await supabase
            .from("payment_submissions")
            .select("email")
            .eq("course_id", courseId)
            .eq("status", "approved")
            .in(
              "email",
              students.map((s) => s.email),
            );
          if (existingError) throw new Error(existingError.message);

          const alreadyLogged = new Set(
            (existingPayments || []).map((row) => row.email.trim().toLowerCase()),
          );
          const paymentPayload = students
            .filter((s) => !alreadyLogged.has(s.email.trim().toLowerCase()))
            .map((s) => ({
              email: s.email,
              full_name: s.full_name || nameFromEmail(s.email),
              phone: "-",
              payment_method: "instapay" as const,
              screenshot_url: "-",
              status: "approved" as const,
              amount: null,
              currency: "EGP",
              course_id: courseId,
              reviewed_at: new Date().toISOString(),
            }));

          if (paymentPayload.length > 0) {
            const { error: paymentError } = await supabase.from("payment_submissions").insert(paymentPayload);
            if (paymentError) throw new Error(paymentError.message);
            paymentRows += paymentPayload.length;
          }
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(PAYMENTS_CHANGED_EVENT));
      }

      setProgress(`Done: ${upserted} students, ${accessRows} access, ${paymentRows} payment records`);
      toast({
        title: "Agentic access granted",
        description: `${emails.length} emails processed · ${paymentRows} new payment records.`,
      });
    } catch (error) {
      toast({
        title: "Bulk grant failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      setProgress("");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-lg rounded-xl border border-dashed border-border bg-muted/30 p-4">
      <p className="text-sm font-semibold text-navy">Bulk Agentic access</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Grant course access to the prepared list ({BULK_AGENTIC_EMAILS.length} emails). Stay logged in as team/admin.
      </p>
      <Button type="button" className="mt-3 w-full" disabled={running} onClick={() => void onGrant()}>
        {running ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <UserPlus className="me-2 h-4 w-4" />}
        Grant Agentic access to {BULK_AGENTIC_EMAILS.length} emails
      </Button>
      {progress && <p className="mt-2 text-xs text-muted-foreground">{progress}</p>}
    </div>
  );
}
