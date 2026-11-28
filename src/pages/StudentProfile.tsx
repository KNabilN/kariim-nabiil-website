import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, Laptop, Loader2, Save, User } from "lucide-react";
import DeviceGate from "@/components/course/DeviceGate";
import StudentDevicesPanel from "@/components/course/StudentDevicesPanel";
import CertificateActions from "@/components/course/CertificateActions";
import { type CertificateView } from "@/components/course/CompletionCertificate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MAX_STUDENT_DEVICES } from "@/lib/deviceFingerprint";
import {
  clearStudentSession,
  readStudentSession,
  writeStudentSession,
  type StudentSession,
} from "@/lib/studentSession";

type CertificateRow = CertificateView & {
  id: string;
  courseId: string;
};

export default function StudentProfile() {
  const [student, setStudent] = useState<StudentSession | null>(() => readStudentSession());
  const [name, setName] = useState(student?.fullName || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState<CertificateRow[]>([]);
  const [activeCert, setActiveCert] = useState<CertificateRow | null>(null);

  const handleAccess = useCallback((session: StudentSession) => {
    setStudent(session);
    setName(session.fullName || "");
  }, []);

  useEffect(() => {
    if (!student) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);

      const { data: profile } = await supabase
        .from("course_students")
        .select("id, email, full_name")
        .eq("id", student.id)
        .maybeSingle();

      if (!mounted) return;
      if (profile) {
        const synced: StudentSession = {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name || "",
        };
        writeStudentSession(synced);
        setStudent(synced);
        setName(synced.fullName);
      }

      const { data, error } = await supabase
        .from("course_certificates")
        .select("id, course_id, student_name, course_title, certificate_code, issued_at")
        .eq("student_id", student.id)
        .order("issued_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        toast({ title: "Could not load certificates", description: error.message, variant: "destructive" });
        setCerts([]);
      } else {
        setCerts(
          (data || []).map((row) => ({
            id: row.id,
            courseId: row.course_id,
            studentName: row.student_name,
            courseTitle: row.course_title,
            certificateCode: row.certificate_code,
            issuedAt: row.issued_at,
          })),
        );
      }
      setLoading(false);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [student?.id]);

  const saveName = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!student) return;
    const nextName = name.trim();
    if (!nextName) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const { data, error } = await supabase
      .from("course_students")
      .update({ full_name: nextName })
      .eq("id", student.id)
      .select("id, email, full_name")
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Could not update name",
        description: error?.message || "Update was blocked. Run the latest student-name migration in Supabase.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    // Keep certificate names in sync with the profile name.
    await supabase.from("course_certificates").update({ student_name: nextName }).eq("student_id", student.id);

    const nextSession: StudentSession = {
      id: data.id,
      email: data.email,
      fullName: data.full_name || nextName,
    };
    writeStudentSession(nextSession);
    setStudent(nextSession);
    setName(nextSession.fullName);
    setCerts((current) => current.map((cert) => ({ ...cert, studentName: nextName })));
    toast({ title: "Name updated" });
    setSaving(false);
  };

  if (!student) {
    return <DeviceGate onAccess={handleAccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/course/learn"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            My courses
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearStudentSession();
              setStudent(null);
            }}
          >
            Sign out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-navy sm:text-3xl">
            <User className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
            Student profile
          </h1>
          <p className="mt-2 break-all text-sm text-muted-foreground sm:text-base">{student.email}</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-navy">Your name</h2>
          <p className="mt-1 text-sm text-muted-foreground">This name appears on your certificates.</p>

          <form onSubmit={(event) => void saveName(event)} className="mt-5 space-y-3">
            <div>
              <Label htmlFor="student-name">Full name</Label>
              <Input
                id="student-name"
                className="mt-1.5 h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full sm:w-auto sm:min-w-[140px]" disabled={saving}>
              {saving ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Save className="me-2 h-4 w-4" />}
              Save name
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <Laptop className="h-5 w-5 text-primary" />
            Devices
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You can use up to {MAX_STUDENT_DEVICES} devices. Sign out a device you no longer use to free a slot.
          </p>
          <div className="mt-4">
            <StudentDevicesPanel
              studentId={student.id}
              onChanged={({ wasCurrent }) => {
                if (wasCurrent) {
                  setStudent(null);
                }
              }}
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <Award className="h-5 w-5 text-primary" />
            Certificates
          </h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : certs.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No certificates yet. Complete all lectures in a course to earn one.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {certs.map((cert) => (
                <li
                  key={cert.id}
                  className="flex flex-col gap-3 rounded-lg border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{cert.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.issuedAt).toLocaleDateString()} · {cert.certificateCode}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setActiveCert(cert)}>
                    View certificate
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Dialog open={Boolean(activeCert)} onOpenChange={(open) => !open && setActiveCert(null)}>
        <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate</DialogTitle>
          </DialogHeader>
          {activeCert && <CertificateActions certificate={activeCert} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
