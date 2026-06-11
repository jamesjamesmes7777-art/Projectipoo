import { useCallback, useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { getAdminMe, adminLogout } from '../lib/certificates';

type Status = 'loading' | 'unauthed' | 'authed';

export default function AdminPage() {
  const [status, setStatus] = useState<Status>('loading');

  const checkAuth = useCallback(async () => {
    const isAdmin = await getAdminMe();
    setStatus(isAdmin ? 'authed' : 'unauthed');
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await adminLogout();
    } finally {
      setStatus('unauthed');
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000811' }}>
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthed') {
    return <AdminLogin onLogin={checkAuth} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
