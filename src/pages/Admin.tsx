import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects, defaultProjects, type Project } from "@/data/projects";
import {
  useHeroContent, useStats, useCourses,
  defaultHeroContent, defaultStats, defaultCourses,
  type HeroContent, type StatItem, type CourseItem,
} from "@/data/siteContent";
import { LogOut, Plus, Trash2, Save, RotateCcw } from "lucide-react";

const CREDENTIALS = { username: "karimnouh112", password: "admin112" };

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const { projects, saveProjects } = useProjects();
  const { data: hero, save: saveHero } = useHeroContent();
  const { data: stats, save: saveStats } = useStats();
  const { data: courses, save: saveCourses } = useCourses();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      sessionStorage.setItem("admin_auth", "true");
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">Enter your credentials to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="projects">
          <TabsList className="mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <ProjectsEditor projects={projects} onSave={saveProjects} />
          </TabsContent>

          {/* HERO TAB */}
          <TabsContent value="hero">
            <HeroEditor hero={hero} onSave={saveHero} />
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats">
            <StatsEditor stats={stats} onSave={saveStats} />
          </TabsContent>

          {/* COURSES TAB */}
          <TabsContent value="courses">
            <CoursesEditor courses={courses} onSave={saveCourses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ─── Project Editor ──────────────────────────────────────────────
function ProjectsEditor({ projects, onSave }: { projects: Project[]; onSave: (p: Project[]) => void }) {
  const [items, setItems] = useState<Project[]>(projects);
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (id: string, field: keyof Project, value: any) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "",
      fullDescription: "",
      tools: [],
      domain: "",
      country: "",
      highlight: "",
      challenges: "",
      results: "",
    };
    setItems([...items, newProject]);
    setEditingId(newProject.id);
  };

  const removeProject = (id: string) => {
    setItems(items.filter((p) => p.id !== id));
  };

  const save = () => { onSave(items); };
  const reset = () => { setItems(defaultProjects); onSave(defaultProjects); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Projects ({items.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          <Button variant="outline" size="sm" onClick={addProject}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>

      {items.map((project) => (
        <div key={project.id} className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditingId(editingId === project.id ? null : project.id)}
            >
              {project.title || "Untitled Project"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          {editingId === project.id && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={project.title} onChange={(e) => updateField(project.id, "title", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Domain</Label>
                <Input value={project.domain} onChange={(e) => updateField(project.id, "domain", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={project.country} onChange={(e) => updateField(project.id, "country", e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Short Description</Label>
                <Textarea value={project.description} onChange={(e) => updateField(project.id, "description", e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Full Description</Label>
                <Textarea value={project.fullDescription} onChange={(e) => updateField(project.id, "fullDescription", e.target.value)} className="mt-1" rows={4} />
              </div>
              <div className="md:col-span-2">
                <Label>Highlight</Label>
                <Input value={project.highlight} onChange={(e) => updateField(project.id, "highlight", e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Tools (comma-separated)</Label>
                <Input value={project.tools.join(", ")} onChange={(e) => updateField(project.id, "tools", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Challenges</Label>
                <Textarea value={project.challenges} onChange={(e) => updateField(project.id, "challenges", e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Results</Label>
                <Textarea value={project.results} onChange={(e) => updateField(project.id, "results", e.target.value)} className="mt-1" />
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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Hero Section</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      <div className="glass rounded-xl p-6 grid gap-4">
        {(Object.keys(data) as (keyof HeroContent)[]).map((key) => (
          <div key={key}>
            <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
            {data[key].length > 80 ? (
              <Textarea value={data[key]} onChange={(e) => update(key, e.target.value)} className="mt-1" />
            ) : (
              <Input value={data[key]} onChange={(e) => update(key, e.target.value)} className="mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Editor ──────────────────────────────────────────────
function StatsEditor({ stats, onSave }: { stats: StatItem[]; onSave: (s: StatItem[]) => void }) {
  const [items, setItems] = useState(stats);
  const updateField = (id: string, field: keyof StatItem, value: string) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const save = () => onSave(items);
  const reset = () => { setItems(defaultStats); onSave(defaultStats); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Stats</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      {items.map((stat) => (
        <div key={stat.id} className="glass rounded-xl p-6 grid gap-3 md:grid-cols-2">
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
  const updateField = (id: string, field: keyof CourseItem, value: any) =>
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const addCourse = () => {
    setItems([...items, { id: Date.now().toString(), title: "", platform: "", description: "", link: "", features: [], isFree: false }]);
  };
  const removeCourse = (id: string) => setItems(items.filter((c) => c.id !== id));
  const save = () => onSave(items);
  const reset = () => { setItems(defaultCourses); onSave(defaultCourses); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Courses ({items.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
          <Button variant="outline" size="sm" onClick={addCourse}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          <Button size="sm" onClick={save}><Save className="w-4 h-4 mr-1" /> Save</Button>
        </div>
      </div>
      {items.map((course) => (
        <div key={course.id} className="glass rounded-xl p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{course.title || "Untitled"}</h3>
            <Button variant="ghost" size="sm" onClick={() => removeCourse(course.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Title</Label><Input value={course.title} onChange={(e) => updateField(course.id, "title", e.target.value)} className="mt-1" /></div>
            <div><Label>Platform</Label><Input value={course.platform} onChange={(e) => updateField(course.id, "platform", e.target.value)} className="mt-1" /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea value={course.description} onChange={(e) => updateField(course.id, "description", e.target.value)} className="mt-1" /></div>
            <div><Label>Link</Label><Input value={course.link} onChange={(e) => updateField(course.id, "link", e.target.value)} className="mt-1" /></div>
            <div className="flex items-center gap-2 self-end">
              <input type="checkbox" checked={course.isFree} onChange={(e) => updateField(course.id, "isFree", e.target.checked)} />
              <Label>Free course</Label>
            </div>
            <div className="md:col-span-2"><Label>Features (comma-separated)</Label><Input value={course.features.join(", ")} onChange={(e) => updateField(course.id, "features", e.target.value.split(",").map((f) => f.trim()).filter(Boolean))} className="mt-1" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;
