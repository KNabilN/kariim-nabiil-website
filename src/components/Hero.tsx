import { Button } from "@/components/ui/button";
import { ArrowDown, Bot, Cpu, Workflow } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="AI Neural Network Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float opacity-20">
        <Bot className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute bottom-40 right-20 animate-float animation-delay-200 opacity-20">
        <Cpu className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-1/3 right-10 animate-float animation-delay-400 opacity-20">
        <Workflow className="w-14 h-14 text-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-sm text-muted-foreground">Available for AI Projects</span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            I BUILD{" "}
            <span className="text-gradient">INTELLIGENT</span>
            <br />
            AI SOLUTIONS
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            Agentic AI Engineer • AI Automation Expert • AI Product Manager
          </p>

          {/* Description */}
          <p 
            className="text-base text-muted-foreground/80 max-w-xl mx-auto mb-12 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            Transforming businesses with cutting-edge AI agents, automation workflows, 
            and intelligent systems that drive real results.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <Button variant="hero" size="lg" asChild>
              <a href="#courses">Explore Courses</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
