-- Financial aid requests on leads

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_interest_type_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_interest_type_check
  CHECK (
    interest_type IS NULL
    OR interest_type IN ('course', 'consultation', 'project', 'financial_aid')
  );

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS discount_requested TEXT;
