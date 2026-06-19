export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
export type AgreementStatus = 'Draft' | 'Generated' | 'Signed';

export interface Certificate {
  id: string;
  reference_number: string;
  holder_name: string;
  email: string | null;
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
  // Agreement fields
  waiting_list_number: string | null;
  national_id: string | null;
  afm_tin: string | null;
  banking_partner: string | null;
  institutional_bonus_amount: number | null;
  entry_price: number | null;
  sale_price: number | null;
  verified_buyer_id: string | null;
  total_investment: number | null;
  gross_payout: number | null;
  gross_profit: number | null;
  performance_fee: number | null;
  net_profit: number | null;
  total_disbursed: number | null;
  net_return_pct: number | null;
  agreement_status: AgreementStatus | null;
  agreement_generated_at: string | null;
}

export interface AgreementConfig {
  national_id?: string;
  afm_tin?: string;
  banking_partner?: string;
  institutional_bonus_amount?: number;
  entry_price?: number;
  sale_price?: number;
  verified_buyer_id?: string;
  shares_override?: number;
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
