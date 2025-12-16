import trigzLogo from "@/assets/logos/trigz.png";
import pegasusLogo from "@/assets/logos/pegasus.png";
import provinLogo from "@/assets/logos/provin.png";
import maniaLogo from "@/assets/logos/mania.svg";
import aiLogo from "@/assets/logos/ai-logo.png";
import mantouqLogo from "@/assets/logos/mantouq.png";

const logos = [
  { src: trigzLogo, alt: "Trigz", className: "h-10 md:h-12" },
  { src: pegasusLogo, alt: "Pegasus", className: "h-8 md:h-10 invert" },
  { src: provinLogo, alt: "Provin", className: "h-10 md:h-14 invert" },
  { src: maniaLogo, alt: "Mania", className: "h-8 md:h-10" },
  { src: aiLogo, alt: "AI Company", className: "h-8 md:h-10" },
  { src: mantouqLogo, alt: "Mantouq", className: "h-12 md:h-16" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div
              key={logo.alt}
              className="group relative w-full flex items-center justify-center p-6 rounded-xl hover:bg-card/50 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.className} w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
