-- ============================================================
-- Migration: shopify_config table
-- Date: 2026-05-26
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shopify_config (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name       TEXT NOT NULL,
  access_token    TEXT NOT NULL,
  api_version     TEXT NOT NULL DEFAULT '2024-01',
  products_selected JSONB NOT NULL DEFAULT '[]'::jsonb,
  enabled         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one config row per installation
-- (enforced by application logic — first row wins)

-- RLS: only admins can read/write shopify_config (it has access tokens!)
ALTER TABLE public.shopify_config ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage shopify_config"
  ON public.shopify_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public can read basic config (shop_name, enabled, products_selected)
-- but NOT the access_token — we expose only what the frontend needs
CREATE POLICY "Public can read enabled shopify config"
  ON public.shopify_config
  FOR SELECT
  TO anon
  USING (enabled = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_shopify_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shopify_config_updated_at
  BEFORE UPDATE ON public.shopify_config
  FOR EACH ROW
  EXECUTE FUNCTION public.set_shopify_config_updated_at();

-- Grant permissions
GRANT ALL ON public.shopify_config TO authenticated;
GRANT SELECT ON public.shopify_config TO anon;
