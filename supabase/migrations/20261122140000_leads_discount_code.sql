-- Optional discount code on course leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS discount_code text;
