import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LogOut, Check, X, Loader2, Plus, UserMinus, Eye, Clock, Users, CreditCard,
  Search, CalendarIcon, DollarSign, TrendingUp, UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
      if (!session) { setLoading(false); setAuthorized(false); setAuthChecked(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    const checkRole = async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).in("role", ["team", "admin"]);
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (!session) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Employee Login</h1>
        <p className="text-muted-foreground text-center text-sm mb-8">Sign in with your employee account</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><Label htmlFor="emp-email">Email</Label><Input id="emp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" /></div>
          <div><Label htmlFor="emp-password">Password</Label><Input id="emp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" /></div>
          {loginError && <p className="text-destructive text-sm">{loginError}</p>}
          <Button type="submit" className="w-full" disabled={loginLoading}>{loginLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Sign In</Button>
        </form>
      </div>
    </div>
  );

  if (authChecked && !authorized) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-6">You don't have permission to access this dashboard.</p>
        <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
      </header>
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="payments">
          <TabsList className="mb-8">
            <TabsTrigger value="payments"><CreditCard className="w-4 h-4 mr-1" /> Payments</TabsTrigger>
            <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" /> Students</TabsTrigger>
            <TabsTrigger value="add-student"><Plus className="w-4 h-4 mr-1" /> Add Student</TabsTrigger>
          </TabsList>
          <TabsContent value="payments"><PaymentsTab userId={session.user.id} /></TabsContent>
          <TabsContent value="students"><StudentsTab /></TabsContent>
          <TabsContent value="add-student"><AddStudentTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function PaymentsTab({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [approvalCourseMap, setApprovalCourseMap] = useState<Record<string, string>>({});

  const fetchAll = async () => {
    setLoading(true);
    const [paymentsRes, coursesRes] = await Promise.all([
      supabase.from("payment_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("paid_courses").select("*").order("title"),
    ]);
    setPayments(paymentsRes.data || []);
    setPaidCourses(coursesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesCourse = !filterCourse || p.course_id === filterCourse;
      const pDate = new Date(p.created_at);
      const matchesFrom = !dateFrom || pDate >= dateFrom;
      const matchesTo = !dateTo || pDate <= new Date(dateTo.getTime() + 86400000);
      return matchesCourse && matchesFrom && matchesTo;
    });
  }, [payments, filterCourse, dateFrom, dateTo]);

  const approvedPayments = useMemo(() => filteredPayments.filter(p => p.status === "approved"), [filteredPayments]);
  const revenueByCurrency = useMemo(() => {
    const map: Record<string, number> = {};
    approvedPayments.forEach(p => {
      const cur = p.currency || "EGP";
      map[cur] = (map[cur] || 0) + (p.amount || 0);
    });
    return map;
  }, [approvedPayments]);
  const totalRevenue = useMemo(() => approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0), [approvedPayments]);
  const avgPayment = approvedPayments.length > 0 ? totalRevenue / approvedPayments.length : 0;

  const handleAction = async (id: string, status: "approved" | "rejected", email: string, fullName: string) => {
    setActionLoading(id);
    const courseId = approvalCourseMap[id] || null;
    await supabase.from("payment_submissions").update({ status, reviewed_by: userId, reviewed_at: new Date().toISOString(), course_id: courseId }).eq("id", id);
    if (status === "approved") {
      const { data: studentData } = await supabase.from("course_students").upsert(
        { email, full_name: fullName, is_active: true, added_by: "payment" },
        { onConflict: "email" }
      ).select("id").single();
      if (studentData && courseId) {
        await supabase.from("course_student_access").upsert(
          { student_id: studentData.id, course_id: courseId },
          { onConflict: "student_id,course_id" }
        );
      }
    }
    setActionLoading(null);
    fetchAll();
  };

  const getCourseName = (courseId: string | null) => courseId ? paidCourses.find(c => c.id === courseId)?.title || "Unknown" : null;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {/* Insights */}
      <div className="flex gap-4 mb-2">
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <div className="space-y-0.5">
            {Object.keys(revenueByCurrency).length > 0 ? Object.entries(revenueByCurrency).map(([cur, amt]) => (
              <p key={cur} className="text-lg font-bold text-green-500">{amt.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{cur}</span></p>
            )) : <p className="text-2xl font-bold text-green-500">0.00</p>}
          </div>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-2xl font-bold text-primary">{approvedPayments.length}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <CreditCard className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-2xl font-bold">{avgPayment.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Avg Payment</p>
        </div>
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
          <p className="text-2xl font-bold text-yellow-500">{filteredPayments.filter(p => p.status === "pending").length}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Courses</option>
          {paidCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />{dateFrom ? format(dateFrom, "PP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className={cn("p-3 pointer-events-auto")} /></PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />{dateTo ? format(dateTo, "PP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={dateTo} onSelect={setDateTo} className={cn("p-3 pointer-events-auto")} /></PopoverContent>
        </Popover>
        {(filterCourse || dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterCourse(""); setDateFrom(undefined); setDateTo(undefined); }}>Clear filters</Button>
        )}
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-muted-foreground">No submissions match your filters.</p>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((p) => (
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
                }`}>{p.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="capitalize">{p.payment_method?.replace("_", " ")}</span>
                {p.amount != null && <span className="font-semibold text-foreground">{p.amount} {p.currency || "EGP"}</span>}
                {getCourseName(p.course_id) && <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{getCourseName(p.course_id)}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              {p.screenshot_url && p.screenshot_url !== "-" && (
                <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-sm hover:underline">
                  <Eye className="w-4 h-4" /> View Screenshot
                </a>
              )}
              {p.status === "pending" && (
                <div className="flex gap-2 pt-2 items-center flex-wrap">
                  <select value={approvalCourseMap[p.id] || ""} onChange={(e) => setApprovalCourseMap(prev => ({ ...prev, [p.id]: e.target.value }))} className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="">Assign course...</option>
                    {paidCourses.filter(c => c.is_active).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
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
  const [accessMap, setAccessMap] = useState<Record<string, any[]>>({});
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const fetchAll = async () => {
    setLoading(true);
    const [studentsRes, coursesRes, accessRes] = await Promise.all([
      supabase.from("course_students").select("*").order("created_at", { ascending: false }),
      supabase.from("paid_courses").select("*").order("title"),
      supabase.from("course_student_access").select("*"),
    ]);
    setStudents(studentsRes.data || []);
    setPaidCourses(coursesRes.data || []);
    const map: Record<string, any[]> = {};
    (accessRes.data || []).forEach((a: any) => { if (!map[a.student_id]) map[a.student_id] = []; map[a.student_id].push(a); });
    setAccessMap(map);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = !searchQuery || s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? s.is_active : !s.is_active);
      const matchesCourse = !filterCourse || (accessMap[s.id] || []).some((a: any) => a.course_id === filterCourse);
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, searchQuery, filterStatus, filterCourse, accessMap]);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("course_students").update({ is_active: !current }).eq("id", id);
    fetchAll();
  };

  const getCourseNames = (studentId: string) => {
    return (accessMap[studentId] || []).map((a: any) => paidCourses.find((c) => c.id === a.course_id)?.title).filter(Boolean);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Students ({students.length})</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
        </div>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Courses</option>
          {paidCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filteredStudents.length} students shown</p>
      {filteredStudents.map((s) => (
        <div key={s.id} className="glass rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">{s.full_name}</p>
            <p className="text-sm text-muted-foreground">{s.email} · Added via {s.added_by}</p>
            {getCourseNames(s.id).length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {getCourseNames(s.id).map((name, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{name}</span>
                ))}
              </div>
            )}
          </div>
          <Button variant={s.is_active ? "destructive" : "default"} size="sm" onClick={() => toggleActive(s.id, s.is_active)}>
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
    supabase.from("paid_courses").select("*").eq("is_active", true).order("title").then(({ data }) => setPaidCourses(data || []));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    const { data: studentData } = await supabase.from("course_students").upsert(
      { email: trimmedEmail, full_name: name, is_active: true, added_by: "team" },
      { onConflict: "email" }
    ).select("id").single();

    if (studentData) {
      await supabase.from("course_student_access").upsert(
        { student_id: studentData.id, course_id: selectedCourseId },
        { onConflict: "student_id,course_id" }
      );
    }

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
    <div className="max-w-lg">
      <h2 className="text-lg font-bold mb-4">Add Student Manually</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" /></div>
        <div>
          <Label>Course *</Label>
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select course</option>
            {paidCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label>Amount Paid</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" placeholder="0.00" />
          </div>
          <div className="w-[100px]">
            <Label>Currency</Label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="EGP">EGP</option><option value="USD">USD</option><option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        {success && <p className="text-green-500 text-sm">Student added successfully!</p>}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add Student
        </Button>
      </form>
    </div>
  );
}

export default EmployeeDashboard;
