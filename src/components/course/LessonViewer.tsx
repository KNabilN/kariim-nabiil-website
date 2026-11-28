import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  FileText,
  ListVideo,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { extractGoogleDriveFileId, getVideoEmbedUrl } from "@/lib/videoUrl";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  file_url: string;
  file_type: string | null;
}

export interface LessonPosition {
  index: number;
  total: number;
  chapterLabel: string;
  nextTitle?: string | null;
}

interface LessonViewerProps {
  lessonId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  completed: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  completing?: boolean;
  position: LessonPosition;
  onPrev: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
  onOpenOutline?: () => void;
}

function extractStoragePath(fileUrl: string): string | null {
  const markers = ["/object/public/course-resources/", "/object/sign/course-resources/", "/course-resources/"];
  for (const marker of markers) {
    const index = fileUrl.indexOf(marker);
    if (index !== -1) {
      try {
        return decodeURIComponent(fileUrl.substring(index + marker.length).split("?")[0]);
      } catch {
        return fileUrl.substring(index + marker.length).split("?")[0];
      }
    }
  }

  return fileUrl.startsWith("http") ? null : fileUrl;
}

const LessonViewer = ({
  lessonId,
  title,
  description,
  videoUrl,
  completed,
  hasPrev,
  hasNext,
  completing,
  position,
  onPrev,
  onNext,
  onToggleComplete,
  onOpenOutline,
}: LessonViewerProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    setDescriptionExpanded(false);
  }, [lessonId]);

  useEffect(() => {
    let isCurrent = true;
    const fetchResources = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chapter_resources")
        .select("id, title, file_url, file_type")
        .eq("lesson_id", lessonId)
        .order("created_at");

      if (!isCurrent) return;
      setResources(data || []);
      if (error) {
        toast({ title: "Resources unavailable", description: error.message, variant: "destructive" });
      }
      setLoading(false);
    };

    void fetchResources();
    return () => {
      isCurrent = false;
    };
  }, [lessonId]);

  const handleDownload = async (resource: Resource) => {
    const path = extractStoragePath(resource.file_url);
    if (!path) {
      toast({ title: "Download failed", description: "This resource does not have a valid storage path.", variant: "destructive" });
      return;
    }

    setDownloading(resource.id);
    try {
      const { data, error } = await supabase.storage
        .from("course-resources")
        .createSignedUrl(path, 3600, { download: resource.title });

      if (error || !data?.signedUrl) {
        toast({ title: "Download failed", description: error?.message || "Could not create a download link.", variant: "destructive" });
        return;
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Could not open this resource.",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;
  const externalVideoUrl = videoUrl && !embedUrl ? videoUrl : null;
  const isDriveVideo = Boolean(videoUrl && extractGoogleDriveFileId(videoUrl));
  const driveOpenUrl = isDriveVideo && videoUrl ? videoUrl : null;

  return (
    <main className="min-w-0 flex-1 space-y-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:space-y-6 lg:pb-0">
      {embedUrl && (
        <div
          className={cn(
            "z-20 overflow-hidden border-y border-border bg-black",
            "-mx-4 sm:mx-0 sm:rounded-xl sm:border",
            "sticky top-[var(--nav-h,3rem)] lg:static lg:top-auto",
            "phoneLandscape:fixed phoneLandscape:inset-0 phoneLandscape:z-50 phoneLandscape:m-0 phoneLandscape:flex phoneLandscape:items-center phoneLandscape:justify-center phoneLandscape:border-0 phoneLandscape:rounded-none",
          )}
        >
          <div
            className={cn(
              "aspect-video w-full",
              "phoneLandscape:h-[100dvh] phoneLandscape:w-full phoneLandscape:max-w-[calc(100dvh*16/9)] phoneLandscape:aspect-auto",
            )}
          >
            <iframe
              key={lessonId}
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}

      {driveOpenUrl && (
        <p className="text-center text-xs text-muted-foreground lg:text-start">
          Video not playing?{" "}
          <a
            href={driveOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Open in Drive
          </a>
        </p>
      )}

      {externalVideoUrl && (
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <a href={externalVideoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="me-2 h-4 w-4" />
            Open lesson video
          </a>
        </Button>
      )}

      <header className="phoneLandscape:hidden">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Lesson {position.index} of {position.total}
          {position.chapterLabel ? ` · ${position.chapterLabel}` : ""}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold leading-snug lg:text-2xl">{title}</h2>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>
        {description && (
          <div className="mt-2">
            <p
              className={cn(
                "text-sm text-muted-foreground lg:text-base",
                !descriptionExpanded && "line-clamp-3 lg:line-clamp-none",
              )}
            >
              {description}
            </p>
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-primary lg:hidden"
              onClick={() => setDescriptionExpanded((open) => !open)}
            >
              {descriptionExpanded ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </header>

      <div className="phoneLandscape:hidden">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading lesson resources...
          </div>
        ) : resources.length > 0 ? (
          <section className="space-y-3 border-t border-border pt-4 lg:pt-5">
            <h3 className="font-semibold">Lesson resources</h3>
            <ul className="divide-y divide-border">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <Button
                    variant="ghost"
                    onClick={() => void handleDownload(resource)}
                    disabled={downloading === resource.id}
                    className="h-auto min-h-12 w-full justify-start gap-3 whitespace-normal px-2 py-3 text-left"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 break-words">{resource.title}</span>
                    {downloading === resource.id ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                    ) : (
                      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">No resources for this lesson yet.</p>
        )}
      </div>

      {/* Desktop footer */}
      <div className="hidden flex-wrap items-center justify-between gap-3 border-t border-border pt-5 lg:flex">
        <Button variant="outline" size="lg" disabled={!hasPrev || completing} onClick={onPrev}>
          <ArrowLeft className="me-1 h-4 w-4" />
          Previous
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={completed ? "secondary" : "outline"}
            size="lg"
            disabled={completing}
            onClick={onToggleComplete}
          >
            {completing ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : completed ? (
              <CheckCircle2 className="me-2 h-4 w-4 text-emerald-600" />
            ) : (
              <Circle className="me-2 h-4 w-4" />
            )}
            {completed ? "Completed" : "Mark complete"}
          </Button>
          <Button size="lg" disabled={!hasNext || completing} onClick={onNext}>
            Next
            <ArrowRight className="ms-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile sticky nav bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pt-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/85 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden phoneLandscape:hidden">
        <div className="mx-auto flex max-w-3xl items-stretch gap-2">
          {onOpenOutline && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              aria-label="Course content"
              onClick={onOpenOutline}
            >
              <ListVideo className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0"
            aria-label="Previous lesson"
            disabled={!hasPrev || completing}
            onClick={onPrev}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={completed ? "secondary" : "outline"}
            className="h-11 min-w-0 flex-1 gap-1.5 px-2"
            disabled={completing}
            onClick={onToggleComplete}
          >
            {completing ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : completed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate text-xs sm:text-sm">{completed ? "Done" : "Complete"}</span>
          </Button>
          <Button
            type="button"
            className="h-11 min-w-0 flex-[1.4] flex-col gap-0 px-2 py-1"
            disabled={!hasNext || completing}
            onClick={onNext}
          >
            <span className="inline-flex items-center text-sm font-semibold leading-none">
              Next
              <ArrowRight className="ms-1 h-3.5 w-3.5" />
            </span>
            {position.nextTitle ? (
              <span className="mt-0.5 hidden max-w-full truncate text-[10px] font-normal opacity-80 sm:block">
                {position.nextTitle}
              </span>
            ) : null}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LessonViewer;
