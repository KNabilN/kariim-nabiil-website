import { useEffect, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSiteContent, setSiteContent, type SiteContentKey } from "@/lib/siteCms";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/hooks/use-toast";

interface SiteJsonEditorProps {
  contentKey: SiteContentKey;
  title: string;
  description?: string;
  defaults: unknown;
}

export default function SiteJsonEditor({ contentKey, title, description, defaults }: SiteJsonEditorProps) {
  const { t } = useLanguage();
  const a = t.admin;
  const defaultsRef = useRef(defaults);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const remote = await getSiteContent<unknown>(contentKey);
      if (!alive) return;
      setText(JSON.stringify(remote ?? defaultsRef.current, null, 2));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [contentKey]);

  const onSave = async () => {
    try {
      const parsed = JSON.parse(text);
      setSaving(true);
      await setSiteContent(contentKey, parsed);
      toast({ title: a.saved });
    } catch (error) {
      toast({
        title: "Invalid JSON / فشل الحفظ",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setText(JSON.stringify(defaultsRef.current, null, 2))}>
            Defaults
          </Button>
          <Button type="button" onClick={() => void onSave()} disabled={saving}>
            {saving ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Save className="me-2 h-4 w-4" />}
            {a.save}
          </Button>
        </div>
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[520px] font-mono text-xs leading-5" spellCheck={false} />
    </div>
  );
}
