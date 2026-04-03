import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut, Check, X, Loader2, Plus, UserMinus, Eye, Clock, Users, CreditCard
} from "lucide-react";

const EmployeeDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setLoading(false);
        setAuthorized(false);
        setAuthChecked(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    const checkRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["team", "admin"]);
      setAuthorized((data && data.length > 0) || false);
      setAuthChecked(true);
      setLoading(false);
    };
    checkRole();
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAuthorized(false);
    setAuthChecked(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Employee Login</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">Sign in with your employee account</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="emp-email">Email</Label>
              <Input id="emp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="emp-password">Password</Label>
              <Input id="emp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
            </div>
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (authChecked && !authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md glass rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm mb-6">You don't have permission to access this dashboard.</p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="payments">
          <TabsList className="mb-8">
            <TabsTrigger value="payments"><CreditCard className="w-4 h-4 mr-1" /> Payments</TabsTrigger>
            <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" /> Students</TabsTrigger>
            <TabsTrigger value="add-student"><Plus className="w-4 h-4 mr-1" /> Add Student</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <PaymentsTab userId={session.user.id} />
          </TabsContent>
          <TabsContent value="students">
            <StudentsTab />
          </TabsContent>
          <TabsContent value="add-student">
            <AddStudentTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function PaymentsTab({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payment_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleAction = async (id: string, status: "approved" | "rejected", email: string, fullName: string) => {
    setActionLoading(id);
    await supabase
      .from("payment_submissions")
      .update({ status, reviewed_by: userId, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (status === "approved") {
      await supabase.from("course_students").upsert(
        { email, full_name: fullName, is_active: true, added_by: "payment" },
        { onConflict: "email" }
      );
    }
    setActionLoading(null);
    fetchPayments();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Payment Submissions ({payments.length})</h2>
      {payments.length === 0 ? (
        <p className="text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.id} className="glass rounded-xl p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{p.full_name}</p>
                  <p className="text-sm text-muted-foreground">{p.email} · {p.phone}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  p.status === "approved" ? "bg-green-500/10 text-green-500" :
                  p.status === "rejected" ? "bg-destructive/10 text-destructive" :
                  "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="capitalize">{p.payment_method?.replace("_", " ")}</span>
                {p.amount != null && <span className="font-semibold text-foreground">{p.amount} {p.currency || "EGP"}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              {p.screenshot_url && (
                <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-sm hover:underline">
                  <Eye className="w-4 h-4" /> View Screenshot
                </a>
              )}
              {p.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => handleAction(p.id, "approved", p.email, p.full_name)} disabled={actionLoading === p.id}>
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(p.id, "rejected", p.email, p.full_name)} disabled={actionLoading === p.id}>
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentsTab() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase.from("course_students").select("*").order("created_at", { ascending: false });
    setStudents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("course_students").update({ is_active: !current }).eq("id", id);
    fetchStudents();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Students ({students.length})</h2>
      {students.map((s) => (
        <div key={s.id} className="glass rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{s.full_name}</p>
            <p className="text-sm text-muted-foreground">{s.email} · Added via {s.added_by}</p>
          </div>
          <Button
            variant={s.is_active ? "destructive" : "default"}
            size="sm"
            onClick={() => toggleActive(s.id, s.is_active)}
          >
            {s.is_active ? <><UserMinus className="w-4 h-4 mr-1" /> Deactivate</> : "Activate"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddStudentTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("course_students").upsert(
      { email: email.trim().toLowerCase(), full_name: name, is_active: true, added_by: "team" },
      { onConflict: "email" }
    );
    setLoading(false);
    setSuccess(true);
    setName("");
    setEmail("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-bold mb-4">Add Student Manually</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
        </div>
        {success && <p className="text-green-500 text-sm">Student added successfully!</p>}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Add Student
        </Button>
      </form>
    </div>
  );
}

export default EmployeeDashboard;
