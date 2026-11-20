import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = parsed.searchParams.get("v");

    if (host === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] || null;
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!videoId && ["embed", "shorts", "live"].includes(segments[0] || "")) {
        videoId = segments[1] || null;
      }
    } else {
      return null;
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null;
  } catch {
    return null;
  }
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

const LessonViewer = ({ lessonId, title, description, videoUrl }: LessonViewerProps) => {
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

    fetchResources();
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

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;
  const externalVideoUrl = videoUrl && !embedUrl ? videoUrl : null;

  return (
    <main className="min-w-0 flex-1 space-y-6">
      <header>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </header>

      {embedUrl && (
        <div className="aspect-video overflow-hidden rounded-xl border border-border bg-secondary/20">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      {externalVideoUrl && (
        <Button variant="outline" asChild>
          <a href={externalVideoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open lesson video
          </a>
        </Button>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading lesson resources...
        </div>
      ) : resources.length > 0 ? (
        <section className="space-y-3 border-t border-border pt-5">
          <h3 className="font-semibold">Lesson resources</h3>
          <ul className="divide-y divide-border">
            {resources.map((resource) => (
              <li key={resource.id}>
                <Button
                  variant="ghost"
                  onClick={() => handleDownload(resource)}
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
    </main>
  );
};

export default LessonViewer;