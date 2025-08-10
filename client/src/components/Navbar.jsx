import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const onClickAway = (e) => {
      if (!avatarRef.current || avatarRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const navItemClass = (path) => `px-4 py-2 rounded-full text-sm font-medium transition-all ${
    location.pathname === path ? 'bg-blue-600 text-white shadow-glow' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
  }`;

  return (
    <header className="sticky top-4 z-40">
      <div className="container-padded">
        <nav className="glass rounded-2xl h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Brand */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white grid place-items-center shadow-glow">📊</div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Excel Analytics</span>
          </Link>

          {/* Right: Nav + Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-1">
              <Link to="/dashboard" className={navItemClass('/dashboard')}>Dashboard</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={navItemClass('/admin')}>Admin</Link>
              )}
            </div>

            <div className="relative" ref={avatarRef}>
              <button onClick={() => setMenuOpen((o) => !o)} className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[10px] leading-[16px] text-center font-bold ${
                  user?.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                } text-white shadow`}>
                  {user?.role === 'admin' ? 'A' : 'U'}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user?.role === 'admin' ? 'Admin' : 'User'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-3 h-px bg-gray-200/70" />
                  <div className="space-y-2">
                    <Link to="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <Button variant="secondary" className="w-full" onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;