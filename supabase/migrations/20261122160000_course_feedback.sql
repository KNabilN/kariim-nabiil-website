-- Course ratings + comments (mid-course and end-of-course)

CREATE TABLE IF NOT EXISTS public.course_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.course_students(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.paid_courses(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  student_email text NOT NULL,
  course_title text NOT NULL,
  stage text NOT NULL CHECK (stage IN ('mid', 'end')),
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, stage)
);

CREATE INDEX IF NOT EXISTS course_feedback_course_idx
  ON public.course_feedback (course_id, created_at DESC);

CREATE INDEX IF NOT EXISTS course_feedback_created_idx
  ON public.course_feedback (created_at DESC);

ALTER TABLE public.course_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit course feedback"
  ON public.course_feedback FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read own feedback rows"
  ON public.course_feedback FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can delete course feedback"
  ON public.course_feedback FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT ON public.course_feedback TO anon, authenticated;
GRANT DELETE ON public.course_feedback TO authenticated;
