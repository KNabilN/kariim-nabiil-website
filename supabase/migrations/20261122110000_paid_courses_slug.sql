-- Link LMS paid_courses to public catalog course ids (e.g. agentic-ai-engineering)
ALTER TABLE public.paid_courses
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS paid_courses_slug_unique
  ON public.paid_courses (slug)
  WHERE slug IS NOT NULL;

-- Seed the public Agentic course into LMS so it appears in Admin → Course Content
INSERT INTO public.paid_courses (title, price, currency, is_active, slug)
SELECT
  'Agentic AI Engineering: From Zero to Job-Ready',
  3500,
  'EGP',
  true,
  'agentic-ai-engineering'
WHERE NOT EXISTS (
  SELECT 1 FROM public.paid_courses WHERE slug = 'agentic-ai-engineering'
);
