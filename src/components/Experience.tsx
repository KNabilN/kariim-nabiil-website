import { Briefcase, GraduationCap, Award } from "lucide-react";

const experiences = [
  {
    role: "Agentic AI Engineer",
    company: "Zaher AI",
    period: "Aug 2025 – Present",
    location: "Egypt",
    type: "Part-time, Remote",
    highlights: [
      "Built agentic system reducing GEO analysis from hours to <15 minutes",
      "Increased quality by 50% and reduced costs by 80%",
      "Pre-seed funded startup ($150K)",
    ],
  },
  {
    role: "Agentic AI Engineering Instructor",
    company: "Self-employed",
    period: "Jun 2025 – Present",
    location: "Egypt",
    type: "Online",
    highlights: [
      "300K+ views on n8n_with_karim YouTube course",
      "200+ paying students across 7 countries",
      "Courses on Agentic AI and Sales AI Automation",
    ],
  },
  {
    role: "AI Product Manager | Business Developer",
    company: "Trigz",
    period: "Mar 2025 – Present",
    location: "Canada",
    type: "Full-time, Remote",
    highlights: [
      "Led product discovery with target users for AI Operating System",
      "Founded by global team from AWS, Meta, Microsoft",
      "GTM strategy targeting 15K+ users at launch",
    ],
  },
  {
    role: "Head of Business Development",
    company: "Provin",
    period: "Oct 2023 – Mar 2025",
    location: "USA",
    type: "Full-time, Remote",
    highlights: [
      "Partnerships with Google, Apple, Microsoft, Visa, IDEO, Boeing",
      "Break-even in 6 months, $200K+ contracts sold",
      "Built Provin AI Agent for talent recruitment",
    ],
  },
];

const achievements = [
  "NASA Space Apps Cairo Winner & Global Nominee (2x)",
  "2nd Place YLP with UNDP",
  "African Youth Forum for Entrepreneurs Winner",
  "Ideal Student @ Zagazig University 2020",
];

const Experience = () => {
  return (
    <section id="experience" className="section-padding relative bg-card/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            Background
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Experience & <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A blend of engineering expertise, business development, and AI product leadership.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Career Journey</h3>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={exp.role + exp.company}
                  className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{exp.role}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                      <p className="text-xs text-muted-foreground">{exp.location} • {exp.type}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Education */}
          <div className="space-y-8">
            {/* Achievements */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Achievements</h3>
              </div>
              <div className="glass rounded-xl p-6">
                <ul className="space-y-3">
                  {achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">🏆</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">Education</h3>
              </div>
              <div className="glass rounded-xl p-6">
                <h4 className="font-bold mb-1">BSc Mechanical Design & Production</h4>
                <p className="text-primary text-sm font-medium mb-2">Zagazig University, 2021</p>
                <p className="text-sm text-muted-foreground">
                  92% • Excellent with Honor • 1st of Department
                </p>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    + Google Automation with Python Certificate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
