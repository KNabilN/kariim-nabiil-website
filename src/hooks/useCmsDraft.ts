import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSiteContent, setSiteContent, type SiteContentKey } from "@/lib/siteCms";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageProvider";

export function useCmsDraft<T>(key: SiteContentKey, defaults: T) {
  const { t } = useLanguage();
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;
  const [draft, setDraft] = useState<T>(defaults);
  const [saved, setSaved] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    const remote = await getSiteContent<T>(key);
    const next = structuredClone((remote ?? defaultsRef.current) as T);
    setDraft(next);
    setSaved(structuredClone(next));
    setLoading(false);
  }, [key]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const save = async () => {
    setSaving(true);
    try {
      await setSiteContent(key, draft);
      setSaved(structuredClone(draft));
      toast({ title: t.admin.saved });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => setDraft(structuredClone(saved));
  const resetDefaults = () => setDraft(structuredClone(defaultsRef.current));

  return { draft, setDraft, saved, loading, saving, dirty, save, cancel, resetDefaults, reload };
}
