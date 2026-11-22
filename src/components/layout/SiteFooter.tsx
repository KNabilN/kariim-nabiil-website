import { Link } from "react-router-dom";
import { KNMark } from "@/components/brand/KNMark";
import { getCatalogCourses } from "@/data/courses";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function SiteFooter() {
  const { t, locale } = useLanguage();
  const brand = getBrand(locale);
  const courses = getCatalogCourses(locale);

  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <div className="section-container flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-3">
            <KNMark size="sm" />
            <div>
              <p className="text-sm font-extrabold tracking-wide text-white">{brand.name}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">{brand.specialty}</p>
            </div>
          </div>
          <p className="text-sm text-white/70">{t.footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-semibold text-white">{t.nav.courses}</p>
            {courses.map((course) =>
              course.external ? (
                <a
                  key={course.id}
                  href={course.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/70 hover:text-white"
                >
                  {course.title}
                </a>
              ) : (
                <Link key={course.id} to={course.href} className="block text-white/70 hover:text-white">
                  {course.title}
                </Link>
              ),
            )}
            <Link to="/course/learn" className="block text-white/70 hover:text-white">
              {t.nav.studentLogin}
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-white">{t.nav.projects}</p>
            <Link to="/projects" className="block text-white/70 hover:text-white">
              {t.nav.projects}
            </Link>
            <Link to="/about" className="block text-white/70 hover:text-white">
              {t.nav.about}
            </Link>
            <Link to="/contact" className="block text-white/70 hover:text-white">
              {t.nav.contact}
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-white">{t.nav.contact}</p>
            <a href={brand.youtube} target="_blank" rel="noopener noreferrer" className="block text-white/70 hover:text-white">
              YouTube
            </a>
            <a href={brand.linkedin} target="_blank" rel="noopener noreferrer" className="block text-white/70 hover:text-white">
              LinkedIn
            </a>
            <a href={brand.tiktok} target="_blank" rel="noopener noreferrer" className="block text-white/70 hover:text-white">
              TikTok
            </a>
            <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="block text-white/70 hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-container flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
          </p>
          <p className="font-medium text-white/80">{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
