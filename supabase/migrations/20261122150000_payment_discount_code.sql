-- Optional discount code on payment / team-added student records
ALTER TABLE public.payment_submissions
  ADD COLUMN IF NOT EXISTS discount_code text;
