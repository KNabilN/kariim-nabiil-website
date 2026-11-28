import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import SiteLayout from "@/components/layout/SiteLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseAgentic from "./pages/CourseAgentic";
import ProjectsPage from "./pages/ProjectsPage";
import Contact from "./pages/Contact";
import Enroll from "./pages/Enroll";
import LeadThanks from "./pages/LeadThanks";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CourseLanding from "./pages/CourseLanding";
import CourseLearn from "./pages/CourseLearn";
import StudentProfile from "./pages/StudentProfile";
import TeamDashboard from "./pages/TeamDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Returning from another tab/site shouldn't remount pages or flash loading states
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
    },
  },
});

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/agentic-ai-engineering" element={<CourseAgentic />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/thanks" element={<LeadThanks />} />
              </Route>

              <Route path="/admin/*" element={<Admin />} />
              <Route path="/course/advanced-n8n" element={<CourseLanding />} />
              <Route path="/course/learn/:courseId/:lessonId?" element={<CourseLearn />} />
              <Route path="/course/learn" element={<CourseLearn />} />
              <Route path="/course/profile" element={<StudentProfile />} />
              <Route path="/team-dashboard" element={<TeamDashboard />} />
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
