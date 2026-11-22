-- Lead interest type + conditional fields (course / consultation / project)

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS interest_type TEXT
    CHECK (interest_type IS NULL OR interest_type IN ('course', 'consultation', 'project')),
  ADD COLUMN IF NOT EXISTS course_id UUID,
  ADD COLUMN IF NOT EXISTS course_title TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS meeting_details TEXT;
