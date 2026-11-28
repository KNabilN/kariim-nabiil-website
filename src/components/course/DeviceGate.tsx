import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceFingerprint, getDeviceName, MAX_STUDENT_DEVICES } from "@/lib/deviceFingerprint";
import {
  readStudentSession,
  writeStudentSession,
  type StudentSession,
} from "@/lib/studentSession";
import StudentDevicesPanel from "@/components/course/StudentDevicesPanel";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, Mail, ArrowLeft } from "lucide-react";

interface DeviceGateProps {
  onAccess: (student: StudentSession) => void;
}

const DeviceGate = ({ onAccess }: DeviceGateProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState("");
  const [blockedStudentId, setBlockedStudentId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      const saved = readStudentSession();
      if (!saved) {
        if (mounted) setRestoring(false);
        return;
      }

      const { data: student } = await supabase
        .from("course_students")
        .select("id, email, full_name, is_active")
        .eq("id", saved.id)
        .maybeSingle();

      if (!mounted) return;

      if (student?.is_active) {
        const session: StudentSession = {
          id: student.id,
          email: student.email,
          fullName: student.full_name || saved.fullName || "",
        };
        writeStudentSession(session);
        onAccess(session);
        return;
      }

      setRestoring(false);
    };
    void restore();
    return () => {
      mounted = false;
    };
  }, [onAccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBlockedStudentId(null);

    try {
      const { data: student, error: fetchErr } = await supabase
        .from("course_students")
        .select("id, email, full_name, is_active")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (fetchErr) throw fetchErr;
      if (!student) {
        setError("This email is not registered. Please purchase the course first.");
        return;
      }
      if (!student.is_active) {
        setError("Your access has been deactivated. Please contact support.");
        return;
      }

      const fingerprint = getDeviceFingerprint();
      const deviceName = getDeviceName();

      const { data: devices } = await supabase
        .from("student_devices")
        .select("id, device_fingerprint")
        .eq("student_id", student.id);

      const existingDevice = devices?.find((d) => d.device_fingerprint === fingerprint);

      if (!existingDevice) {
        if (devices && devices.length >= MAX_STUDENT_DEVICES) {
          setBlockedStudentId(student.id);
          setError(
            `You've reached the maximum of ${MAX_STUDENT_DEVICES} devices. Remove a device below to continue.`,
          );
          return;
        }
        await supabase.from("student_devices").insert({
          student_id: student.id,
          device_fingerprint: fingerprint,
          device_name: deviceName,
        });
      } else {
        await supabase
          .from("student_devices")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", existingDevice.id);
      }

      const session: StudentSession = {
        id: student.id,
        email: student.email,
        fullName: student.full_name || "",
      };
      writeStudentSession(session);
      onAccess(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (restoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <Link
        to="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Homepage
      </Link>
      <div className="glass w-full max-w-md space-y-6 rounded-2xl p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Student Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your registered email to access the course</p>
        </div>

        <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
          <div>
            <Label htmlFor="student-email">Email Address</Label>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setBlockedStudentId(null);
                setError("");
              }}
              required
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Access Course
          </Button>
        </form>

        {blockedStudentId && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-sm font-semibold">Your devices</p>
            <StudentDevicesPanel
              studentId={blockedStudentId}
              compact
              onChanged={({ remaining }) => {
                if (remaining < MAX_STUDENT_DEVICES) {
                  setError("");
                  setBlockedStudentId(null);
                  toast({
                    title: "Device slot freed",
                    description: "Tap Access Course to continue on this device.",
                  });
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              After removing a device, tap Access Course again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceGate;
