import { supabase } from "@/integrations/supabase/client";

export const AGENTIC_COURSE_SLUG = "agentic-ai-engineering";
export const AGENTIC_COURSE_TITLE = "Agentic AI Engineering: From Zero to Job-Ready";
export const AGENTIC_COURSE_PRICE = 3500;
export const AGENTIC_COURSE_CURRENCY = "EGP";

export type EnsuredPaidCourse = {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  slug: string | null;
};

function isMissingSlugColumn(message?: string) {
  return /column .*slug.* does not exist|Could not find the .*slug/i.test(message || "");
}

/**
 * Ensures the public Agentic course exists as an LMS paid_courses row
 * so it appears in Admin → Course Content.
 */
export async function ensureAgenticPaidCourse(): Promise<EnsuredPaidCourse | null> {
  const bySlug = await supabase
    .from("paid_courses")
    .select("id, title, price, currency, slug")
    .eq("slug", AGENTIC_COURSE_SLUG)
    .maybeSingle();

  if (!bySlug.error && bySlug.data) {
    return bySlug.data;
  }

  const slugMissing = isMissingSlugColumn(bySlug.error?.message);

  // Match an existing course by title if slug isn't set / column missing
  if (slugMissing) {
    const byTitle = await supabase
      .from("paid_courses")
      .select("id, title, price, currency")
      .ilike("title", "%Agentic AI Engineering%")
      .limit(1)
      .maybeSingle();

    if (byTitle.data) {
      return { ...byTitle.data, slug: null };
    }

    const { data: created, error: insertError } = await supabase
      .from("paid_courses")
      .insert({
        title: AGENTIC_COURSE_TITLE,
        price: AGENTIC_COURSE_PRICE,
        currency: AGENTIC_COURSE_CURRENCY,
        is_active: true,
      })
      .select("id, title, price, currency")
      .single();

    if (insertError || !created) {
      console.warn("ensureAgenticPaidCourse insert:", insertError?.message);
      return null;
    }
    return { ...created, slug: null };
  }

  const byTitle = await supabase
    .from("paid_courses")
    .select("id, title, price, currency, slug")
    .ilike("title", "%Agentic AI Engineering%")
    .limit(1)
    .maybeSingle();

  if (byTitle.data) {
    if (!byTitle.data.slug) {
      await supabase.from("paid_courses").update({ slug: AGENTIC_COURSE_SLUG }).eq("id", byTitle.data.id);
      return { ...byTitle.data, slug: AGENTIC_COURSE_SLUG };
    }
    return byTitle.data;
  }

  const { data: created, error: insertError } = await supabase
    .from("paid_courses")
    .insert({
      title: AGENTIC_COURSE_TITLE,
      price: AGENTIC_COURSE_PRICE,
      currency: AGENTIC_COURSE_CURRENCY,
      is_active: true,
      slug: AGENTIC_COURSE_SLUG,
    })
    .select("id, title, price, currency, slug")
    .single();

  if (insertError || !created) {
    console.warn("ensureAgenticPaidCourse insert:", insertError?.message);
    return null;
  }

  return created;
}
