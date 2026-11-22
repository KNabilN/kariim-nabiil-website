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
  interest_type: string | null;
  course_title: string | null;
  company_name: string | null;
  job_title: string | null;
  linkedin: string | null;
  meeting_details: string | null;
  discount_requested: string | null;
}

function interestLabel(type: string | null, locale: string) {
  if (type === "course") return locale === "ar" ? "كورس" : "Course";
  if (type === "consultation") return locale === "ar" ? "استشارة" : "Consultation";
  if (type === "project") return locale === "ar" ? "مشروع" : "Project";
  if (type === "financial_aid") return locale === "ar" ? "دعم مالي" : "Financial aid";
  return null;
}

export default function LeadsPage() {
  const { t, locale } = useLanguage();
  const a = t.admin;
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState("all");
  const [status, setStatus] = useState("all");
  const [interest, setInterest] = useState("all");

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
        const interestOk = interest === "all" || lead.interest_type === interest;
        return intentOk && statusOk && interestOk;
      }),
    [leads, intent, status, interest],
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
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} / {leads.length}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={intent} onChange={(e) => setIntent(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All intents</option>
          <option value="enroll">Enroll</option>
          <option value="contact">Contact</option>
        </select>
        <select value={interest} onChange={(e) => setInterest(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">{locale === "ar" ? "كل الاهتمامات" : "All interests"}</option>
          <option value="course">{t.lead.interestCourse}</option>
          <option value="consultation">{t.lead.interestConsultation}</option>
          <option value="project">{t.lead.interestProject}</option>
          <option value="financial_aid">{locale === "ar" ? "دعم مالي" : "Financial aid"}</option>
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
          {filtered.map((lead) => {
            const label = interestLabel(lead.interest_type, locale);
            return (
              <article key={lead.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-bold text-navy">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.email} · {lead.whatsapp}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      {lead.intent}
                      {label ? ` · ${label}` : ""} · {lead.status} · {new Date(lead.created_at).toLocaleString()}
                    </p>
                    {lead.interest_type === "course" && lead.course_title && (
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{t.lead.selectCourse}:</span> {lead.course_title}
                      </p>
                    )}
                    {lead.interest_type === "financial_aid" && (
                      <div className="space-y-1 text-sm text-foreground">
                        {lead.course_title && (
                          <p>
                            <span className="font-semibold">{t.lead.selectCourse}:</span> {lead.course_title}
                          </p>
                        )}
                        {lead.discount_requested && (
                          <p>
                            <span className="font-semibold">{t.lead.aidDiscount}:</span> {lead.discount_requested}
                          </p>
                        )}
                        {lead.meeting_details && (
                          <p className="whitespace-pre-wrap text-muted-foreground">{lead.meeting_details}</p>
                        )}
                      </div>
                    )}
                    {(lead.interest_type === "consultation" || lead.interest_type === "project") && (
                      <div className="space-y-1 text-sm text-foreground">
                        {lead.job_title && (
                          <p>
                            <span className="font-semibold">{t.lead.jobTitle}:</span> {lead.job_title}
                          </p>
                        )}
                        {lead.company_name && (
                          <p>
                            <span className="font-semibold">{t.lead.companyName}:</span> {lead.company_name}
                          </p>
                        )}
                        {lead.linkedin && (
                          <p>
                            <span className="font-semibold">{t.lead.linkedin}:</span>{" "}
                            <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
                              {lead.linkedin}
                            </a>
                          </p>
                        )}
                        {lead.meeting_details && (
                          <p className="whitespace-pre-wrap text-muted-foreground">{lead.meeting_details}</p>
                        )}
                      </div>
                    )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
