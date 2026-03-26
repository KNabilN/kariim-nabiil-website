import { Users, Eye, Building2, Trophy } from "lucide-react";
import { useStats } from "@/data/siteContent";

const iconMap: Record<string, any> = { Eye, Users, Building2, Trophy };
const defaultIcons = ["Eye", "Users", "Building2", "Trophy"];

const Stats = () => {
  const { data: stats } = useStats();

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[defaultIcons[index]] || Eye;
            const content = (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-gradient mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </>
            );

            const className = "text-center glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300";

            return stat.link ? (
              <a
                key={stat.id}
                href={stat.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${className} block cursor-pointer`}
              >
                {content}
              </a>
            ) : (
              <div key={stat.id} className={className}>
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
