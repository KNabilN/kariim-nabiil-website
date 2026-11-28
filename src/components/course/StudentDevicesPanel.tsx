import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Laptop, Loader2, LogOut, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceFingerprint, MAX_STUDENT_DEVICES } from "@/lib/deviceFingerprint";
import { clearStudentSession } from "@/lib/studentSession";
import { cn } from "@/lib/utils";

interface StudentDevice {
  id: string;
  device_fingerprint: string;
  device_name: string;
  last_seen_at: string;
  created_at: string;
}

interface StudentDevicesPanelProps {
  studentId: string;
  /** Compact layout for the login gate. */
  compact?: boolean;
  /** Called after a successful delete. `wasCurrent` is true when this browser's device was removed. */
  onChanged?: (info: { wasCurrent: boolean; remaining: number }) => void;
  className?: string;
}

function deviceIcon(name: string) {
  if (/iPhone|iPad|Android/i.test(name)) return Smartphone;
  return Laptop;
}

const StudentDevicesPanel = ({ studentId, compact = false, onChanged, className }: StudentDevicesPanelProps) => {
  const [devices, setDevices] = useState<StudentDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const currentFingerprint = getDeviceFingerprint();

  const loadDevices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("student_devices")
      .select("id, device_fingerprint, device_name, last_seen_at, created_at")
      .eq("student_id", studentId)
      .order("last_seen_at", { ascending: false });

    if (error) {
      toast({ title: "Could not load devices", description: error.message, variant: "destructive" });
      setDevices([]);
    } else {
      setDevices((data || []) as StudentDevice[]);
    }
    setLoading(false);
  }, [studentId]);

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  const removeDevice = async (device: StudentDevice) => {
    const isCurrent = device.device_fingerprint === currentFingerprint;
    const confirmed = window.confirm(
      isCurrent
        ? "Sign out this device? You will need to log in again on this browser."
        : `Sign out "${device.device_name}"? That device will need to log in again.`,
    );
    if (!confirmed) return;

    setRemovingId(device.id);
    const { error } = await supabase.from("student_devices").delete().eq("id", device.id).eq("student_id", studentId);

    if (error) {
      toast({ title: "Could not sign out device", description: error.message, variant: "destructive" });
      setRemovingId(null);
      return;
    }

    const remaining = devices.filter((d) => d.id !== device.id);
    setDevices(remaining);
    setRemovingId(null);

    if (isCurrent) {
      clearStudentSession();
    } else {
      toast({ title: "Device signed out", description: `${device.device_name} was removed.` });
    }

    onChanged?.({ wasCurrent: isCurrent, remaining: remaining.length });
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-6", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {!compact && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {devices.length} / {MAX_STUDENT_DEVICES} devices
          </p>
        </div>
      )}

      {devices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No devices registered yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {devices.map((device) => {
            const isCurrent = device.device_fingerprint === currentFingerprint;
            const Icon = deviceIcon(device.device_name);
            return (
              <li key={device.id} className="flex items-center gap-3 px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">{device.device_name}</p>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last seen{" "}
                    {formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 gap-1.5"
                  disabled={removingId === device.id}
                  onClick={() => void removeDevice(device)}
                >
                  {removingId === device.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="h-3.5 w-3.5" />
                  )}
                  <span className={compact ? "sr-only sm:not-sr-only" : undefined}>Sign out</span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StudentDevicesPanel;
