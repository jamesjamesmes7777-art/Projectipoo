import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@workspace/replit-auth-web';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(null);
      return;
    }
    let cancelled = false;
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data: { isAdmin?: boolean }) => {
        if (!cancelled) setIsAdmin(!!data.isAdmin);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (isLoading || (isAuthenticated && isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000811' }}>
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLogin onLogin={login} />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000811' }}>
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Access Denied</h1>
          <p className="text-slate-500 text-sm mb-8">
            You are not an authorised administrator.
          </p>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
