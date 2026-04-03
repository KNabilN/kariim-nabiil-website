import { useState, useEffect, useMemo } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProjects, defaultProjects, type Project } from "@/data/projects";
import {
  useHeroContent, useStats, useCourses,
  defaultHeroContent, defaultStats, defaultCourses,
  type HeroContent, type StatItem, type CourseItem,
} from "@/data/siteContent";
import {
  LogOut, Plus, Trash2, Save, RotateCcw, Loader2, Upload, Users,
  Briefcase, GraduationCap, ChevronDown, ChevronRight, CreditCard,
  Check, X, Eye, Clock, UserMinus, UserPlus, Search, CalendarIcon,
  DollarSign, TrendingUp, BookOpen,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Main Admin Component ──────────────────────────────────────────
const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const { projects, saveProjects } = useProjects();
  const { data: hero, save: saveHero } = useHeroContent();
  const { data: stats, save: saveStats } = useStats();
  const { data: courses, save: saveCourses } = useCourses();

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
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
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
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
        <p className="text-muted-foreground text-center text-sm mb-8">Sign in with your admin account</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><Label htmlFor="admin-email">Email</Label><Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" /></div>
          <div><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" /></div>
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
        <p className="text-muted-foreground text-sm mb-6">You don't have admin privileges.</p>
        <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
      </header>
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="portfolio">
          <TabsList className="mb-8">
            <TabsTrigger value="portfolio"><Briefcase className="w-4 h-4 mr-1.5" /> Portfolio</TabsTrigger>
            <TabsTrigger value="course"><GraduationCap className="w-4 h-4 mr-1.5" /> Advanced Course</TabsTrigger>
            <TabsTrigger value="employees"><Users className="w-4 h-4 mr-1.5" /> Employees</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio">
            <PortfolioTab projects={projects} saveProjects={saveProjects} hero={hero} saveHero={saveHero} stats={stats} saveStats={saveStats} courses={courses} saveCourses={saveCourses} />
          </TabsContent>
          <TabsContent value="course">
            <AdvancedCourseTab userId={session.user.id} />
          </TabsContent>
          <TabsContent value="employees">
            <EmployeesTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ─── Collapsible Section ──────────────────────────────────────────
function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors">
        <h2 className="text-lg font-bold">{title}</h2>
        {open ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// ─── Portfolio Tab ──────────────────────────────────────────────
function PortfolioTab({ projects, saveProjects, hero, saveHero, stats, saveStats, courses, saveCourses }: {
  projects: Project[]; saveProjects: (p: Project[]) => void;
  hero: HeroContent; saveHero: (h: HeroContent) => void;
  stats: StatItem[]; saveStats: (s: StatItem[]) => void;
  courses: CourseItem[]; saveCourses: (c: CourseItem[]) => void;
}) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="Hero Section" defaultOpen><HeroEditor hero={hero} onSave={saveHero} /></CollapsibleSection>
      <CollapsibleSection title={`Projects (${projects.length})`}><ProjectsEditor projects={projects} onSave={saveProjects} /></CollapsibleSection>
      <CollapsibleSection title={`Stats (${stats.length})`}><StatsEditor stats={stats} onSave={saveStats} /></CollapsibleSection>
      <CollapsibleSection title={`Courses (${courses.length})`}><CoursesEditor courses={courses} onSave={saveCourses} /></CollapsibleSection>
    </div>
  );
}

// ─── Advanced Course Tab ──────────────────────────────────────────
function AdvancedCourseTab({ userId }: { userId: string }) {
  return (
    <Tabs defaultValue="courses-mgmt">
      <TabsList className="mb-6">
        <TabsTrigger value="courses-mgmt"><BookOpen className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
        <TabsTrigger value="content"><Upload className="w-4 h-4 mr-1" /> Content</TabsTrigger>
        <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" /> Students</TabsTrigger>
        <TabsTrigger value="payments"><CreditCard className="w-4 h-4 mr-1" /> Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="courses-mgmt"><PaidCoursesManager /></TabsContent>
      <TabsContent value="content"><CourseContentEditor /></TabsContent>
      <TabsContent value="students"><CourseStudentsSection /></TabsContent>
      <TabsContent value="payments"><CoursePaymentsSection userId={userId} /></TabsContent>
    </Tabs>
  );
}

// ─── Paid Courses Manager ──────────────────────────────────────────
function PaidCoursesManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from("paid_courses").select("*").order("created_at", { ascending: false });
    setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await supabase.from("paid_courses").insert({ title: title.trim(), price: price ? parseFloat(price) : 0, currency });
    setTitle(""); setPrice(""); setSaving(false);
    fetchCourses();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("paid_courses").update({ is_active: !current }).eq("id", id);
    fetchCourses();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Paid Course</h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Course Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" placeholder="e.g. Advanced n8n" />
          </div>
          <div className="w-[120px]">
            <Label>Price</Label>
            <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" placeholder="0.00" />
          </div>
          <div className="w-[90px]">
            <Label>Currency</Label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="EGP">EGP</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="SAR">SAR</option>
            </select>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} Add
          </Button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Paid Courses ({courses.length})</h3>
        {courses.map((c) => (
          <div key={c.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.price} {c.currency} · {c.is_active ? "Active" : "Inactive"}</p>
            </div>
            <Button variant={c.is_active ? "destructive" : "default"} size="sm" onClick={() => toggleActive(c.id, c.is_active)}>
              {c.is_active ? "Deactivate" : "Activate"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Course Students Section ──────────────────────────────────────
function CourseStudentsSection() {
  const [students, setStudents] = useState<any[]>([]);
  const [accessMap, setAccessMap] = useState<Record<string, any[]>>({});
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  // Filters
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
    (accessRes.data || []).forEach((a: any) => {
      if (!map[a.student_id]) map[a.student_id] = [];
      map[a.student_id].push(a);
    });
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    setAddLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    // Upsert student
    const { data: studentData } = await supabase.from("course_students").upsert(
      { email: trimmedEmail, full_name: name, is_active: true, added_by: "admin" },
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

    setAddLoading(false);
    setAddSuccess(true);
    setName(""); setEmail(""); setAmount(""); setSelectedCourseId("");
    setTimeout(() => setAddSuccess(false), 3000);
    fetchAll();
  };

  const getCourseNames = (studentId: string) => {
    const accesses = accessMap[studentId] || [];
    return accesses.map((a: any) => paidCourses.find((c) => c.id === a.course_id)?.title).filter(Boolean);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <p className="text-3xl font-bold text-primary">{students.length}</p>
          <p className="text-sm text-muted-foreground">Total Students</p>
        </div>
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <p className="text-3xl font-bold text-green-500">{students.filter(s => s.is_active).length}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="glass rounded-xl p-4 flex-1 text-center">
          <p className="text-3xl font-bold text-destructive">{students.filter(s => !s.is_active).length}</p>
          <p className="text-sm text-muted-foreground">Inactive</p>
        </div>
      </div>

      {/* Add Student Form */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add Student</h3>
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
              {paidCourses.filter(c => c.is_active).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="w-[100px]">
            <Label>Amount</Label>
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" placeholder="0.00" />
          </div>
          <div className="w-[80px]">
            <Label>Currency</Label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="EGP">EGP</option><option value="USD">USD</option><option value="EUR">EUR</option>
            </select>
          </div>
          <Button type="submit" disabled={addLoading}>
            {addLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />} Add
          </Button>
        </form>
        {addSuccess && <p className="text-green-500 text-sm mt-2">Student added successfully!</p>}
      </div>

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

      {/* Student List */}
      <div className="space-y-3">
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
    </div>
  );
}

// ─── Course Payments Section ──────────────────────────────────────
function CoursePaymentsSection({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // Filters
  const [filterCourse, setFilterCourse] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  // Course assignment for approval
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

    await supabase.from("payment_submissions")
      .update({ status, reviewed_by: userId, reviewed_at: new Date().toISOString(), course_id: courseId })
      .eq("id", id);

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

  const getCourseName = (courseId: string | null) => {
    if (!courseId) return null;
    return paidCourses.find(c => c.id === courseId)?.title || "Unknown";
  };

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
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        {(filterCourse || dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterCourse(""); setDateFrom(undefined); setDateTo(undefined); }}>
            Clear filters
          </Button>
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
                }`}>
                  {p.status}
                </span>
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
                  <select
                    value={approvalCourseMap[p.id] || ""}
                    onChange={(e) => setApprovalCourseMap(prev => ({ ...prev, [p.id]: e.target.value }))}
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
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

// ─── Employees Tab ──────────────────────────────────────────────
function EmployeesTab({ session }: { session: any }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data } = await supabase.from("user_roles").select("*").eq("role", "team");
    setEmployees(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess(false);
    const { data, error } = await supabase.functions.invoke("invite-employee", { body: { name, email, password } });
    if (error || data?.error) {
      setAddError(data?.error || error?.message || "Failed to add employee");
    } else {
      setAddSuccess(true);
      setName(""); setEmail(""); setPassword("");
      fetchEmployees();
      setTimeout(() => setAddSuccess(false), 3000);
    }
    setAddLoading(false);
  };

  const handleDelete = async (userId: string) => {
    setDeleteLoading(userId);
    await supabase.functions.invoke("invite-employee", { body: { action: "delete", userId } });
    setDeleteLoading(null);
    fetchEmployees();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="max-w-md">
        <h2 className="text-lg font-bold mb-4">Add Employee</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" placeholder="Employee name" /></div>
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" placeholder="employee@example.com" /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" placeholder="Min 6 characters" minLength={6} /></div>
          {addError && <p className="text-destructive text-sm">{addError}</p>}
          {addSuccess && <p className="text-green-500 text-sm">Employee added successfully!</p>}
          <Button type="submit" disabled={addLoading}>{addLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Plus className="w-4 h-4 mr-1" /> Add Employee</Button>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">Team Members ({employees.length})</h2>
        {employees.length === 0 ? <p className="text-muted-foreground">No employees added yet.</p> : (
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{emp.user_id}</p>
                  <p className="text-xs text-muted-foreground">Role: {emp.role}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(emp.user_id)} disabled={deleteLoading === emp.user_id}>
                  {deleteLoading === emp.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />} Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Project Editor ──────────────────────────────────────────────
function ProjectsEditor({ projects, onSave }: { projects: Project[]; onSave: (p: Project[]) => void }) {
  const [items, setItems] = useState<Project[]>(projects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const updateField = (id: string, field: keyof Project, value: any) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const addProject = () => {
    const np: Project = { id: Date.now().toString(), title: "New Project", description: "", fullDescription: "", tools: [], domain: "", country: "", highlight: "", challenges: "", results: "", images: [] };
    setItems([...items, np]);
    setEditingId(np.id);
  };
  const removeProject = (id: string) => setItems(items.filter((p) => p.id !== id));
  const save = () => onSave(items);
  const reset = () => { setItems(defaultProjects); onSave(defaultProjects); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
        <Button variant="outline" size="sm" onClick={addProject}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>
      {items.map((project) => (
        <div key={project.id} className="border border-border/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold cursor-pointer hover:text-primary transition-colors" onClick={() => setEditingId(editingId === project.id ? null : project.id)}>
              {project.title || "Untitled Project"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          {editingId === project.id && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2"><Label>Title</Label><Input value={project.title} onChange={(e) => updateField(project.id, "title", e.target.value)} className="mt-1" /></div>
              <div><Label>Domain</Label><Input value={project.domain} onChange={(e) => updateField(project.id, "domain", e.target.value)} className="mt-1" /></div>
              <div><Label>Country</Label><Input value={project.country} onChange={(e) => updateField(project.id, "country", e.target.value)} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Short Description</Label><Textarea value={project.description} onChange={(e) => updateField(project.id, "description", e.target.value)} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Full Description</Label><Textarea value={project.fullDescription} onChange={(e) => updateField(project.id, "fullDescription", e.target.value)} className="mt-1" rows={4} /></div>
              <div className="md:col-span-2"><Label>Highlight</Label><Input value={project.highlight} onChange={(e) => updateField(project.id, "highlight", e.target.value)} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Tools (comma-separated)</Label><Input value={project.tools.join(", ")} onChange={(e) => updateField(project.id, "tools", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Challenges</Label><Textarea value={project.challenges} onChange={(e) => updateField(project.id, "challenges", e.target.value)} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Results</Label><Textarea value={project.results} onChange={(e) => updateField(project.id, "results", e.target.value)} className="mt-1" /></div>
              <div className="md:col-span-2">
                <Label>Images</Label>
                <div className="mt-1 space-y-2">
                  {(project.images || []).map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={url} readOnly className="flex-1 text-xs" />
                      <img src={url} alt="" className="w-10 h-10 rounded object-cover bg-secondary/20" />
                      <Button variant="ghost" size="sm" onClick={() => { const u = [...(project.images || [])]; u.splice(idx, 1); updateField(project.id, "images", u); }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input placeholder="Paste image URL..." id={`img-input-${project.id}`} className="flex-1" onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) { updateField(project.id, "images", [...(project.images || []), e.currentTarget.value.trim()]); e.currentTarget.value = ""; } }} />
                    <Button variant="outline" size="sm" onClick={() => { const input = document.getElementById(`img-input-${project.id}`) as HTMLInputElement; if (input?.value.trim()) { updateField(project.id, "images", [...(project.images || []), input.value.trim()]); input.value = ""; } }}><ImagePlus className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Hero Editor ──────────────────────────────────────────────
function HeroEditor({ hero, onSave }: { hero: HeroContent; onSave: (h: HeroContent) => void }) {
  const [data, setData] = useState(hero);
  const update = (field: keyof HeroContent, value: string) => setData({ ...data, [field]: value });
  const save = () => onSave(data);
  const reset = () => { setData(defaultHeroContent); onSave(defaultHeroContent); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
        <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>
      <div className="grid gap-4">
        {(Object.keys(data) as (keyof HeroContent)[]).map((key) => (
          <div key={key}>
            <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
            {data[key].length > 80 ? <Textarea value={data[key]} onChange={(e) => update(key, e.target.value)} className="mt-1" /> : <Input value={data[key]} onChange={(e) => update(key, e.target.value)} className="mt-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Editor ──────────────────────────────────────────────
function StatsEditor({ stats, onSave }: { stats: StatItem[]; onSave: (s: StatItem[]) => void }) {
  const [items, setItems] = useState(stats);
  const updateField = (id: string, field: keyof StatItem, value: string) => setItems((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const save = () => onSave(items);
  const reset = () => { setItems(defaultStats); onSave(defaultStats); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
        <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>
      {items.map((stat) => (
        <div key={stat.id} className="border border-border/50 rounded-xl p-4 grid gap-3 md:grid-cols-2">
          <div><Label>Value</Label><Input value={stat.value} onChange={(e) => updateField(stat.id, "value", e.target.value)} className="mt-1" /></div>
          <div><Label>Label</Label><Input value={stat.label} onChange={(e) => updateField(stat.id, "label", e.target.value)} className="mt-1" /></div>
          <div><Label>Description</Label><Input value={stat.description} onChange={(e) => updateField(stat.id, "description", e.target.value)} className="mt-1" /></div>
          <div><Label>Link (optional)</Label><Input value={stat.link || ""} onChange={(e) => updateField(stat.id, "link", e.target.value)} className="mt-1" /></div>
        </div>
      ))}
    </div>
  );
}

// ─── Courses Editor ──────────────────────────────────────────────
function CoursesEditor({ courses, onSave }: { courses: CourseItem[]; onSave: (c: CourseItem[]) => void }) {
  const [items, setItems] = useState(courses);
  const updateField = (id: string, field: keyof CourseItem, value: any) => setItems((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  const addCourse = () => { setItems([...items, { id: Date.now().toString(), title: "", platform: "", description: "", link: "", features: [], isFree: false }]); };
  const removeCourse = (id: string) => setItems(items.filter((c) => c.id !== id));
  const save = () => onSave(items);
  const reset = () => { setItems(defaultCourses); onSave(defaultCourses); };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
        <Button variant="outline" size="sm" onClick={addCourse}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>
      {items.map((course) => (
        <div key={course.id} className="border border-border/50 rounded-xl p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{course.title || "Untitled"}</h3>
            <Button variant="ghost" size="sm" onClick={() => removeCourse(course.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Title</Label><Input value={course.title} onChange={(e) => updateField(course.id, "title", e.target.value)} className="mt-1" /></div>
            <div><Label>Platform</Label><Input value={course.platform} onChange={(e) => updateField(course.id, "platform", e.target.value)} className="mt-1" /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea value={course.description} onChange={(e) => updateField(course.id, "description", e.target.value)} className="mt-1" /></div>
            <div><Label>Link</Label><Input value={course.link} onChange={(e) => updateField(course.id, "link", e.target.value)} className="mt-1" /></div>
            <div className="flex items-center gap-2 self-end"><input type="checkbox" checked={course.isFree} onChange={(e) => updateField(course.id, "isFree", e.target.checked)} /><Label>Free course</Label></div>
            <div className="md:col-span-2"><Label>Features (comma-separated)</Label><Input value={course.features.join(", ")} onChange={(e) => updateField(course.id, "features", e.target.value.split(",").map((f) => f.trim()).filter(Boolean))} className="mt-1" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Course Content Editor ──────────────────────────────────────
function CourseContentEditor() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [paidCourses, setPaidCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [chapRes, coursesRes] = await Promise.all([
      supabase.from("course_chapters").select("*").order("order_index"),
      supabase.from("paid_courses").select("*").order("title"),
    ]);
    setChapters(chapRes.data || []);
    setPaidCourses(coursesRes.data || []);
    if (!selectedCourseId && (coursesRes.data || []).length > 0) {
      setSelectedCourseId(coursesRes.data![0].id);
    }
    setLoading(false);
  };
  useEffect(() => { fetchAll(); }, []);

  const filteredChapters = useMemo(() => {
    if (!selectedCourseId) return chapters;
    return chapters.filter(ch => ch.course_id === selectedCourseId);
  }, [chapters, selectedCourseId]);

  const addChapter = async () => {
    if (!selectedCourseId) return;
    setSaving(true);
    await supabase.from("course_chapters").insert({ title: newTitle || "New Chapter", description: newDesc || null, youtube_url: newUrl || null, order_index: filteredChapters.length, is_published: false, course_id: selectedCourseId });
    setNewTitle(""); setNewDesc(""); setNewUrl(""); setSaving(false); fetchAll();
  };
  const updateChapter = async (id: string, updates: Record<string, any>) => { await supabase.from("course_chapters").update(updates).eq("id", id); fetchAll(); };
  const deleteChapter = async (id: string) => { await supabase.from("course_chapters").delete().eq("id", id); fetchAll(); };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold">Course Chapters ({filteredChapters.length})</h2>
        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All courses</option>
          {paidCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourseId && (
      <div className="glass rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Add New Chapter</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Title</Label><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mt-1" placeholder="Chapter title" /></div>
          <div><Label>YouTube URL</Label><Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="mt-1" placeholder="https://youtube.com/watch?v=..." /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="mt-1" placeholder="Optional description" /></div>
        </div>
        <Button onClick={addChapter} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}<Plus className="w-4 h-4 mr-1" /> Add Chapter</Button>
      </div>
      )}

      {!selectedCourseId && <p className="text-muted-foreground text-sm">Select a course to add chapters.</p>}

      {filteredChapters.map((ch) => (
        <div key={ch.id} className="glass rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold cursor-pointer hover:text-primary transition-colors" onClick={() => setEditingId(editingId === ch.id ? null : ch.id)}>{ch.title}</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => updateChapter(ch.id, { is_published: !ch.is_published })}>{ch.is_published ? "Unpublish" : "Publish"}</Button>
              <Button variant="ghost" size="sm" onClick={() => deleteChapter(ch.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${ch.is_published ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>{ch.is_published ? "Published" : "Draft"}</span>
            <span>Order: {ch.order_index}</span>
          </div>
          {editingId === ch.id && (
            <div className="grid gap-3 md:grid-cols-2 pt-2">
              <div><Label>Title</Label><Input defaultValue={ch.title} onBlur={(e) => updateChapter(ch.id, { title: e.target.value })} className="mt-1" /></div>
              <div><Label>YouTube URL</Label><Input defaultValue={ch.youtube_url || ""} onBlur={(e) => updateChapter(ch.id, { youtube_url: e.target.value || null })} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea defaultValue={ch.description || ""} onBlur={(e) => updateChapter(ch.id, { description: e.target.value || null })} className="mt-1" /></div>
              <div><Label>Order Index</Label><Input type="number" defaultValue={ch.order_index} onBlur={(e) => updateChapter(ch.id, { order_index: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <ChapterResourcesEditor chapterId={ch.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Chapter Resources Editor ──────────────────────────────────────
function ChapterResourcesEditor({ chapterId }: { chapterId: string }) {
  const [resources, setResources] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fetchResources = async () => { const { data } = await supabase.from("chapter_resources").select("*").eq("chapter_id", chapterId); setResources(data || []); };
  useEffect(() => { fetchResources(); }, [chapterId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${chapterId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("course-resources").upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from("course-resources").getPublicUrl(fileName);
      await supabase.from("chapter_resources").insert({ chapter_id: chapterId, title: file.name, file_url: urlData.publicUrl, file_type: file.type, file_size: file.size });
      fetchResources();
    }
    setUploading(false);
  };

  const deleteResource = async (id: string) => { await supabase.from("chapter_resources").delete().eq("id", id); fetchResources(); };

  return (
    <div className="md:col-span-2 space-y-2">
      <Label>Resources</Label>
      {resources.map((r) => (
        <div key={r.id} className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2 text-sm">
          <span>{r.title}</span>
          <Button variant="ghost" size="sm" onClick={() => deleteResource(r.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
        </div>
      ))}
      <label className="flex items-center gap-2 cursor-pointer text-primary text-sm hover:underline">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "Uploading..." : "Upload Resource"}
        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

export default Admin;
