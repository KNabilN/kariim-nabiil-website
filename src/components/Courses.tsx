import { Button } from "@/components/ui/button";
import { ExternalLink, Play, BookOpen } from "lucide-react";
import { useCourses } from "@/data/siteContent";
import { Link } from "react-router-dom";
import { useCourses } from "@/data/siteContent";

const Courses = () => {
  const { data: courses } = useCourses();

  return (
    <section id="courses" className="section-padding relative bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            Learn From Me
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Premium <span className="text-gradient">AI Courses</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive courses designed to help you master AI automation and agentic systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{course.platform}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-6">{course.description}</p>
              </div>

              <div className="px-8 pb-6">
                <div className="flex flex-wrap gap-2">
                  {course.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-8 pb-8">
                {course.title.toLowerCase().includes("n8n") && !course.isFree ? (
                  <Button variant="outline" className="w-full group/btn" asChild>
                    <Link to="/course/advanced-n8n">
                      <Play className="w-4 h-4" />
                      Enroll Now
                      <ExternalLink className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full group/btn" asChild>
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4" />
                      {course.isFree ? "Watch Free" : "Enroll Now"}
                      <ExternalLink className="w-4 h-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
