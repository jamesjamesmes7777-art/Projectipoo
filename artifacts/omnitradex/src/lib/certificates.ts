import type { Certificate, AuditLog, ApprovalStatus } from './types';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body && typeof body.error !== 'undefined'
      ? (typeof body.error === 'string' ? body.error : JSON.stringify(body.error))
      : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function getCertificateByRef(ref: string): Promise<Certificate | null> {
  const { certificate } = await api<{ certificate: Certificate | null }>(
    `/certificates/verify/${encodeURIComponent(ref.trim())}`,
  );
  return certificate;
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const { certificates } = await api<{ certificates: Certificate[] }>('/certificates');
  return certificates;
}

export async function createCertificate(
  cert: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>,
): Promise<Certificate> {
  const { certificate } = await api<{ certificate: Certificate }>('/certificates', {
    method: 'POST',
    body: JSON.stringify(cert),
  });
  return certificate;
}

export async function updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate> {
  const { certificate } = await api<{ certificate: Certificate }>(
    `/certificates/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    },
  );
  return certificate;
}

export async function setApprovalStatus(id: string, status: ApprovalStatus): Promise<void> {
  await api(`/certificates/${encodeURIComponent(id)}/approval`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export async function deleteCertificate(id: string): Promise<void> {
  await api(`/certificates/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getAuditLogs(certificateId?: string): Promise<AuditLog[]> {
  const query = certificateId ? `?certificate_id=${encodeURIComponent(certificateId)}` : '';
  const { auditLogs } = await api<{ auditLogs: AuditLog[] }>(`/audit-logs${query}`);
  return auditLogs;
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
