import { Button } from "@/components/ui/button";
import { Mail, Instagram, Linkedin, ArrowRight, MessageCircle } from "lucide-react";
import TikTokIcon from "@/components/brand/TikTokIcon";
import { getBrand } from "@/lib/brand";
import {
  buildGenericContactWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

const Contact = () => {
  const brand = getBrand("en");
  const whatsappHref = buildWhatsAppUrl({
    phone: brand.phone,
    whatsappUrl: brand.whatsappUrl,
    text: buildGenericContactWhatsAppMessage("en"),
  });

  return (
    <section id="contact" className="section-padding relative bg-card/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">Let's Connect</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Build Something <span className="text-gradient">Amazing</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Whether you need AI automation, want to build intelligent agents, or have a product idea that needs AI
            expertise — I'm here to help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href={brand.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={brand.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href={brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
