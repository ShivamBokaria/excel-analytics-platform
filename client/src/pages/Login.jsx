import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleToggle from "../components/RoleToggle";
import Button from "../components/Button";
import SocialLoginButtons from "../components/SocialLoginButtons";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    
    // Check if user was redirected from switch user
    if (location.state?.switchUser) {
      setInfo("Please sign in with your credentials");
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setInfo("");
  };

  const handleRoleChange = (role) => {
    setForm(prev => ({ ...prev, role }));
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const result = await login(form.email, form.password, form.role);
    if (result.success) {
      navigate(form.role === 'admin' ? "/admin" : "/dashboard");
    } else {
      if (result.message.includes('pending')) {
        setError("Your admin account is still pending approval. Please contact an existing administrator or sign in as a regular user.");
      } else {
        setError(result.message);
      }
    }
  };

  const recentAccounts = (() => {
    try { return JSON.parse(localStorage.getItem('recentAccounts') || '[]'); } catch { return []; }
  })();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Pane */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-6">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {info && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-4">
              {info}
            </div>
          )}

          {location.state?.switchUser && (
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">Previously used accounts</div>
              {recentAccounts.length === 0 ? (
                <div className="text-sm text-gray-600">No saved accounts on this device.</div>
              ) : (
                <div className="space-y-2">
                  {recentAccounts.map(acc => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => setForm({ email: acc.email, password: '', role: acc.role })}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 grid place-items-center text-gray-700 font-semibold">
                          {acc.name?.charAt(0)?.toUpperCase() || acc.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{acc.name || acc.email}</div>
                          <div className="text-xs text-gray-600">{acc.email} • {acc.role}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Last used {new Date(acc.lastUsedAt).toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Link to="/login" className="px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm cursor-pointer">Login</Link>
                <Link to="/register" className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm cursor-pointer">New Sign up</Link>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Continue as</label>
              <RoleToggle selectedRole={form.role} onChange={handleRoleChange} className="w-full justify-between" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                No account?
                <Link to="/register" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">Sign up</Link>
              </div>
              <Button type="submit" variant="primary" rightIcon={loading ? '…' : '→'} disabled={loading} loading={loading}>
                {loading ? 'Signing in' : 'Sign in'}
              </Button>
            </div>
          </form>

          <SocialLoginButtons 
            onSuccess={(message) => setInfo(message)}
            onError={(message) => setError(message)}
          />
        </div>

        {/* Right Pane (Promo / Illustration) */}
        <div className="hidden lg:flex flex-col justify-center nav-glass rounded-2xl p-8 text-white shadow-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-2">Excel Analytics Platform</h3>
          <p className="text-white/80 mb-6">
            Welcome back! Continue analyzing your data and creating powerful visualizations.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">📈</div>
              <span className="text-sm">Access your saved charts and reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">📁</div>
              <span className="text-sm">Manage your uploaded datasets</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">💾</div>
              <span className="text-sm">Create new visualizations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
