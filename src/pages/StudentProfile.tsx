import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Award, Loader2, Save, User } from "lucide-react";
import DeviceGate from "@/components/course/DeviceGate";
import CertificateActions from "@/components/course/CertificateActions";
import { type CertificateView } from "@/components/course/CompletionCertificate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  }, [student]);

  const saveName = async () => {
    if (!student) return;
    const nextName = name.trim();
    if (!nextName) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("course_students").update({ full_name: nextName }).eq("id", student.id);
    if (error) {
      toast({ title: "Could not update name", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }
    const nextSession = { ...student, fullName: nextName };
    writeStudentSession(nextSession);
    setStudent(nextSession);
    toast({ title: "Name updated" });
    setSaving(false);
  };

  if (!student) {
    return <DeviceGate onAccess={handleAccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/course/learn" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
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

      <div className="container mx-auto max-w-3xl space-y-8 px-6 py-10">
        <header>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-navy">
            <User className="h-7 w-7 text-primary" />
            Student profile
          </h1>
          <p className="mt-2 text-muted-foreground">{student.email}</p>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy">Your name</h2>
          <p className="mt-1 text-sm text-muted-foreground">This name appears on your certificates.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label htmlFor="student-name">Full name</Label>
              <Input id="student-name" className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="button" disabled={saving} onClick={() => void saveName()}>
              {saving ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <Save className="me-1 h-4 w-4" />}
              Save
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
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
                <li key={cert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="font-semibold text-navy">{cert.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.issuedAt).toLocaleDateString()} · {cert.certificateCode}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setActiveCert(cert)}>
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
