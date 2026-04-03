import { PlayCircle, CheckCircle } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
}

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  onSelect: (id: string) => void;
}

const ChapterSidebar = ({ chapters, activeChapterId, onSelect }: ChapterSidebarProps) => {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="glass rounded-2xl p-4 space-y-1">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider px-3 py-2">
          Chapters
        </h3>
        {chapters.map((chapter, idx) => (
          <button
            key={chapter.id}
            onClick={() => onSelect(chapter.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
              activeChapterId === chapter.id
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-secondary/50"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold ${
              activeChapterId === chapter.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {idx + 1}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{chapter.title}</p>
              {chapter.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{chapter.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChapterSidebar;
