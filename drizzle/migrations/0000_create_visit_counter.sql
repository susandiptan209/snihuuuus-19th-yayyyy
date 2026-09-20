CREATE TABLE public.site_visits (
  id TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0
);

GRANT SELECT ON public.site_visits TO anon, authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visit counts"
ON public.site_visits
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.site_visits (id, count) VALUES ('birthday', 0);

CREATE OR REPLACE FUNCTION public.increment_visit(_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO public.site_visits (id, count)
  VALUES (_id, 1)
  ON CONFLICT (id) DO UPDATE SET count = public.site_visits.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_visit(TEXT) TO anon, authenticated;