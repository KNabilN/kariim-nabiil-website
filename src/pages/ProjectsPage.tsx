import PageHero from "@/components/layout/PageHero";
import { getProjects } from "@/data/projects";
import { useCmsBrand, useCmsProjects } from "@/hooks/useSiteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getBrand } from "@/lib/brand";

export default function ProjectsPage() {
  const { t, locale } = useLanguage();
  const { data: brandCms } = useCmsBrand(locale);
  const { data: projectsCms } = useCmsProjects(locale);
  const brand = brandCms || getBrand(locale);
  const projects = projectsCms || getProjects(locale);

  return (
    <>
      <PageHero eyebrow={brand.specialty} title={t.pages.projectsTitle} description={t.projects.heading} />
      <section className="section-shell">
        <div className="section-container grid gap-5">
          {projects.map((project) => (
            <article key={project.id} className="rounded-md border border-border bg-card p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                {project.domain} · {project.country}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-navy">{project.title}</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-bold text-navy">{t.projects.problem}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{project.challenges || project.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">{t.projects.approach}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{project.highlight}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span key={tool} className="rounded bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">{t.projects.outcome}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{project.results}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
