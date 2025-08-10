import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleToggle from "../components/RoleToggle";
import Button from "../components/Button";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleChange = (role) => {
    setForm(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(form.role === 'admin' ? "/admin" : "/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Pane */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-sm text-gray-600 mb-6">Welcome back! Please enter your details.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <Button type="submit" rightIcon={loading ? '…' : '→'} disabled={loading}>
                {loading ? 'Signing in' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Pane (Promo / Illustration) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-2">Excel Analytics Platform</h3>
          <p className="text-white/90">Modern analytics for your Excel data. Secure, fast and insightful.</p>
          <div className="mt-6 flex gap-3">
            <Button variant="ghost">Learn more</Button>
            <Button variant="ghost">Contact</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
