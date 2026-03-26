import { useState } from "react";
import { MapPin, Wrench, X, Sparkles, Target, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjects, type Project } from "@/data/projects";

const Projects = () => {
  const { projects } = useProjects();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="section-padding relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            My Work
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real AI solutions delivered to clients across the globe — from legal tech to sales automation.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelected(project)}
              className="group glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {project.domain}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {project.country}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                {project.description}
              </p>

              {/* Highlight */}
              <div className="text-xs text-primary/80 font-medium mb-4 italic">
                ✨ {project.highlight}
              </div>

              {/* Tools */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tools.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 text-[10px] font-medium rounded bg-secondary/50 text-secondary-foreground"
                  >
                    {tool}
                  </span>
                ))}
                {project.tools.length > 4 && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-secondary/50 text-secondary-foreground">
                    +{project.tools.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass border-border/50 bg-card/95 backdrop-blur-xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {selected.domain}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {selected.country}
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">
                  {selected.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Full Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {selected.fullDescription}
                </p>

                {/* Highlight */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">Key Highlight</p>
                    <p className="text-sm text-muted-foreground">{selected.highlight}</p>
                  </div>
                </div>

                {/* Challenges */}
                {selected.challenges && (
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Challenges</p>
                      <p className="text-sm text-muted-foreground">{selected.challenges}</p>
                    </div>
                  </div>
                )}

                {/* Results */}
                {selected.results && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Results</p>
                      <p className="text-sm text-muted-foreground">{selected.results}</p>
                    </div>
                  </div>
                )}

                {/* Tools */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold">Tech Stack</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
