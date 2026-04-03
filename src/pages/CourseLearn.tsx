import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DeviceGate from "@/components/course/DeviceGate";
import ChapterSidebar from "@/components/course/ChapterSidebar";
import ChapterViewer from "@/components/course/ChapterViewer";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  order_index: number;
  is_published: boolean;
}

const CourseLearn = () => {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("course_chapters")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      const chaps = (data || []) as Chapter[];
      setChapters(chaps);
      if (chaps.length > 0) setActiveChapterId(chaps[0].id);
      setLoading(false);
    };
    fetch();
  }, [studentId]);

  if (!studentId) {
    return <DeviceGate onAccess={setStudentId} />;
  }

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Advanced n8n Course</span>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-32 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No chapters available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
          <ChapterSidebar
            chapters={chapters}
            activeChapterId={activeChapterId}
            onSelect={setActiveChapterId}
          />
          {activeChapter && (
            <ChapterViewer
              chapterId={activeChapter.id}
              title={activeChapter.title}
              description={activeChapter.description}
              youtubeUrl={activeChapter.youtube_url}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CourseLearn;
