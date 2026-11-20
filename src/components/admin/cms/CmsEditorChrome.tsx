import type { ReactNode } from "react";
import { Loader2, RotateCcw, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";

interface CmsEditorChromeProps {
  title: string;
  description?: string;
  loading?: boolean;
  saving?: boolean;
  dirty?: boolean;
  onSave: () => void;
  onCancel: () => void;
  onResetDefaults?: () => void;
  children: ReactNode;
}

export default function CmsEditorChrome({
  title,
  description,
  loading,
  saving,
  dirty,
  onSave,
  onCancel,
  onResetDefaults,
  children,
}: CmsEditorChromeProps) {
  const { t } = useLanguage();
  const a = t.admin;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-20 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            {dirty && <p className="mt-1 text-xs font-semibold text-amber-600">Unsaved changes · تعديلات غير محفوظة</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {onResetDefaults && (
              <Button type="button" variant="outline" onClick={onResetDefaults}>
                <RotateCcw className="me-1.5 h-4 w-4" />
                Defaults
              </Button>
            )}
            <Button type="button" variant="outline" disabled={!dirty || saving} onClick={onCancel}>
              <X className="me-1.5 h-4 w-4" />
              {a.cancel}
            </Button>
            <Button type="button" disabled={!dirty || saving} onClick={onSave}>
              {saving ? <Loader2 className="me-1.5 h-4 w-4 animate-spin" /> : <Save className="me-1.5 h-4 w-4" />}
              {a.save}
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
