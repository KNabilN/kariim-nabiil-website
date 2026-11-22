import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "team";

interface AuthRoleState {
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  hasRole: (role: AppRole | AppRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export function useAuthRole(): AuthRoleState {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const rolesUserIdRef = useRef<string | null>(null);
  const loadingUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadRoles = async (userId: string) => {
      if (rolesUserIdRef.current === userId) {
        setLoading(false);
        return;
      }
      if (loadingUserIdRef.current === userId) return;

      loadingUserIdRef.current = userId;
      setLoading(true);
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (!mounted) return;

      if (loadingUserIdRef.current === userId) {
        rolesUserIdRef.current = userId;
        loadingUserIdRef.current = null;
        setRoles((data || []).map((row) => row.role as AppRole));
        setLoading(false);
      }
    };

    const applySession = (next: Session | null) => {
      setSession(next);

      if (!next) {
        rolesUserIdRef.current = null;
        loadingUserIdRef.current = null;
        setRoles([]);
        setLoading(false);
        return;
      }

      // Same user already authorized (token refresh / tab focus) — no UI remount
      if (rolesUserIdRef.current === next.user.id) {
        setLoading(false);
        return;
      }

      void loadRoles(next.user.id);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      applySession(next);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      applySession(data.session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role: AppRole | AppRole[]) => {
    const needed = Array.isArray(role) ? role : [role];
    return needed.some((r) => roles.includes(r));
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    rolesUserIdRef.current = null;
    loadingUserIdRef.current = null;
    setSession(null);
    setRoles([]);
  };

  return { session, roles, loading, hasRole, signIn, signOut };
}
