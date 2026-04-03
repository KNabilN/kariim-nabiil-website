import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  file_url: string;
  file_type: string | null;
}

interface ChapterViewerProps {
  chapterId: string;
  title: string;
  description: string | null;
  youtubeUrl: string | null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return null;
  } catch {
    return null;
  }
}

const ChapterViewer = ({ chapterId, title, description, youtubeUrl }: ChapterViewerProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chapter_resources")
        .select("id, title, file_url, file_type")
        .eq("chapter_id", chapterId);
      setResources(data || []);
      setLoading(false);
    };
    fetchResources();
  }, [chapterId]);

  const embedUrl = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : null;

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      {embedUrl && (
        <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-secondary/20">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading resources...
        </div>
      ) : resources.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Resources</h3>
          {resources.map((r) => (
            <a
              key={r.id}
              href={r.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium flex-1">{r.title}</span>
              <Download className="w-4 h-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterViewer;
