import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type SiteContentKey =
  | "home"
  | "brand"
  | "catalog"
  | "projects"
  | "cv"
  | "gallery"
  | "course_reviews";

export async function getSiteContent<T>(key: SiteContentKey): Promise<T | null> {
  const { data, error } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
  if (error || !data) return null;
  return data.value as T;
}

export async function setSiteContent(key: SiteContentKey, value: unknown) {
  const { error } = await supabase.from("site_content").upsert({
    key,
    value: value as Json,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function uploadSiteMedia(file: File, folder = "uploads") {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}
