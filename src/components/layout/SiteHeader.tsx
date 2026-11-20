import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KNMark } from "@/components/brand/KNMark";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const links = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "courses", to: "/courses" },
  { key: "projects", to: "/projects" },
  { key: "contact", to: "/contact" },
] as const;

export default function SiteHeader() {
  const { t, locale, setLocale } = useLanguage();
  const brand = getBrand(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const label = (key: (typeof links)[number]["key"]) => t.nav[key];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-card",
        scrolled && "shadow-sm",
      )}
    >
      <div className="section-container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <KNMark size="sm" />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-extrabold tracking-wide text-navy">{brand.name}</span>
            <span className="block truncate text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {brand.specialty}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-navy",
                  isActive && "text-navy",
                )
              }
            >
              {label(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex rounded-md border border-border p-0.5 text-xs font-semibold">
            <button
              type="button"
              className={cn("rounded px-2.5 py-1.5 transition-colors", locale === "en" ? "bg-secondary text-navy" : "text-muted-foreground")}
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={cn("rounded px-2.5 py-1.5 transition-colors", locale === "ar" ? "bg-secondary text-navy" : "text-muted-foreground")}
              onClick={() => setLocale("ar")}
              aria-pressed={locale === "ar"}
            >
              ع
            </button>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/course/learn">{t.nav.studentLogin}</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={brand.coursePath}>{t.nav.exploreCourse}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="section-container flex flex-col gap-1 py-4" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-3 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-navy",
                    isActive && "bg-secondary text-navy",
                  )
                }
              >
                {label(link.key)}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className={cn("rounded-md border px-3 py-2 text-sm", locale === "en" ? "border-primary text-navy" : "border-border text-muted-foreground")}
                onClick={() => setLocale("en")}
              >
                English
              </button>
              <button
                type="button"
                className={cn("rounded-md border px-3 py-2 text-sm", locale === "ar" ? "border-primary text-navy" : "border-border text-muted-foreground")}
                onClick={() => setLocale("ar")}
              >
                العربية
              </button>
            </div>
            <Button asChild variant="outline" className="mt-3">
              <Link to="/course/learn" onClick={() => setOpen(false)}>
                {t.nav.studentLogin}
              </Link>
            </Button>
            <Button asChild className="mt-2">
              <Link to={brand.coursePath} onClick={() => setOpen(false)}>
                {t.nav.exploreCourse}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
