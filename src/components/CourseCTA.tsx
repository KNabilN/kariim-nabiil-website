import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Youtube, FolderDown } from "lucide-react";

const CourseCTA = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container mx-auto relative">
        <div className="glass rounded-3xl p-8 md:p-14 text-center max-w-4xl mx-auto border border-primary/20 glow-effect">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> Free Course — Live Now
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Master <span className="text-gradient">Advanced n8n</span> Automation
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            A free comprehensive course streaming live on YouTube. Enroll to get exclusive access to course resources, downloadable files, and project templates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
            <span className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-primary" /> Live on YouTube
            </span>
            <span className="flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-primary" /> Exclusive Resources
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground px-8 group" asChild>
              <Link to="/course/advanced-n8n">
                Enroll for Resources
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/course/learn">
                Already enrolled? Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCTA;
