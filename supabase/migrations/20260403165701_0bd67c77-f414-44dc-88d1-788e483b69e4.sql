
-- 1. Create paid_courses table
CREATE TABLE public.paid_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric DEFAULT 0,
  currency text DEFAULT 'EGP',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.paid_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active courses" ON public.paid_courses
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Team can manage courses" ON public.paid_courses
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'team'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'team'));

CREATE POLICY "Team can view all courses" ON public.paid_courses
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'team'));

-- 2. Create course_student_access junction table
CREATE TABLE public.course_student_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.course_students(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.paid_courses(id) ON DELETE CASCADE NOT NULL,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE public.course_student_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read access" ON public.course_student_access
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Team can manage access" ON public.course_student_access
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'team'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'team'));

-- 3. Add course_id to payment_submissions
ALTER TABLE public.payment_submissions ADD COLUMN course_id uuid REFERENCES public.paid_courses(id);
