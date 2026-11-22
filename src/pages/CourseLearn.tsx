import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Award, BookOpen, ListVideo, Loader2, LogOut, User } from "lucide-react";
import DeviceGate from "@/components/course/DeviceGate";
import ChapterSidebar from "@/components/course/ChapterSidebar";
import LessonViewer from "@/components/course/LessonViewer";
import CertificateActions from "@/components/course/CertificateActions";
import { type CertificateView } from "@/components/course/CompletionCertificate";
import CourseFeedbackDialog, { type FeedbackStage } from "@/components/course/CourseFeedbackDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  clearStudentSession,
  makeCertificateCode,
  writeStudentSession,
  type StudentSession,
} from "@/lib/studentSession";

function feedbackDismissKey(courseId: string, stage: FeedbackStage) {
  return `course_feedback_dismissed_${courseId}_${stage}`;
}

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
  const [student, setStudent] = useState<StudentSession | null>(null);
  const [courses, setCourses] = useState<CourseAccess[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [certificate, setCertificate] = useState<CertificateView | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [curriculumOpen, setCurriculumOpen] = useState(false);
  const [submittedFeedbackStages, setSubmittedFeedbackStages] = useState<Set<FeedbackStage>>(new Set());
  const [feedbackPrompt, setFeedbackPrompt] = useState<FeedbackStage | null>(null);
  const [pendingCertificate, setPendingCertificate] = useState<CertificateView | null>(null);

  const handleAccess = useCallback((session: StudentSession) => {
    setStudent(session);
  }, []);

  useEffect(() => {
    if (!student) return;
    let isCurrent = true;
    const fetchCourses = async () => {
      setLoading(true);
      const { data: access } = await supabase
        .from("course_student_access")
        .select("course_id")
        .eq("student_id", student.id);

      const courseIds = access?.map((a) => a.course_id) || [];
      if (courseIds.length === 0) {
        if (!isCurrent) return;
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: coursesData } = await supabase.from("paid_courses").select("id, title").in("id", courseIds);

      if (!isCurrent) return;
      const mapped = (coursesData || []).map((c) => ({
        course_id: c.id,
        course_title: c.title,
      }));
      setCourses(mapped);

      if (!courseId && mapped.length === 1) {
        navigate(`/course/learn/${mapped[0].course_id}`, { replace: true });
      }
      setLoading(false);
    };
    void fetchCourses();
    return () => {
      isCurrent = false;
    };
  }, [student, courseId, navigate]);

  useEffect(() => {
    if (!student || !courseId || courses.length === 0) return;
    let isCurrent = true;
    if (!courses.some((course) => course.course_id === courseId)) {
      setChapters([]);
      setLessons([]);
      setActiveLessonId(null);
      setCompletedLessonIds(new Set());
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
        .in(
          "chapter_id",
          chaps.map((chapter) => chapter.id),
        )
        .eq("is_published", true)
        .order("order_index");
      if (!isCurrent) return;
      const courseLessons = (lessonData || []) as Lesson[];
      setLessons(courseLessons);

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("student_id", student.id)
        .eq("course_id", courseId);
      if (!isCurrent) return;
      const done = new Set((progress || []).map((row) => row.lesson_id));
      setCompletedLessonIds(done);

      const { data: feedbackRows } = await supabase
        .from("course_feedback")
        .select("stage")
        .eq("student_id", student.id)
        .eq("course_id", courseId);
      if (!isCurrent) return;
      setSubmittedFeedbackStages(
        new Set(
          (feedbackRows || [])
            .map((row) => row.stage)
            .filter((stage): stage is FeedbackStage => stage === "mid" || stage === "end"),
        ),
      );

      const firstIncomplete = courseLessons.find((lesson) => !done.has(lesson.id));
      setActiveLessonId(firstIncomplete?.id || courseLessons[0]?.id || null);
      setLoading(false);
    };
    void fetchChapters();
    return () => {
      isCurrent = false;
    };
  }, [student, courseId, courses]);

  const orderedLessons = useMemo(() => {
    const chapterOrder = new Map(chapters.map((chapter, index) => [chapter.id, index]));
    return [...lessons].sort((a, b) => {
      const chapterDiff = (chapterOrder.get(a.chapter_id) ?? 0) - (chapterOrder.get(b.chapter_id) ?? 0);
      if (chapterDiff !== 0) return chapterDiff;
      return a.order_index - b.order_index;
    });
  }, [chapters, lessons]);

  const issueCertificateIfDone = async (doneIds: Set<string>) => {
    if (!student || !courseId) return null;
    if (orderedLessons.length === 0) return null;
    if (!orderedLessons.every((lesson) => doneIds.has(lesson.id))) return null;

    const courseTitle = courses.find((c) => c.course_id === courseId)?.course_title || "Course";

    // Always use the latest saved profile name from DB (not a stale session value).
    const { data: profile } = await supabase
      .from("course_students")
      .select("full_name, email")
      .eq("id", student.id)
      .maybeSingle();

    const studentName = (profile?.full_name || student.fullName || profile?.email || student.email).trim();
    if (profile?.full_name && profile.full_name !== student.fullName) {
      const synced = { ...student, fullName: profile.full_name };
      writeStudentSession(synced);
      setStudent(synced);
    }

    const { data: existing } = await supabase
      .from("course_certificates")
      .select("id, student_name, course_title, certificate_code, issued_at")
      .eq("student_id", student.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      if (existing.student_name !== studentName) {
        await supabase.from("course_certificates").update({ student_name: studentName }).eq("id", existing.id);
      }
      return {
        studentName,
        courseTitle: existing.course_title,
        certificateCode: existing.certificate_code,
        issuedAt: existing.issued_at,
      } satisfies CertificateView;
    }

    const payload = {
      student_id: student.id,
      course_id: courseId,
      student_name: studentName,
      course_title: courseTitle,
      certificate_code: makeCertificateCode(),
    };

    const { data, error } = await supabase
      .from("course_certificates")
      .insert(payload)
      .select("student_name, course_title, certificate_code, issued_at")
      .single();
    if (error || !data) {
      toast({ title: "Certificate could not be issued", description: error?.message, variant: "destructive" });
      return null;
    }

    return {
      studentName: data.student_name,
      courseTitle: data.course_title,
      certificateCode: data.certificate_code,
      issuedAt: data.issued_at,
    } satisfies CertificateView;
  };

  const shouldAskFeedback = (stage: FeedbackStage) => {
    if (!courseId) return false;
    if (submittedFeedbackStages.has(stage)) return false;
    try {
      if (sessionStorage.getItem(feedbackDismissKey(courseId, stage))) return false;
    } catch {
      // ignore
    }
    return true;
  };

  const completeAndNext = async () => {
    if (!student || !courseId || !activeLessonId) return;
    setCompleting(true);

    const alreadyDone = completedLessonIds.has(activeLessonId);
    let nextDone = new Set(completedLessonIds);

    if (!alreadyDone) {
      const { error } = await supabase.from("lesson_progress").insert({
        student_id: student.id,
        course_id: courseId,
        lesson_id: activeLessonId,
      });
      if (error && !/duplicate|unique/i.test(error.message)) {
        toast({ title: "Could not save progress", description: error.message, variant: "destructive" });
        setCompleting(false);
        return;
      }
      nextDone = new Set(completedLessonIds).add(activeLessonId);
      setCompletedLessonIds(nextDone);
    }

    const currentIndex = orderedLessons.findIndex((lesson) => lesson.id === activeLessonId);
    const nextLesson = currentIndex >= 0 ? orderedLessons[currentIndex + 1] : undefined;
    const doneCount = orderedLessons.filter((lesson) => nextDone.has(lesson.id)).length;
    const total = orderedLessons.length;
    const crossedMidpoint = total > 0 && doneCount / total >= 0.5 && (doneCount - (alreadyDone ? 0 : 1)) / total < 0.5;

    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
      setCompleting(false);
      if (crossedMidpoint && shouldAskFeedback("mid")) {
        setFeedbackPrompt("mid");
      }
      return;
    }

    const cert = await issueCertificateIfDone(nextDone);
    setCompleting(false);
    if (shouldAskFeedback("end")) {
      setPendingCertificate(cert);
      setFeedbackPrompt("end");
      return;
    }

    if (cert) {
      setCertificate(cert);
      setShowCertificate(true);
      toast({ title: "Congratulations!", description: "You've completed the course. Your certificate is ready." });
    }
  };

  const revealCertificateIfReady = (cert: CertificateView | null) => {
    if (!cert) return;
    setCertificate(cert);
    setShowCertificate(true);
    setPendingCertificate(null);
    toast({ title: "Congratulations!", description: "You've completed the course. Your certificate is ready." });
  };

  const handleFeedbackClose = () => {
    if (feedbackPrompt && courseId) {
      try {
        sessionStorage.setItem(feedbackDismissKey(courseId, feedbackPrompt), "1");
      } catch {
        // ignore
      }
    }
    const stage = feedbackPrompt;
    setFeedbackPrompt(null);
    if (stage === "end") revealCertificateIfReady(pendingCertificate);
  };

  const handleFeedbackSubmitted = (stage: FeedbackStage) => {
    setSubmittedFeedbackStages((current) => new Set(current).add(stage));
    setFeedbackPrompt(null);
    if (stage === "end") revealCertificateIfReady(pendingCertificate);
  };

  if (!student) {
    return <DeviceGate onAccess={handleAccess} />;
  }

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId);
  const chaptersWithLessons = chapters.map((chapter) => ({
    ...chapter,
    lessons: lessons.filter((lesson) => lesson.chapter_id === chapter.id),
  }));
  const currentCourse = courses.find((c) => c.course_id === courseId);
  const hasCourseAccess = !courseId || courses.some((course) => course.course_id === courseId);
  const activeIndex = orderedLessons.findIndex((lesson) => lesson.id === activeLessonId);
  const hasNext = activeIndex >= 0 && activeIndex < orderedLessons.length - 1;

  if (!courseId && courses.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border/50 px-6 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/course/profile">
                <User className="me-1 h-4 w-4" />
                Profile
              </Link>
            </Button>
          </div>
        </nav>
        <div className="container mx-auto max-w-2xl px-6 py-16">
          <h1 className="mb-2 text-3xl font-bold">Your Courses</h1>
          <p className="mb-8 text-muted-foreground">Select a course to start learning</p>
          <div className="grid gap-4">
            {courses.map((c) => (
              <Button
                variant="ghost"
                key={c.course_id}
                onClick={() => navigate(`/course/learn/${c.course_id}`)}
                className="glass h-auto justify-start gap-4 rounded-xl p-6 text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="min-w-0 whitespace-normal text-lg font-semibold">{c.course_title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalLessonCount = lessons.length;
  const completedCount = [...completedLessonIds].filter((id) => lessons.some((lesson) => lesson.id === id)).length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="container mx-auto flex items-center gap-2 px-4 py-3 sm:px-6">
          <Link
            to={courses.length > 1 ? "/course/learn" : "/"}
            className="flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={courses.length > 1 ? "My Courses" : "Back"}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden text-sm sm:inline">{courses.length > 1 ? "My Courses" : "Back"}</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1 text-primary">
            <BookOpen className="hidden h-4 w-4 shrink-0 sm:block" />
            <span className="truncate text-sm font-semibold sm:text-base">{currentCourse?.course_title || "Course"}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label="Account menu">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/course/profile">
                  <User className="me-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  clearStudentSession();
                  setStudent(null);
                }}
              >
                <LogOut className="me-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (!courseId && courses.length === 0) || !hasCourseAccess ? (
        <div className="py-32 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>You don&apos;t have access to this course yet.</p>
        </div>
      ) : chapters.length === 0 ? (
        <div className="py-32 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No chapters available yet. Check back soon!</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-32 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No lessons have been published yet.</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:flex lg:gap-8 lg:py-8">
          {/* Mobile: open curriculum sheet */}
          <div className="mb-4 lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-between gap-3 rounded-xl px-4"
              onClick={() => setCurriculumOpen(true)}
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                <ListVideo className="h-4 w-4 text-primary" />
                Course content
              </span>
              <span className="text-xs font-semibold text-primary">
                {completedCount}/{totalLessonCount}
              </span>
            </Button>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <ChapterSidebar
              chapters={chaptersWithLessons}
              activeLessonId={activeLessonId}
              completedLessonIds={completedLessonIds}
              onSelect={setActiveLessonId}
            />
          </div>

          {activeLesson && (
            <LessonViewer
              lessonId={activeLesson.id}
              title={activeLesson.title}
              description={activeLesson.description}
              videoUrl={activeLesson.video_url}
              completed={completedLessonIds.has(activeLesson.id)}
              hasNext={hasNext}
              completing={completing}
              onCompleteAndNext={() => void completeAndNext()}
            />
          )}

          <Sheet open={curriculumOpen} onOpenChange={setCurriculumOpen}>
            <SheetContent side="bottom" className="flex h-[85vh] flex-col gap-0 p-0 sm:max-w-none">
              <SheetHeader className="border-b border-border px-4 py-3 text-start">
                <SheetTitle>Course content</SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-hidden p-3">
                <ChapterSidebar
                  fillHeight
                  chapters={chaptersWithLessons}
                  activeLessonId={activeLessonId}
                  completedLessonIds={completedLessonIds}
                  onSelect={(id) => {
                    setActiveLessonId(id);
                    setCurriculumOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your certificate
            </DialogTitle>
          </DialogHeader>
          {certificate && <CertificateActions certificate={certificate} showProfileLink />}
        </DialogContent>
      </Dialog>

      {student && courseId && feedbackPrompt && (
        <CourseFeedbackDialog
          open={Boolean(feedbackPrompt)}
          stage={feedbackPrompt}
          studentId={student.id}
          studentName={student.fullName.trim() || student.email}
          studentEmail={student.email}
          courseId={courseId}
          courseTitle={currentCourse?.course_title || "Course"}
          onClose={handleFeedbackClose}
          onSubmitted={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
};

export default CourseLearn;
