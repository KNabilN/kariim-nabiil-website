import { ExternalLink, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "AI Legal Assistant for Qatari Procurement Law",
    description: "Built an AI assistant using RAG + Knowledge Graph that answers questions on Qatari procurement law while correctly handling multi-year legal amendments (2015, 2019, 2024).",
    tools: ["n8n", "Supabase", "pgvector", "LLM", "Telegram"],
    domain: "Legal Tech",
    country: "Qatar",
    highlight: "Semantic chunking + custom knowledge graph with amendment relations",
  },
  {
    title: "Agentic GEO/SEO Optimization System",
    description: "Developed a deep technical agentic system for Zaher AI startup, reducing analysis time from hours to 15 minutes and cutting costs by 80%.",
    tools: ["n8n", "Multiple LLMs", "Parallelization"],
    domain: "GEO (Generative Engine Optimization)",
    country: "Egypt",
    highlight: "Pre-seed funded startup ($150K)",
  },
  {
    title: "Sales AI Automation for Marketing Agency",
    description: "Developed a full AI-driven system to automate the entire sales process — from lead generation to follow-ups, proposal, and contract creation.",
    tools: ["Notion CRM", "n8n", "Google Sheets", "AI"],
    domain: "Marketing & Sales",
    country: "Bahrain",
    highlight: "End-to-end sales automation",
  },
  {
    title: "Sales Rep Reporting System",
    description: "Built an end-to-end reporting platform for 39 branches to record daily sales and generate daily, weekly, and monthly performance reports.",
    tools: ["Lovable", "Supabase"],
    domain: "Sales Analytics",
    country: "Egypt",
    highlight: "39 branches reporting system",
  },
  {
    title: "AI Financial Analysis Platform",
    description: "Built a platform for finance professionals to analyze financial sheets like balance sheets and cash flows using AI, providing recommendations and performance evaluations.",
    tools: ["AI Models", "n8n", "Financial Tools"],
    domain: "Finance & AI",
    country: "Saudi Arabia",
    highlight: "AI-powered financial insights",
  },
  {
    title: "Agentic LLM Orchestration Engine",
    description: "Built a multi-LLM agentic system reducing runtime for 10-unit jobs from ~7 minutes to ~3 minutes using custom nested parallelization pattern in n8n.",
    tools: ["n8n", "Multiple LLMs", "Custom Batching"],
    domain: "AI Infrastructure",
    country: "Egypt",
    highlight: "Invented nested parallelization pattern",
  },
];

const Projects = () => {
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
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col"
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
    </section>
  );
};

export default Projects;
