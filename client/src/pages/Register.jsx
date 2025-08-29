import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleToggle from "../components/RoleToggle";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingAdmin, setPendingAdmin] = useState(false);
  const navigate = useNavigate();
  const { register, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
    setPendingAdmin(false);
  };

  const handleRoleChange = (role) => {
    setForm(prev => ({ ...prev, role }));
    setError("");
    setSuccess("");
    setPendingAdmin(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPendingAdmin(false);
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const result = await register(form);
    if (result.success) {
      if (result.requiresApproval) {
        setPendingAdmin(true);
        setSuccess("Registration successful! Your admin account is pending approval. You can sign in as a regular user while waiting for admin approval.");
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-sm text-gray-600 mb-6">Join the platform to analyze Excel data.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className={`border px-4 py-3 rounded-md mb-4 ${
              pendingAdmin 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>

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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Continue as</label>
              <RoleToggle selectedRole={form.role} onChange={handleRoleChange} className="w-full justify-between" />
              {form.role === 'admin' && (
                <p className="text-xs text-yellow-600 mt-2">
                  ⚠️ Admin accounts require approval from existing administrators.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Already have an account?
                <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">Sign in</Link>
              </div>
              <Button type="submit" variant="success" rightIcon={loading ? '…' : '→'} disabled={loading} loading={loading}>
                {loading ? 'Creating account' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Pane (Promo / Illustration) */}
        <div className="hidden lg:flex flex-col justify-center nav-glass rounded-2xl p-8 text-white shadow-lg border border-white/10">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-2xl font-bold mb-2">Why join Excel Analytics?</h3>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-lg font-semibold">Powerful Visualizations</div>
              <div className="text-white/80 text-sm">Create beautiful 2D and 3D charts from your data in minutes.</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-lg font-semibold">Effortless File Management</div>
              <div className="text-white/80 text-sm">Upload, rename, and download your datasets seamlessly.</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-lg font-semibold">Save and Share</div>
              <div className="text-white/80 text-sm">Save chart presets as reports and export to PNG or PDF.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
