import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/data/projects";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function FeaturedProjects() {
  const { t, locale } = useLanguage();
  const projects = getProjects(locale);
  const [lead, ...rest] = projects.slice(0, 3);

  if (!lead) return null;

  return (
    <section className="section-shell">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">04</p>
            <h2 className="section-title mt-4 max-w-2xl">{t.projects.heading}</h2>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
            {t.projects.cta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <article className="mt-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,hsl(217_91%_60%/0.16),transparent_42%),#0d172b] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan">{lead.domain}</p>
          <h3 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">{lead.title}</h3>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{lead.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {lead.tools.map((tool) => (
              <span key={tool} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {tool}
              </span>
            ))}
          </div>
        </article>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((project) => (
            <article key={project.id} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{project.domain}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
