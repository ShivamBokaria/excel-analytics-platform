import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleToggle from "../components/RoleToggle";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
  };

  const handleRoleChange = (role) => setForm(prev => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const result = await register(form);
    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create account</h2>
          <p className="text-sm text-gray-600 mb-6">Join the platform to analyze Excel data.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sign up as</label>
              <RoleToggle selectedRole={form.role} onChange={handleRoleChange} className="w-full justify-between" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Already have an account?
                <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">Sign in</Link>
              </div>
              <Button type="submit" rightIcon={loading ? '…' : '→'} disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Promo */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-2xl font-bold mb-2">Choose your role</h3>
          <p className="text-white/90">Sign up as a User or Admin to get the tailored experience.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-lg">👤 User</div>
              <div className="text-sm text-white/80">Analyze your data</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-lg">🛡️ Admin</div>
              <div className="text-sm text-white/80">Manage the platform</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
