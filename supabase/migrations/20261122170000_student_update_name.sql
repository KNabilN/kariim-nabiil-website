-- Allow students (anon device-gate flow) to update their own profile name.
-- Team/admin already have full manage policy.

CREATE POLICY "Anyone can update student profile name"
  ON public.course_students FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT UPDATE ON public.course_students TO anon, authenticated;
