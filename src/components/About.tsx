import { Bot, Workflow, Lightbulb } from "lucide-react";

const expertise = [
  {
    icon: Bot,
    title: "Agentic AI Engineering",
    description: "Building autonomous AI agents that think, plan, and execute complex tasks with minimal human intervention.",
  },
  {
    icon: Workflow,
    title: "AI Automation",
    description: "Designing intelligent automation workflows that streamline operations and multiply productivity.",
  },
  {
    icon: Lightbulb,
    title: "AI Product Management",
    description: "Translating AI capabilities into market-ready products that solve real business problems.",
  },
];

const About = () => {
  return (
    <section id="about" className="section-padding relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            What I Do
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Bridging <span className="text-gradient">AI Innovation</span> & Business Value
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            I specialize in creating AI-powered solutions that automate complex processes, 
            build intelligent agents, and transform how businesses operate.
          </p>
        </div>

        {/* Expertise Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {expertise.map((item, index) => (
            <div
              key={item.title}
              className="group glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
