-- Allow catalog course ids (text) + title/linkedin for consultation & project leads

ALTER TABLE public.leads
  ALTER COLUMN course_id TYPE TEXT USING course_id::text;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS linkedin TEXT;
