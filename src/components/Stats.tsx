import { Users, Eye, Building2, Trophy } from "lucide-react";

const stats = [
  {
    icon: Eye,
    value: "550K+",
    label: "YouTube Views",
    description: "n8n_with_karim course",
    link: "https://www.youtube.com/@kariimnabiil",
  },
  {
    icon: Users,
    value: "200+",
    label: "Students",
    description: "Across 7 countries",
  },
  {
    icon: Building2,
    value: "6+",
    label: "Countries",
    description: "Projects delivered globally",
  },
  {
    icon: Trophy,
    value: "2x",
    label: "NASA Winner",
    description: "Space Apps Cairo & Global Nominee",
  },
];

const Stats = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const content = (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-gradient mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </>
            );

            const className = "text-center glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300";

            return stat.link ? (
              <a
                key={stat.label}
                href={stat.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} block cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {content}
              </a>
            ) : (
              <div key={stat.label} className={className} style={{ animationDelay: `${index * 100}ms` }}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
