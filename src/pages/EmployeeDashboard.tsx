import { CreditCard, LogOut, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequireRole from "@/components/auth/RequireRole";
import { CoursePaymentsSection, CourseStudentsSection } from "@/components/admin/lms/legacyPanels";

export default function EmployeeDashboard() {
  return (
    <RequireRole roles={["team", "admin"]} title="Employee Login">
      {({ session, signOut }) => (
        <div className="min-h-screen bg-background">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h1 className="text-xl font-bold text-navy">Employee Dashboard</h1>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="me-2 h-4 w-4" /> Logout
            </Button>
          </header>
          <div className="container mx-auto px-6 py-8">
            <Tabs defaultValue="payments">
              <TabsList className="mb-6">
                <TabsTrigger value="payments">
                  <CreditCard className="me-1 h-4 w-4" /> Payments
                </TabsTrigger>
                <TabsTrigger value="students">
                  <Users className="me-1 h-4 w-4" /> Students
                </TabsTrigger>
                <TabsTrigger value="add">
                  <UserPlus className="me-1 h-4 w-4" /> Add Student
                </TabsTrigger>
              </TabsList>
              <TabsContent value="payments">
                <CoursePaymentsSection userId={session.user.id} />
              </TabsContent>
              <TabsContent value="students">
                <CourseStudentsSection />
              </TabsContent>
              <TabsContent value="add">
                <CourseStudentsSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </RequireRole>
  );
}
