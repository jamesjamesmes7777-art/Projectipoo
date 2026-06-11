-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── certificates ──────────────────────────────────────────────────────────────
CREATE TABLE certificates (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number    TEXT        UNIQUE NOT NULL,
  holder_name         TEXT        NOT NULL,
  registered_address  TEXT,
  security_name       TEXT        NOT NULL DEFAULT 'SpaceX',
  security_code       TEXT        NOT NULL DEFAULT 'SPCX',
  shares              INTEGER     NOT NULL,
  allocation_price    NUMERIC     NOT NULL,
  total_consideration NUMERIC     NOT NULL,
  issue_date          DATE        NOT NULL,
  certificate_number  TEXT        UNIQUE NOT NULL,
  integrity_hash      TEXT        NOT NULL,
  status              TEXT        NOT NULL DEFAULT 'Settled • Verified',
  approval_status     TEXT        NOT NULL DEFAULT 'DRAFT'
                        CHECK (approval_status IN ('DRAFT','PENDING','APPROVED','REJECTED','REVOKED')),
  language            TEXT        NOT NULL DEFAULT 'en',
  account_manager     TEXT,
  approved_by         UUID,
  approved_at         TIMESTAMPTZ,
  created_by          UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  qr_url              TEXT,
  pdf_url             TEXT
);

-- ── admins ────────────────────────────────────────────────────────────────────
CREATE TABLE admins (
  id         UUID  PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT  NOT NULL,
  role       TEXT  NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── audit_logs ────────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID  REFERENCES certificates(id) ON DELETE SET NULL,
  action         TEXT  NOT NULL,
  performed_by   UUID  REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata       JSONB
);

-- ── auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Enable RLS ────────────────────────────────────────────────────────────────
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs   ENABLE ROW LEVEL SECURITY;

-- ── certificates policies ──────────────────────────────────────────────────────
-- Anon: only APPROVED certs are visible
CREATE POLICY "anon_select_approved" ON certificates FOR SELECT
  TO anon USING (approval_status = 'APPROVED');

-- Admins: full access
CREATE POLICY "admin_select_all" ON certificates FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "admin_insert" ON certificates FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "admin_update" ON certificates FOR UPDATE
  TO authenticated
  USING     (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "admin_delete" ON certificates FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- ── admins policies ───────────────────────────────────────────────────────────
CREATE POLICY "admin_select_own" ON admins FOR SELECT
  TO authenticated USING (id = auth.uid());

CREATE POLICY "admin_insert_own" ON admins FOR INSERT
  TO authenticated WITH CHECK (id = auth.uid());

-- ── audit_logs policies ───────────────────────────────────────────────────────
CREATE POLICY "admin_select_audit" ON audit_logs FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "admin_insert_audit" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- ── seed demo certificate ─────────────────────────────────────────────────────
INSERT INTO certificates (
  reference_number, holder_name, registered_address,
  security_name, security_code, shares,
  allocation_price, total_consideration, issue_date,
  certificate_number, integrity_hash, status,
  approval_status, account_manager
) VALUES (
  'OW-1602-3810', 'Aris Gerakis', '12 Ave Lon',
  'SpaceX', 'SPCX', 87,
  117, 10179, '2026-06-10',
  'OTX-CRT-16023810', 'ad7eb4b82a3a30864e90233e79e6538157e3a970598e51372fes',
  'Settled • Verified', 'APPROVED', 'Grigoris Kechagias'
);
