import { supabase } from './supabase';
import type { Certificate, AuditLog, ApprovalStatus } from './types';

export async function getCertificateByRef(ref: string): Promise<Certificate | null> {
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .eq('reference_number', ref.trim())
    .maybeSingle();
  return data;
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCertificate(cert: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>): Promise<Certificate> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('certificates')
    .insert({ ...cert, created_by: user?.id })
    .select()
    .single();
  if (error) throw error;
  await logAction(data.id, 'CREATED', { holder_name: cert.holder_name });
  return data;
}

export async function updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
  const { data, error } = await supabase
    .from('certificates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await logAction(id, 'UPDATED', updates);
  return data;
}

export async function setApprovalStatus(id: string, status: ApprovalStatus): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const updates: Partial<Certificate> = { approval_status: status };
  if (status === 'APPROVED') {
    updates.approved_by = user?.id ?? null;
    updates.approved_at = new Date().toISOString();
  }
  const { error } = await supabase.from('certificates').update(updates).eq('id', id);
  if (error) throw error;
  await logAction(id, status, {});
}

export async function deleteCertificate(id: string): Promise<void> {
  await logAction(id, 'DELETED', {});
  const { error } = await supabase.from('certificates').delete().eq('id', id);
  if (error) throw error;
}

export async function getAuditLogs(certificateId?: string): Promise<AuditLog[]> {
  let q = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
  if (certificateId) q = q.eq('certificate_id', certificateId);
  const { data, error } = await q.limit(200);
  if (error) throw error;
  return data ?? [];
}

async function logAction(certificateId: string, action: string, metadata: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('audit_logs').insert({
    certificate_id: certificateId,
    action,
    performed_by: user?.id ?? null,
    metadata,
  });
}

export function generateCertificateNumber(ref: string): string {
  const digits = ref.replace(/\D/g, '').slice(0, 8).padEnd(8, '0');
  return `OTX-CRT-${digits}`;
}

export function generateIntegrityHash(ref: string, holder: string, shares: number): string {
  const raw = `${ref}${holder}${shares}${Date.now()}`;
  let hash = '';
  for (let i = 0; i < raw.length; i++) {
    hash += raw.charCodeAt(i).toString(16);
  }
  return hash.slice(0, 64);
}
