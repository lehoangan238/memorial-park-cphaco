-- Audit Logs Table for tracking all changes
-- Created: 2026-01-31

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb NULL,
  new_data jsonb NULL,
  changed_fields text[] NULL,
  user_id uuid NULL,
  user_email text NULL,
  ip_address text NULL,
  user_agent text NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs (record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view audit logs
CREATE POLICY "Authenticated users can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only service role can insert audit logs (via triggers)
CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  changed_cols text[];
  old_json jsonb;
  new_json jsonb;
BEGIN
  -- Get old and new data as JSON
  IF TG_OP = 'DELETE' THEN
    old_json := to_jsonb(OLD);
    new_json := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    old_json := NULL;
    new_json := to_jsonb(NEW);
  ELSE -- UPDATE
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
    
    -- Calculate changed fields
    SELECT array_agg(key) INTO changed_cols
    FROM (
      SELECT key FROM jsonb_each(old_json)
      EXCEPT
      SELECT key FROM jsonb_each(new_json)
      UNION
      SELECT key FROM jsonb_each(new_json)
      EXCEPT  
      SELECT key FROM jsonb_each(old_json)
      UNION
      SELECT o.key FROM jsonb_each(old_json) o
      JOIN jsonb_each(new_json) n ON o.key = n.key
      WHERE o.value IS DISTINCT FROM n.value
    ) changed;
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_fields,
    user_id,
    user_email
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text, NEW.name, OLD.name),
    TG_OP,
    old_json,
    new_json,
    changed_cols,
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for main tables
DROP TRIGGER IF EXISTS audit_plots_trigger ON public.plots;
CREATE TRIGGER audit_plots_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.plots
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_overlays_trigger ON public.overlays;
CREATE TRIGGER audit_overlays_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.overlays
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_spiritual_sites_trigger ON public.spiritual_sites;
CREATE TRIGGER audit_spiritual_sites_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.spiritual_sites
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

DROP TRIGGER IF EXISTS audit_staff_trigger ON public.staff;
CREATE TRIGGER audit_staff_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Comment
COMMENT ON TABLE public.audit_logs IS 'Tracks all changes to main tables for audit purposes';
