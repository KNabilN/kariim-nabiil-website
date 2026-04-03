import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut, Check, X, Loader2, Plus, UserMinus, Eye, Clock, Users, CreditCard
} from "lucide-react";

const TeamDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

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
          <h1 className="text-2xl font-bold mb-2 text-center">Team Login</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">Sign in with your team account</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="team-email">Email</Label>
              <Input id="team-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="team-password">Password</Label>
              <Input id="team-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Team Dashboard</h1>
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
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.from("paid_courses").select("*").eq("is_active", true).then(({ data }) => setPaidCourses(data || []));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    // Upsert student
    const { data: studentData } = await supabase.from("course_students").upsert(
      { email: trimmedEmail, full_name: name, is_active: true, added_by: "team" },
      { onConflict: "email" }
    ).select("id").single();

    // Grant course access
    if (studentData) {
      await supabase.from("course_student_access").upsert(
        { student_id: studentData.id, course_id: selectedCourseId },
        { onConflict: "student_id,course_id" }
      );
    }

    // Create approved payment record
    await supabase.from("payment_submissions").insert({
      email: trimmedEmail,
      full_name: name,
      phone: "-",
      payment_method: "instapay" as any,
      screenshot_url: "-",
      status: "approved" as any,
      amount: amount ? parseFloat(amount) : null,
      currency,
      course_id: selectedCourseId,
      reviewed_at: new Date().toISOString(),
    });

    setLoading(false);
    setSuccess(true);
    setName(""); setEmail(""); setAmount(""); setSelectedCourseId("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold mb-4">Add Student Manually</h2>
      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <Label>Full Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" placeholder="Student name" />
        </div>
        <div className="flex-1 min-w-[140px]">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" placeholder="student@email.com" />
        </div>
        <div className="w-[180px]">
          <Label>Course *</Label>
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select course</option>
            {paidCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="w-[100px]">
          <Label>Amount</Label>
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" placeholder="0.00" />
        </div>
        <div className="w-[80px]">
          <Label>Currency</Label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="EGP">EGP</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="SAR">SAR</option>
          </select>
        </div>
        <Button type="submit" disabled={loading || !selectedCourseId}>
          {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} Add
        </Button>
      </form>
      {success && <p className="text-green-500 text-sm mt-2">Student added successfully!</p>}
    </div>
  );
}

export default TeamDashboard;
