import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceFingerprint, getDeviceName } from "@/lib/deviceFingerprint";
import { Loader2, ShieldAlert, Mail, ArrowLeft } from "lucide-react";

interface DeviceGateProps {
  onAccess: (studentId: string) => void;
}

const DeviceGate = ({ onAccess }: DeviceGateProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: student, error: fetchErr } = await supabase
        .from("course_students")
        .select("id, is_active")
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

      // Check existing devices
      const { data: devices } = await supabase
        .from("student_devices")
        .select("id, device_fingerprint")
        .eq("student_id", student.id);

      const existingDevice = devices?.find((d) => d.device_fingerprint === fingerprint);

      if (existingDevice) {
        await supabase
          .from("student_devices")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", existingDevice.id);
        onAccess(student.id);
        return;
      }

      if (devices && devices.length >= 3) {
        setError("You've reached the maximum of 3 devices. Please contact support to reset your devices.");
        return;
      }

      await supabase.from("student_devices").insert({
        student_id: student.id,
        device_fingerprint: fingerprint,
        device_name: deviceName,
      });

      onAccess(student.id);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Homepage
      </Link>
      <div className="w-full max-w-md glass rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Student Access</h1>
          <p className="text-muted-foreground text-sm mt-2">Enter your registered email to access the course</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="student-email">Email Address</Label>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Access Course
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeviceGate;
