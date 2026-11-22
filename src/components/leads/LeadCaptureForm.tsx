import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCmsBrand, useCmsCatalog } from "@/hooks/useSiteCms";
import { supabase } from "@/integrations/supabase/client";
import { getBrand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import {
  buildLeadWhatsAppMessage,
  buildWhatsAppUrl,
  rememberWhatsAppMessage,
} from "@/lib/whatsapp";

const AI_SALES_COURSE_ID = "ai-sales-automation-n8n";

export type LeadIntent = "enroll" | "contact";
export type LeadInterestType = "course" | "consultation" | "project";

interface LeadCaptureFormProps {
  intent: LeadIntent;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  defaultInterest?: LeadInterestType;
}

export interface LeadSubmission {
  name: string;
  email: string;
  whatsapp: string;
  intent: LeadIntent;
  interestType: LeadInterestType;
  courseId?: string;
  courseTitle?: string;
  discountCode?: string;
  companyName?: string;
  jobTitle?: string;
  linkedin?: string;
  meetingDetails?: string;
  createdAt: string;
}

type PaidCourseOption = { id: string; title: string; href?: string };

export default function LeadCaptureForm({
  intent,
  title,
  subtitle,
  submitLabel,
  defaultInterest,
}: LeadCaptureFormProps) {
  const { t, locale } = useLanguage();
  const { data: catalog = [], isLoading: loadingCourses } = useCmsCatalog(locale);
  const { data: brand } = useCmsBrand(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [interestType, setInterestType] = useState<LeadInterestType | "">(
    defaultInterest || (intent === "enroll" ? "course" : ""),
  );
  const [courseId, setCourseId] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const paidCourses = useMemo(() => {
    return catalog
      .filter((course) => !course.free)
      .map((course) => ({ id: course.id, title: course.title, href: course.href }))
      .sort((a, b) => a.title.localeCompare(b.title, locale === "ar" ? "ar" : "en"));
  }, [catalog, locale]);

  const selectedCourseTitle = useMemo(
    () => paidCourses.find((course) => course.id === courseId)?.title || "",
    [paidCourses, courseId],
  );

  const needsCourse = interestType === "course";
  const needsMeeting = interestType === "consultation" || interestType === "project";

  const canSubmit =
    Boolean(name.trim() && email.trim() && whatsapp.trim() && interestType) &&
    (!needsCourse || Boolean(courseId)) &&
    (!needsMeeting || Boolean(companyName.trim() && jobTitle.trim() && meetingDetails.trim()));

  const clearMeetingFields = () => {
    setCompanyName("");
    setJobTitle("");
    setLinkedin("");
    setMeetingDetails("");
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !interestType) return;

    setSubmitting(true);
    const payload: LeadSubmission = {
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      intent,
      interestType,
      courseId: needsCourse ? courseId : undefined,
      courseTitle: needsCourse ? selectedCourseTitle : undefined,
      discountCode: needsCourse ? discountCode.trim() || undefined : undefined,
      companyName: needsMeeting ? companyName.trim() : undefined,
      jobTitle: needsMeeting ? jobTitle.trim() : undefined,
      linkedin: needsMeeting ? linkedin.trim() || undefined : undefined,
      meetingDetails: needsMeeting ? meetingDetails.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("leads").insert({
        name: payload.name,
        email: payload.email,
        whatsapp: payload.whatsapp,
        intent: payload.intent,
        status: "new",
        interest_type: payload.interestType,
        course_id: payload.courseId || null,
        course_title: payload.courseTitle || null,
        discount_code: payload.discountCode || null,
        company_name: payload.companyName || null,
        job_title: payload.jobTitle || null,
        linkedin: payload.linkedin || null,
        meeting_details: payload.meetingDetails || null,
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

    if (needsCourse && courseId === AI_SALES_COURSE_ID) {
      const salesUrl =
        paidCourses.find((course) => course.id === AI_SALES_COURSE_ID)?.href ||
        brand?.salesCourseUrl ||
        "https://www.udemy.com/course/ai-sales-automation-using-n8n/";
      window.location.assign(salesUrl);
      return;
    }

    const brandDefaults = getBrand(locale);
    const interestLabel =
      payload.interestType === "course"
        ? t.lead.interestCourse
        : payload.interestType === "consultation"
          ? t.lead.interestConsultation
          : t.lead.interestProject;

    const message = buildLeadWhatsAppMessage({
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      interestLabel,
      courseTitle: payload.courseTitle,
      discountCode: payload.discountCode,
      jobTitle: payload.jobTitle,
      companyName: payload.companyName,
      meetingDetails: payload.meetingDetails,
      linkedin: payload.linkedin,
      locale,
    });
    rememberWhatsAppMessage(message);

    // Always open WhatsApp with the team inbox — never the lead's own number.
    window.location.assign(
      buildWhatsAppUrl({
        phone: brandDefaults.phone,
        whatsappUrl: brandDefaults.whatsappUrl,
        text: message,
      }),
    );
  };

  const onCourseChange = (nextId: string) => {
    setCourseId(nextId);
    if (nextId !== AI_SALES_COURSE_ID) return;
    const salesUrl =
      paidCourses.find((course) => course.id === AI_SALES_COURSE_ID)?.href ||
      brand?.salesCourseUrl ||
      "https://www.udemy.com/course/ai-sales-automation-using-n8n/";
    window.location.assign(salesUrl);
  };

  const interestOptions: { value: LeadInterestType; label: string }[] = [
    { value: "course", label: t.lead.interestCourse },
    { value: "consultation", label: t.lead.interestConsultation },
    { value: "project", label: t.lead.interestProject },
  ];

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

      <div>
        <Label>{t.lead.interestType}</Label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {interestOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setInterestType(option.value);
                if (option.value !== "course") {
                  setCourseId("");
                  setDiscountCode("");
                }
                if (option.value === "course") clearMeetingFields();
              }}
              className={cn(
                "rounded-md border px-2 py-2.5 text-sm font-semibold transition-colors",
                interestType === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {needsCourse && (
        <div>
          <Label htmlFor="lead-course">{t.lead.selectCourse}</Label>
          <select
            id="lead-course"
            value={courseId}
            onChange={(event) => onCourseChange(event.target.value)}
            required
            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">{loadingCourses ? t.lead.saving : t.lead.selectCoursePlaceholder}</option>
            {paidCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {!loadingCourses && paidCourses.length === 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground">{t.lead.noPaidCourses}</p>
          )}

          <div className="mt-4">
            <Label htmlFor="lead-discount-code">
              {t.lead.discountCode}{" "}
              <span className="font-normal text-muted-foreground">({t.lead.discountCodeOptional})</span>
            </Label>
            <Input
              id="lead-discount-code"
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              className="mt-1.5"
              placeholder={t.lead.discountCodePlaceholder}
              autoComplete="off"
            />
          </div>
        </div>
      )}

      {needsMeeting && (
        <>
          <div>
            <Label htmlFor="lead-job-title">{t.lead.jobTitle}</Label>
            <Input
              id="lead-job-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className="mt-1.5"
              placeholder={t.lead.jobTitlePlaceholder}
              required
              autoComplete="organization-title"
            />
          </div>
          <div>
            <Label htmlFor="lead-company">{t.lead.companyName}</Label>
            <Input
              id="lead-company"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="mt-1.5"
              placeholder={t.lead.companyPlaceholder}
              required
              autoComplete="organization"
            />
          </div>
          <div>
            <Label htmlFor="lead-meeting">{t.lead.meetingDetails}</Label>
            <Textarea
              id="lead-meeting"
              value={meetingDetails}
              onChange={(event) => setMeetingDetails(event.target.value)}
              className="mt-1.5 min-h-[110px]"
              placeholder={t.lead.meetingPlaceholder}
              required
            />
          </div>
          <div>
            <Label htmlFor="lead-linkedin">
              {t.lead.linkedin}{" "}
              <span className="font-normal text-muted-foreground">({t.lead.linkedinOptional})</span>
            </Label>
            <Input
              id="lead-linkedin"
              type="url"
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              className="mt-1.5"
              placeholder={t.lead.linkedinPlaceholder}
              autoComplete="url"
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={submitting || !canSubmit}>
        {submitting ? t.lead.saving : submitLabel || t.lead.continue}
      </Button>
    </form>
  );
}
