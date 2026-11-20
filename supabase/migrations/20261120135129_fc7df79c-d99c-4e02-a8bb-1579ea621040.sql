DROP POLICY "Published lessons visible to all" ON public.course_lessons;
DROP POLICY "Team can view all lessons" ON public.course_lessons;
DROP POLICY "Team can manage lessons" ON public.course_lessons;

CREATE POLICY "Published lessons and team visible" ON public.course_lessons
  FOR SELECT TO anon, authenticated
  USING (
    is_published = true
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'team')
  );

CREATE POLICY "Team can create lessons" ON public.course_lessons
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Team can update lessons" ON public.course_lessons
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Team can delete lessons" ON public.course_lessons
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE INDEX chapter_resources_lesson_id_idx ON public.chapter_resources (lesson_id);
