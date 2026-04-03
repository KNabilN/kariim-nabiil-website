import trigzLogo from "@/assets/logos/trigz.png";
import pegasusLogo from "@/assets/logos/pegasus.png";
import provinLogo from "@/assets/logos/provin.png";
import maniaLogo from "@/assets/logos/mania.svg";
import aiLogo from "@/assets/logos/ai-logo.png";
import mantouqLogo from "@/assets/logos/mantouq.png";
import scsLogo from "@/assets/logos/scs.png";
import saharaCompleteLogo from "@/assets/logos/sahara-complete.png";

const logos = [
  { src: trigzLogo, alt: "Trigz", invertDark: false },
  { src: pegasusLogo, alt: "Pegasus", invertDark: true },
  { src: provinLogo, alt: "Provin", invertDark: true },
  { src: maniaLogo, alt: "Mania", invertDark: false },
  { src: aiLogo, alt: "Zaher AI", invertDark: false },
  { src: mantouqLogo, alt: "Mantouq", invertDark: false },
  { src: scsLogo, alt: "SCS - Sahara Chemical Solutions", invertDark: false },
  { src: saharaCompleteLogo, alt: "Sahara Complete", invertDark: false },
];

const TrustedBy = () => {
  return (
    <section className="section-padding relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Companies That <span className="text-gradient">Trust</span> My Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Proud to have collaborated with innovative companies across various industries.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="group flex items-center justify-center p-4 min-w-[120px] md:min-w-[150px]"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`h-16 md:h-20 lg:h-24 w-auto max-w-[180px] md:max-w-[220px] object-contain opacity-75 group-hover:opacity-100 transition-all duration-300 grayscale group-hover:grayscale-0 ${logo.invertDark ? 'dark:invert' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
