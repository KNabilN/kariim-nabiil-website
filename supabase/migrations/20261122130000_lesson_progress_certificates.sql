-- Student lesson progress + course completion certificates

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.course_students(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.paid_courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_student_course_idx
  ON public.lesson_progress (student_id, course_id);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lesson progress"
  ON public.lesson_progress FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert lesson progress"
  ON public.lesson_progress FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete lesson progress"
  ON public.lesson_progress FOR DELETE TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS public.course_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.course_students(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.paid_courses(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  course_title text NOT NULL,
  certificate_code text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS course_certificates_student_idx
  ON public.course_certificates (student_id);

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read certificates"
  ON public.course_certificates FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert certificates"
  ON public.course_certificates FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update certificates"
  ON public.course_certificates FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, DELETE ON public.lesson_progress TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.course_certificates TO anon, authenticated;
