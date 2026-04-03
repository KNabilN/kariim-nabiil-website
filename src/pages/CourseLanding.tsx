import { Button } from "@/components/ui/button";
import PaymentForm from "@/components/course/PaymentForm";
import { BookOpen, CheckCircle, ArrowLeft, Youtube, FolderDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const WHAT_YOU_LEARN = [
  "Advanced n8n workflows & best practices",
  "AI integrations with LLMs (OpenAI, Claude, etc.)",
  "Building production-ready automation systems",
  "Error handling & monitoring strategies",
  "Real-world project walkthroughs",
  "Webhook integrations & API orchestration",
];

const CourseLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <Link to="/course/learn">
            <Button variant="outline" size="sm">Student Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="section-padding text-center">
        <div className="container mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" /> Free Course — Live Now
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Advanced <span className="text-gradient">n8n</span> Automation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A free course streaming live on YouTube. Enroll to get exclusive access to course resources, downloadable files, and project templates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Youtube className="w-4 h-4 text-primary" /> Live on YouTube</span>
            <span className="flex items-center gap-2"><FolderDown className="w-4 h-4 text-primary" /> Exclusive Resources</span>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="section-padding bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll <span className="text-gradient">Learn</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {WHAT_YOU_LEARN.map((item, i) => (
              <div key={i} className="flex items-start gap-3 glass rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="enroll" className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Get Course <span className="text-gradient">Resources</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Fill in your details to get access to all course resources, templates, and downloadable files.
          </p>
          <div className="glass rounded-2xl p-8">
            <PaymentForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseLanding;
