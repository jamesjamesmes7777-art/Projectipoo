import { Shield } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000811' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Admin Portal</h1>
          <p className="text-slate-500 text-sm">OmniTradeX Certificate Platform</p>
        </div>

        <button
          onClick={onLogin}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wide transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-xs text-slate-700 mt-8">
          Access restricted to authorised administrators only.
        </p>
      </div>
    </div>
  );
}
