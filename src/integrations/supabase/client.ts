import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://tnceouccriarrfvlxhst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuY2VvdWNjcmlhcnJmdmx4aHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjY4ODEsImV4cCI6MjA5MDgwMjg4MX0.gT56eXvpA2ansX7uFSpcc7_Q8vXkFDa-Jovq_4GslKY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
