import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRole, type AppRole } from "@/hooks/useAuthRole";
import { useLanguage } from "@/i18n/LanguageProvider";

interface RequireRoleProps {
  roles: AppRole | AppRole[];
  children: (ctx: { session: NonNullable<ReturnType<typeof useAuthRole>["session"]>; signOut: () => Promise<void> }) => ReactNode;
  title?: string;
}

export default function RequireRole({ roles, children, title }: RequireRoleProps) {
  const { t, locale } = useLanguage();
  const { session, loading, hasRole, signIn, signOut } = useAuthRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const a = t.admin;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    const onSubmit = async (event: FormEvent) => {
      event.preventDefault();
      setLoginLoading(true);
      setLoginError("");
      const error = await signIn(email, password);
      if (error) setLoginError(error);
      setLoginLoading(false);
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-navy">{title || a.loginTitle}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{a.loginSubtitle}</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="auth-email">{a.email}</Label>
              <Input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="auth-password">{a.password}</Label>
              <Input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
            </div>
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {a.signIn}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">{locale === "ar" ? "لوحة تحكم آمنة" : "Secure control center"}</p>
        </div>
      </div>
    );
  }

  if (!hasRole(roles)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-navy">{a.accessDenied}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{a.noPrivileges}</p>
          <Button variant="outline" className="mt-6" onClick={() => void signOut()}>
            <LogOut className="me-2 h-4 w-4" />
            {a.signOut}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children({ session, signOut })}</>;
}
