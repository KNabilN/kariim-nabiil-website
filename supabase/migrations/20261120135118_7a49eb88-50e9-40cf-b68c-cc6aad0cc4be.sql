CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.course_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.course_lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published lessons visible to all" ON public.course_lessons
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Team can view all lessons" ON public.course_lessons
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Team can manage lessons" ON public.course_lessons
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE INDEX course_lessons_chapter_order_idx ON public.course_lessons (chapter_id, order_index);

CREATE OR REPLACE FUNCTION public.set_course_lessons_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_course_lessons_updated_at();

ALTER TABLE public.chapter_resources
  ADD COLUMN lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE;

INSERT INTO public.course_lessons (chapter_id, title, description, video_url, order_index, is_published)
SELECT c.id, c.title, c.description, c.youtube_url, 0, c.is_published
FROM public.course_chapters c
WHERE c.youtube_url IS NOT NULL
   OR EXISTS (
     SELECT 1 FROM public.chapter_resources r WHERE r.chapter_id = c.id
   );

UPDATE public.chapter_resources r
SET lesson_id = l.id
FROM public.course_lessons l
WHERE l.chapter_id = r.chapter_id AND l.order_index = 0;
