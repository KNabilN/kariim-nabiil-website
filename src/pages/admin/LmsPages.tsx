import {
  CoursePaymentsSection,
  CourseStudentsSection,
  EmployeesTab,
  PaidCoursesManager,
} from "@/components/admin/lms/legacyPanels";
import { CourseContentEditor } from "@/components/admin/lms/CourseContentEditor";
import { useLanguage } from "@/i18n/LanguageProvider";

export function AdminPaidCoursesPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">{t.admin.navPaidCourses}</h1>
      <PaidCoursesManager />
    </div>
  );
}

export function AdminContentPage() {
  const { t, locale } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t.admin.navContent}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "ar"
            ? "ابنِ المنهج بأقسام ومحاضرات بسهولة — زي يوديمي."
            : "Build the curriculum with sections and lectures — Udemy-style."}
        </p>
      </div>
      <CourseContentEditor />
    </div>
  );
}

export function AdminStudentsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">{t.admin.navStudents}</h1>
      <CourseStudentsSection />
    </div>
  );
}

export function AdminPaymentsPage({ userId }: { userId: string }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">{t.admin.navPayments}</h1>
      <CoursePaymentsSection userId={userId} />
    </div>
  );
}

export function AdminEmployeesPage({ session }: { session: { user: { id: string } } }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-navy">{t.admin.navEmployees}</h1>
      <EmployeesTab session={session} />
    </div>
  );
}
