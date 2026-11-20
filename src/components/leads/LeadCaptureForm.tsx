import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

export type LeadIntent = "enroll" | "contact";

interface LeadCaptureFormProps {
  intent: LeadIntent;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  whatsapp: string;
  intent: LeadIntent;
  createdAt: string;
}

export default function LeadCaptureForm({
  intent,
  title,
  subtitle,
  submitLabel,
}: LeadCaptureFormProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) return;

    setSubmitting(true);
    const payload: LeadSubmission = {
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      intent,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("leads").insert({
        name: payload.name,
        email: payload.email,
        whatsapp: payload.whatsapp,
        intent: payload.intent,
        status: "new",
      });
    } catch {
      // continue — local backup below
    }

    try {
      const existing = JSON.parse(localStorage.getItem("lead_submissions") || "[]");
      localStorage.setItem("lead_submissions", JSON.stringify([payload, ...existing].slice(0, 50)));
      sessionStorage.setItem("latest_lead", JSON.stringify(payload));
    } catch {
      // continue even if storage fails
    }

    navigate(`/thanks?intent=${intent}`, { replace: true });
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mx-auto w-full max-w-md space-y-5 rounded-md border border-border bg-card p-6 shadow-sm md:p-8">
      {(title || subtitle) && (
        <div>
          {title && <h1 className="text-2xl font-bold text-navy">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="lead-name">{t.lead.fullName}</Label>
        <Input
          id="lead-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5"
          placeholder={t.lead.namePlaceholder}
          required
          autoComplete="name"
        />
      </div>

      <div>
        <Label htmlFor="lead-email">{t.lead.email}</Label>
        <Input
          id="lead-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5"
          placeholder={t.lead.emailPlaceholder}
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Label htmlFor="lead-whatsapp">{t.lead.whatsapp}</Label>
        <Input
          id="lead-whatsapp"
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          className="mt-1.5"
          placeholder={t.lead.whatsappPlaceholder}
          required
          autoComplete="tel"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? t.lead.saving : submitLabel || t.lead.continue}
      </Button>
    </form>
  );
}
