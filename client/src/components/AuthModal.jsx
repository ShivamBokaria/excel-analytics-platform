import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleToggle from './RoleToggle';
import Button from './Button';

export default function AuthModal({ open, mode = 'login', onClose, prefill = null }) {
  const { login, register } = useAuth();
  const [activeMode, setActiveMode] = useState(mode); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      setActiveMode(mode);
      const base = { name: '', email: '', password: '', role: 'user' };
      const withPrefill = prefill ? { ...base, email: prefill.email || '', role: prefill.role || 'user' } : base;
      setForm(withPrefill);
      setError('');
      setSuccess('');
    }
  }, [open, mode, prefill]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleRoleChange = (role) => {
    setForm(prev => ({ ...prev, role }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (activeMode === 'login') {
        const result = await login(form.email, form.password, form.role);
        if (!result.success) {
          setError(result.message);
          return;
        }
        onClose?.();
      } else {
        const result = await register(form);
        if (!result.success) {
          setError(result.message);
          return;
        }
        if (result.requiresApproval) {
          setSuccess('Registration successful. Admin approval required. You may login as user until approved.');
        } else {
          setSuccess('Registration successful. You may now log in.');
        }
        setActiveMode('login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="card-light w-full max-w-lg p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${activeMode==='login' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}
                onClick={() => { setActiveMode('login'); setError(''); setSuccess(''); }}
              >
                Login
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${activeMode==='register' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}
                onClick={() => { setActiveMode('register'); setError(''); setSuccess(''); }}
              >
                Sign up
              </button>
            </div>
            <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-white/10 text-white/80 cursor-pointer">✕</button>
          </div>

          <div className="px-6 py-5">
            {error && (
              <div className="mb-4 rounded-md border border-red-400 bg-red-500/20 text-red-200 px-3 py-2 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded-md border border-green-400 bg-green-500/20 text-green-200 px-3 py-2 text-sm">{success}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {activeMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-white">Full name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-white">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-white">Continue as</label>
                <RoleToggle selectedRole={form.role} onChange={handleRoleChange} />
                {activeMode==='register' && form.role === 'admin' && (
                  <p className="text-xs text-yellow-300/90">Admin accounts require approval from existing administrators.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant={activeMode==='login' ? 'primary' : 'success'} rightIcon={loading ? '…' : '→'} loading={loading}>
                  {activeMode==='login' ? 'Login' : 'Create account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
