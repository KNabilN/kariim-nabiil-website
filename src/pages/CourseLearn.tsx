import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface CourseAccess {
  course_id: string;
  course_title: string;
}

const CourseLearn = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseAccess[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch enrolled courses
  useEffect(() => {
    if (!studentId) return;
    const fetchCourses = async () => {
      setLoading(true);
      const { data: access } = await supabase
        .from("course_student_access")
        .select("course_id")
        .eq("student_id", studentId);

      const courseIds = access?.map((a) => a.course_id) || [];
      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: coursesData } = await supabase
        .from("paid_courses")
        .select("id, title")
        .in("id", courseIds);

      const mapped = (coursesData || []).map((c) => ({
        course_id: c.id,
        course_title: c.title,
      }));
      setCourses(mapped);

      // Auto-navigate if only one course and no courseId in URL
      if (!courseId && mapped.length === 1) {
        navigate(`/course/learn/${mapped[0].course_id}`, { replace: true });
      }
      setLoading(false);
    };
    fetchCourses();
  }, [studentId]);

  // Fetch chapters for selected course
  useEffect(() => {
    if (!studentId || !courseId) return;
    const fetchChapters = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("course_chapters")
        .select("*")
        .eq("is_published", true)
        .eq("course_id", courseId)
        .order("order_index");
      const chaps = (data || []) as Chapter[];
      setChapters(chaps);
      if (chaps.length > 0) setActiveChapterId(chaps[0].id);
      else setActiveChapterId(null);
      setLoading(false);
    };
    fetchChapters();
  }, [studentId, courseId]);

  if (!studentId) {
    return <DeviceGate onAccess={setStudentId} />;
  }

  const activeChapter = chapters.find((c) => c.id === activeChapterId);
  const currentCourse = courses.find((c) => c.course_id === courseId);

  // Course selection screen
  if (!courseId && courses.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border/50 px-6 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-6 py-16 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Your Courses</h1>
          <p className="text-muted-foreground mb-8">Select a course to start learning</p>
          <div className="grid gap-4">
            {courses.map((c) => (
              <button
                key={c.course_id}
                onClick={() => navigate(`/course/learn/${c.course_id}`)}
                className="glass rounded-2xl p-6 text-left hover:bg-secondary/50 transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-lg font-semibold">{c.course_title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to={courses.length > 1 ? "/course/learn" : "/"}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {courses.length > 1 ? "My Courses" : "Back"}
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">{currentCourse?.course_title || "Course"}</span>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !courseId && courses.length === 0 ? (
        <div className="text-center py-32 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You don't have access to any courses yet.</p>
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
