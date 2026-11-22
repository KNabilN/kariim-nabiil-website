import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle2, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getVideoEmbedUrl } from "@/lib/videoUrl";

interface Resource {
  id: string;
  title: string;
  file_url: string;
  file_type: string | null;
}

interface LessonViewerProps {
  lessonId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  completed: boolean;
  hasNext: boolean;
  completing?: boolean;
  onCompleteAndNext: () => void;
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
  hasNext,
  completing,
  onCompleteAndNext,
}: LessonViewerProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

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

  return (
    <main className="min-w-0 flex-1 space-y-4 pb-24 lg:space-y-6 lg:pb-0">
      {embedUrl && (
        <div className="-mx-4 overflow-hidden border-y border-border bg-black sm:mx-0 sm:rounded-xl sm:border">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {externalVideoUrl && (
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <a href={externalVideoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="me-2 h-4 w-4" />
            Open lesson video
          </a>
        </Button>
      )}

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold leading-snug lg:text-2xl">{title}</h2>
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>
        {description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground lg:line-clamp-none lg:text-base">{description}</p>}
      </header>

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

      {/* Desktop footer */}
      <div className="hidden flex-wrap items-center justify-between gap-3 border-t border-border pt-5 lg:flex">
        <p className="text-sm text-muted-foreground">
          {completed
            ? hasNext
              ? "Lecture marked complete. Continue when you're ready."
              : "Lecture marked complete."
            : "Mark this lecture complete to track your progress."}
        </p>
        <Button size="lg" disabled={completing} onClick={onCompleteAndNext}>
          {completing ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
          {hasNext ? (
            <>
              {completed ? "Next" : "Complete & Next"}
              <ArrowRight className="ms-1 h-4 w-4" />
            </>
          ) : completed ? (
            "Course finished"
          ) : (
            "Complete lecture"
          )}
        </Button>
      </div>

      {/* Mobile sticky complete bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {completed ? (hasNext ? "Ready for the next lecture" : "Course finished") : "Mark complete to continue"}
          </p>
          <Button className="shrink-0" disabled={completing} onClick={onCompleteAndNext}>
            {completing ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
            {hasNext ? (
              <>
                {completed ? "Next" : "Complete & Next"}
                <ArrowRight className="ms-1 h-4 w-4" />
              </>
            ) : completed ? (
              "Done"
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LessonViewer;
