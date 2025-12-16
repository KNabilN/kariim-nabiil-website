import { Button } from "@/components/ui/button";
import { ExternalLink, Play, BookOpen } from "lucide-react";

const courses = [
  {
    title: "Agentic AI Masterclass",
    platform: "Lovable",
    description: "Master the art of building autonomous AI agents that can reason, plan, and execute complex tasks.",
    link: "https://karim-nabil-agentic-ai.lovable.app",
    features: ["Agent Architecture", "LLM Integration", "Tool Building", "Production Deployment"],
    accent: "primary",
  },
  {
    title: "AI Sales Automation with n8n",
    platform: "Udemy",
    description: "Learn to automate your entire sales pipeline using AI and n8n workflow automation.",
    link: "https://www.udemy.com/course/ai-sales-automation-using-n8n/",
    features: ["n8n Workflows", "AI Integration", "Lead Scoring", "CRM Automation"],
    accent: "secondary",
  },
];

const Courses = () => {
  return (
    <section id="courses" className="section-padding relative bg-card/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            Learn From Me
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Premium <span className="text-gradient">AI Courses</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive courses designed to help you master AI automation and agentic systems.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {courses.map((course, index) => (
            <div
              key={course.title}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              {/* Card Header */}
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{course.platform}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {course.description}
                </p>
              </div>

              {/* Features */}
              <div className="px-8 pb-6">
                <div className="flex flex-wrap gap-2">
                  {course.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-8 pb-8">
                <Button variant="outline" className="w-full group/btn" asChild>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4" />
                    Enroll Now
                    <ExternalLink className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
