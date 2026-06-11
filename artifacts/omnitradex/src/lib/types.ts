export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';

export interface Certificate {
  id: string;
  reference_number: string;
  holder_name: string;
  registered_address: string | null;
  security_name: string;
  security_code: string;
  shares: number;
  allocation_price: number;
  total_consideration: number;
  issue_date: string;
  certificate_number: string;
  integrity_hash: string;
  status: string;
  approval_status: ApprovalStatus;
  language: string;
  account_manager: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  qr_url: string | null;
  pdf_url: string | null;
}

export interface AuditLog {
  id: string;
  certificate_id: string | null;
  action: string;
  performed_by: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export interface Admin {
  id: string;
  email: string;
  role: string;
  created_at: string;
}
