import { Link } from "react-router-dom";
import { CreditCard, Home, LogOut, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequireRole from "@/components/auth/RequireRole";
import BulkAgenticGrant from "@/components/admin/lms/BulkAgenticGrant";
import { CoursePaymentsSection, CourseStudentsSection } from "@/components/admin/lms/legacyPanels";

export default function TeamDashboard() {
  return (
    <RequireRole roles={["team", "admin"]} title="Team Login">
      {({ session, signOut }) => (
        <div className="min-h-screen bg-background">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h1 className="text-xl font-bold text-navy">Team Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/">
                  <Home className="me-2 h-4 w-4" /> Home
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                <LogOut className="me-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>
          <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
            <Tabs defaultValue="add">
              <TabsList className="mb-6">
                <TabsTrigger value="add">
                  <UserPlus className="me-1 h-4 w-4" /> Add Student
                </TabsTrigger>
                <TabsTrigger value="students">
                  <Users className="me-1 h-4 w-4" /> Students
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <CreditCard className="me-1 h-4 w-4" /> Payments
                </TabsTrigger>
              </TabsList>
              <TabsContent value="add">
                <CourseStudentsSection variant="add" addedBy="team" />
                <BulkAgenticGrant />
              </TabsContent>
              <TabsContent value="students">
                <CourseStudentsSection variant="list" />
              </TabsContent>
              <TabsContent value="payments">
                <CoursePaymentsSection userId={session.user.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </RequireRole>
  );
}
