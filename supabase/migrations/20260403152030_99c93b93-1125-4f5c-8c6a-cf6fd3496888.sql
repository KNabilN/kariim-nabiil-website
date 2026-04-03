
-- 1. Create enums
CREATE TYPE public.payment_method AS ENUM ('paypal', 'instapay', 'vodafone_cash');
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.app_role AS ENUM ('admin', 'team');

-- 2. user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS for user_roles
CREATE POLICY "Team and admin can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Admin can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. payment_submissions table
CREATE TABLE public.payment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  screenshot_url TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit payment" ON public.payment_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Team can view payments" ON public.payment_submissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Team can update payments" ON public.payment_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

-- 6. course_students table
CREATE TABLE public.course_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  added_by TEXT NOT NULL DEFAULT 'payment',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can manage students" ON public.course_students
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Students can check own access" ON public.course_students
  FOR SELECT TO anon, authenticated
  USING (true);

-- 7. student_devices table
CREATE TABLE public.student_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.course_students(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT NOT NULL DEFAULT 'Unknown Device',
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, device_fingerprint)
);
ALTER TABLE public.student_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage devices" ON public.student_devices
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 8. course_chapters table
CREATE TABLE public.course_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published chapters visible to all" ON public.course_chapters
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Team can view all chapters" ON public.course_chapters
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

CREATE POLICY "Team can manage chapters" ON public.course_chapters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

-- 9. chapter_resources table
CREATE TABLE public.chapter_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chapter_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources visible to all" ON public.chapter_resources
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Team can manage resources" ON public.chapter_resources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team'));

-- 10. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('course-resources', 'course-resources', false);

-- 11. Storage policies
CREATE POLICY "Anyone can upload screenshots" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Team can view screenshots" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-screenshots' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team')));

CREATE POLICY "Anyone can view screenshots public" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'payment-screenshots');

CREATE POLICY "Team can manage course resources" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'course-resources' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team')))
  WITH CHECK (bucket_id = 'course-resources' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'team')));

CREATE POLICY "Authenticated can view course resources" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'course-resources');
