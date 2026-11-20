import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onSelect: (id: string) => void;
}

const ChapterSidebar = ({ chapters, activeLessonId, onSelect }: ChapterSidebarProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => new Set());
  const chapterIds = chapters.map((chapter) => chapter.id).join(",");
  const activeChapterId = chapters.find((chapter) => chapter.lessons.some((lesson) => lesson.id === activeLessonId))?.id;

  useEffect(() => {
    setExpandedChapters(new Set(chapterIds.split(",").filter(Boolean)));
  }, [chapterIds]);

  useEffect(() => {
    if (!activeChapterId) return;
    setExpandedChapters((current) => new Set(current).add(activeChapterId));
  }, [activeChapterId]);

  return (
    <div className="w-full shrink-0 lg:w-80">
      <nav aria-label="Course chapters and lessons" className="glass space-y-1 rounded-xl p-3">
        <h3 className="px-3 py-2 text-sm font-semibold text-muted-foreground">Course content</h3>
        {chapters.map((chapter, chapterIndex) => {
          const expanded = expandedChapters.has(chapter.id);
          return (
            <div key={chapter.id}>
              <Button
                variant="ghost"
                aria-expanded={expanded}
                onClick={() => setExpandedChapters((current) => {
                  const next = new Set(current);
                  if (next.has(chapter.id)) next.delete(chapter.id);
                  else next.add(chapter.id);
                  return next;
                })}
                className="h-auto min-h-10 w-full justify-between gap-2 whitespace-normal px-3 py-2 text-left"
              >
                <span className="min-w-0 flex-1 break-words">
                  <span className="mr-2 text-muted-foreground">{chapterIndex + 1}.</span>
                  {chapter.title}
                  <span className="ml-2 text-xs text-muted-foreground">{chapter.lessons.length}</span>
                </span>
                {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
              </Button>
              {expanded && (
                <div className="ml-3 border-l border-border pl-2">
                  {chapter.lessons.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">No published lessons</p>
                  ) : chapter.lessons.map((lesson, lessonIndex) => (
                    <Button
                      key={lesson.id}
                      variant={activeLessonId === lesson.id ? "secondary" : "ghost"}
                      onClick={() => onSelect(lesson.id)}
                      aria-current={activeLessonId === lesson.id ? "true" : undefined}
                      className="h-auto min-h-10 w-full justify-start gap-2 whitespace-normal px-3 py-2 text-left"
                    >
                      <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1 break-words">
                        <span className="mr-2 text-muted-foreground">{chapterIndex + 1}.{lessonIndex + 1}</span>
                        {lesson.title}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default ChapterSidebar;
