import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "@/hooks/use-toast";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  intent: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const { t } = useLanguage();
  const a = t.admin;
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load leads", description: error.message, variant: "destructive" });
    setLeads((data as LeadRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchLeads();
  }, []);

  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const intentOk = intent === "all" || lead.intent === intent;
        const statusOk = status === "all" || lead.status === status;
        return intentOk && statusOk;
      }),
    [leads, intent, status],
  );

  const markHandled = async (id: string) => {
    const { error } = await supabase.from("leads").update({ status: "handled" }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else fetchLeads();
  };

  const waLink = (whatsapp: string) => {
    const digits = whatsapp.replace(/[^\d+]/g, "");
    return `https://wa.me/${digits.replace(/^\+/, "")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{a.navLeads}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} / {leads.length}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={intent} onChange={(e) => setIntent(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All intents</option>
          <option value="enroll">Enroll</option>
          <option value="contact">Contact</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All status</option>
          <option value="new">New</option>
          <option value="handled">Handled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">{a.empty}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <article key={lead.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-navy">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lead.email} · {lead.whatsapp}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {lead.intent} · {lead.status} · {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={waLink(lead.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="me-1 h-4 w-4" />
                      {a.openWhatsApp}
                    </a>
                  </Button>
                  {lead.status !== "handled" && (
                    <Button size="sm" onClick={() => void markHandled(lead.id)}>
                      {a.markHandled}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
