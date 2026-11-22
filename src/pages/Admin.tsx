import { Navigate, Route, Routes } from "react-router-dom";
import RequireRole from "@/components/auth/RequireRole";
import AdminShell from "@/components/admin/shell/AdminShell";
import OverviewPage from "@/pages/admin/OverviewPage";
import LeadsPage from "@/pages/admin/LeadsPage";
import FeedbackPage from "@/pages/admin/FeedbackPage";
import {
  AdminBrandCmsPage,
  AdminCatalogCmsPage,
  AdminCvCmsPage,
  AdminGalleryCmsPage,
  AdminHomeCmsPage,
  AdminProjectsCmsPage,
} from "@/pages/admin/CmsPages";
import {
  AdminContentPage,
  AdminEmployeesPage,
  AdminPaidCoursesPage,
  AdminPaymentsPage,
  AdminStudentsPage,
} from "@/pages/admin/LmsPages";

export default function Admin() {
  return (
    <RequireRole roles="admin">
      {({ session, signOut }) => (
        <Routes>
          <Route element={<AdminShell onSignOut={() => void signOut()} />}>
            <Route index element={<OverviewPage />} />
            <Route path="home" element={<AdminHomeCmsPage />} />
            <Route path="catalog" element={<AdminCatalogCmsPage />} />
            <Route path="projects" element={<AdminProjectsCmsPage />} />
            <Route path="cv" element={<AdminCvCmsPage />} />
            <Route path="gallery" element={<AdminGalleryCmsPage />} />
            <Route path="brand" element={<AdminBrandCmsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="lms/courses" element={<AdminPaidCoursesPage />} />
            <Route path="lms/content" element={<AdminContentPage />} />
            <Route path="lms/students" element={<AdminStudentsPage />} />
            <Route path="lms/payments" element={<AdminPaymentsPage userId={session.user.id} />} />
            <Route path="employees" element={<AdminEmployeesPage session={session} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      )}
    </RequireRole>
  );
}
