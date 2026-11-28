import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  CreditCard,
  GraduationCap,
  Home,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Quote,
  Star,
  Users,
  X,
  BadgeCheck,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KNMark } from "@/components/brand/KNMark";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  onSignOut: () => void;
  children?: ReactNode;
}

const navGroups = [
  {
    key: "site" as const,
    items: [
      { to: "/admin", end: true, icon: LayoutDashboard, labelKey: "overview" as const },
      { to: "/admin/home", icon: Home, labelKey: "navHome" as const },
      { to: "/admin/catalog", icon: BookOpen, labelKey: "navCatalog" as const },
      { to: "/admin/projects", icon: FolderKanban, labelKey: "navProjects" as const },
      { to: "/admin/cv", icon: Briefcase, labelKey: "navCv" as const },
      { to: "/admin/gallery", icon: ImageIcon, labelKey: "navGallery" as const },
      { to: "/admin/course-reviews", icon: Quote, labelKey: "navCourseReviews" as const },
      { to: "/admin/brand", icon: Sparkles, labelKey: "navBrand" as const },
    ],
  },
  {
    key: "leads" as const,
    items: [
      { to: "/admin/leads", icon: MessageSquare, labelKey: "navLeads" as const },
      { to: "/admin/feedback", icon: Star, labelKey: "navFeedback" as const },
    ],
  },
  {
    key: "lms" as const,
    items: [
      { to: "/admin/lms/courses", icon: GraduationCap, labelKey: "navPaidCourses" as const },
      { to: "/admin/lms/content", icon: BookOpen, labelKey: "navContent" as const },
      { to: "/admin/lms/students", icon: Users, labelKey: "navStudents" as const },
      { to: "/admin/lms/payments", icon: CreditCard, labelKey: "navPayments" as const },
    ],
  },
  {
    key: "team" as const,
    items: [{ to: "/admin/employees", icon: BadgeCheck, labelKey: "navEmployees" as const }],
  },
];

export default function AdminShell({ onSignOut }: AdminShellProps) {
  const { t, locale, setLocale } = useLanguage();
  const a = t.admin;
  const [open, setOpen] = useState(false);

  const groupTitle = (key: (typeof navGroups)[number]["key"]) => {
    if (key === "site") return a.groupSite;
    if (key === "leads") return a.groupLeads;
    if (key === "lms") return a.groupLms;
    return a.groupTeam;
  };

  const Nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      {navGroups.map((group) => (
        <div key={group.key}>
          <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{groupTitle(group.key)}</p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const label = item.labelKey === "overview" ? a.overview : a[item.labelKey];
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-navy",
                      isActive && "bg-primary/10 text-primary",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-e border-border bg-card lg:flex lg:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <KNMark size="sm" />
          <div>
            <p className="text-sm font-extrabold text-navy">{a.title}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Admin</p>
          </div>
        </div>
        {Nav}
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-card px-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-4 w-4" />
            </Button>
            <p className="text-sm font-bold text-navy lg:hidden">{a.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border p-0.5 text-xs font-semibold">
              <button type="button" className={cn("rounded px-2 py-1", locale === "en" && "bg-secondary text-navy")} onClick={() => setLocale("en")}>
                EN
              </button>
              <button type="button" className={cn("rounded px-2 py-1", locale === "ar" && "bg-secondary text-navy")} onClick={() => setLocale("ar")}>
                ع
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="me-1.5 h-4 w-4" />
              {a.logout}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 flex w-[280px] flex-col border-e border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-bold text-navy">{a.title}</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {Nav}
          </div>
        </div>
      )}
    </div>
  );
}
