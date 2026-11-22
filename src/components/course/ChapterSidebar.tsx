import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Circle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeLessonId: string | null;
  completedLessonIds: Set<string>;
  onSelect: (id: string) => void;
  className?: string;
  /** Use full available height (e.g. inside a mobile Sheet). */
  fillHeight?: boolean;
}

const ChapterSidebar = ({
  chapters,
  activeLessonId,
  completedLessonIds,
  onSelect,
  className,
  fillHeight = false,
}: ChapterSidebarProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => new Set());
  const chapterIds = chapters.map((chapter) => chapter.id).join(",");
  const activeChapterId = chapters.find((chapter) => chapter.lessons.some((lesson) => lesson.id === activeLessonId))?.id;
  const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const completedCount = [...completedLessonIds].filter((id) =>
    chapters.some((chapter) => chapter.lessons.some((lesson) => lesson.id === id)),
  ).length;

  useEffect(() => {
    // Keep sidebar compact: only expand the active section by default
    const ids = chapterIds.split(",").filter(Boolean);
    if (ids.length === 0) {
      setExpandedChapters(new Set());
      return;
    }
    setExpandedChapters(new Set(activeChapterId ? [activeChapterId] : [ids[0]]));
  }, [chapterIds, activeChapterId]);

  return (
    <div
      className={cn(
        "w-full shrink-0",
        !fillHeight && "lg:sticky lg:top-20 lg:w-80 lg:self-start",
        fillHeight && "h-full",
        className,
      )}
    >
      <nav
        aria-label="Course chapters and lessons"
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card p-3",
          fillHeight
            ? "h-full max-h-none rounded-none border-0 bg-transparent p-0"
            : "max-h-[min(40vh,320px)] lg:max-h-[calc(100vh-6.5rem)]",
        )}
      >
        <div className="shrink-0 space-y-2 border-b border-border/60 pb-3">
          <div className="flex items-center justify-between gap-2 px-3 pt-1">
            <h3 className="text-sm font-semibold text-muted-foreground">Course content</h3>
            <span className="text-xs font-semibold text-primary">
              {completedCount}/{totalLessons}
            </span>
          </div>
          {totalLessons > 0 && (
            <div className="mx-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.round((completedCount / totalLessons) * 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pe-1">
          {chapters.map((chapter, chapterIndex) => {
            const expanded = expandedChapters.has(chapter.id);
            return (
              <div key={chapter.id}>
                <Button
                  variant="ghost"
                  aria-expanded={expanded}
                  onClick={() =>
                    setExpandedChapters((current) => {
                      const next = new Set(current);
                      if (next.has(chapter.id)) next.delete(chapter.id);
                      else next.add(chapter.id);
                      return next;
                    })
                  }
                  className="h-auto min-h-10 w-full justify-between gap-2 whitespace-normal px-3 py-2 text-left"
                >
                  <span className="min-w-0 flex-1 break-words">
                    <span className="me-2 text-muted-foreground">{chapterIndex + 1}.</span>
                    {chapter.title}
                    <span className="ms-2 text-xs text-muted-foreground">{chapter.lessons.length}</span>
                  </span>
                  {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                </Button>
                {expanded && (
                  <div className="ms-3 border-s border-border ps-2">
                    {chapter.lessons.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-muted-foreground">No published lessons</p>
                    ) : (
                      chapter.lessons.map((lesson, lessonIndex) => {
                        const done = completedLessonIds.has(lesson.id);
                        return (
                          <Button
                            key={lesson.id}
                            variant={activeLessonId === lesson.id ? "secondary" : "ghost"}
                            onClick={() => onSelect(lesson.id)}
                            aria-current={activeLessonId === lesson.id ? "true" : undefined}
                            className="h-auto min-h-10 w-full justify-start gap-2 whitespace-normal px-3 py-2 text-left"
                          >
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            ) : activeLessonId === lesson.id ? (
                              <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                            ) : (
                              <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <span className="min-w-0 flex-1 break-words">
                              <span className="me-2 text-muted-foreground">
                                {chapterIndex + 1}.{lessonIndex + 1}
                              </span>
                              {lesson.title}
                            </span>
                          </Button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default ChapterSidebar;
