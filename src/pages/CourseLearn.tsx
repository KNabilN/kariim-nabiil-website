import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DeviceGate from "@/components/course/DeviceGate";
import ChapterSidebar from "@/components/course/ChapterSidebar";
import LessonViewer from "@/components/course/LessonViewer";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
}

interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
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
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    let isCurrent = true;
    const fetchCourses = async () => {
      setLoading(true);
      const { data: access } = await supabase
        .from("course_student_access")
        .select("course_id")
        .eq("student_id", studentId);

      const courseIds = access?.map((a) => a.course_id) || [];
      if (courseIds.length === 0) {
        if (!isCurrent) return;
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: coursesData } = await supabase
        .from("paid_courses")
        .select("id, title")
        .in("id", courseIds);

      if (!isCurrent) return;
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
    return () => {
      isCurrent = false;
    };
  }, [studentId, courseId, navigate]);

  useEffect(() => {
    if (!studentId || !courseId || courses.length === 0) return;
    let isCurrent = true;
    if (!courses.some((course) => course.course_id === courseId)) {
      setChapters([]);
      setLessons([]);
      setActiveLessonId(null);
      setLoading(false);
      return;
    }

    const fetchChapters = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("course_chapters")
        .select("id, title, description, order_index, is_published")
        .eq("is_published", true)
        .eq("course_id", courseId)
        .order("order_index");
      if (!isCurrent) return;
      if (error) {
        setChapters([]);
        setLessons([]);
        setActiveLessonId(null);
        setLoading(false);
        return;
      }

      const chaps = (data || []) as Chapter[];
      setChapters(chaps);
      if (chaps.length === 0) {
        setLessons([]);
        setActiveLessonId(null);
        setLoading(false);
        return;
      }

      const { data: lessonData } = await supabase
        .from("course_lessons")
        .select("id, chapter_id, title, description, video_url, order_index, is_published")
        .in("chapter_id", chaps.map((chapter) => chapter.id))
        .eq("is_published", true)
        .order("order_index");
      if (!isCurrent) return;
      const courseLessons = (lessonData || []) as Lesson[];
      setLessons(courseLessons);
      setActiveLessonId(courseLessons[0]?.id || null);
      setLoading(false);
    };
    fetchChapters();
    return () => {
      isCurrent = false;
    };
  }, [studentId, courseId, courses]);

  if (!studentId) {
    return <DeviceGate onAccess={setStudentId} />;
  }

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId);
  const chaptersWithLessons = chapters.map((chapter) => ({
    ...chapter,
    lessons: lessons.filter((lesson) => lesson.chapter_id === chapter.id),
  }));
  const currentCourse = courses.find((c) => c.course_id === courseId);
  const hasCourseAccess = !courseId || courses.some((course) => course.course_id === courseId);

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
              <Button
                variant="ghost"
                key={c.course_id}
                onClick={() => navigate(`/course/learn/${c.course_id}`)}
                className="glass h-auto justify-start gap-4 rounded-xl p-6 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="min-w-0 whitespace-normal text-lg font-semibold">{c.course_title}</span>
              </Button>
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
      ) : (!courseId && courses.length === 0) || !hasCourseAccess ? (
        <div className="text-center py-32 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You don&apos;t have access to this course yet.</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-32 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No chapters available yet. Check back soon!</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-32 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No lessons have been published yet.</p>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
          <ChapterSidebar
            chapters={chaptersWithLessons}
            activeLessonId={activeLessonId}
            onSelect={setActiveLessonId}
          />
          {activeLesson && (
            <LessonViewer
              lessonId={activeLesson.id}
              title={activeLesson.title}
              description={activeLesson.description}
              videoUrl={activeLesson.video_url}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CourseLearn;
