import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import AuthModal from './AuthModal';

const Navbar = () => {
  const { user, logout, switchToAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  const [showSwitchList, setShowSwitchList] = useState(false);
  const [authPrefill, setAuthPrefill] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchUser = () => {
    logout();
    navigate('/login', { state: { switchUser: true } });
  };

  useEffect(() => {
    const onClickAway = (e) => {
      if (!avatarRef.current || avatarRef.current.contains(e.target)) return;
      setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  useEffect(() => {
    const onClickAway = (e) => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  const isCurrentPage = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const isPublicHome = location.pathname === '/';

  return (
    <header className="sticky top-4 z-40">
      <div className="container-padded">
        <nav className="nav-glass rounded-2xl h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Hamburger Menu + Brand */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute left-0 mt-3 w-64 rounded-xl p-2 bg-black/80 text-white border border-white/10 backdrop-blur-md">
                  <div className="space-y-1">
                    <Link to="/dashboard" className={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isCurrentPage('/dashboard') ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10'}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/datasets" className={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isCurrentPage('/datasets') ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10'}`} onClick={() => setMenuOpen(false)}>Datasets</Link>
                    <Link to="/charts" className={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isCurrentPage('/charts') ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10'}`} onClick={() => setMenuOpen(false)}>Charts</Link>
                    <Link to="/reports" className={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isCurrentPage('/reports') ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10'}`} onClick={() => setMenuOpen(false)}>Reports</Link>
                    {/* Admin Panel removed from hamburger menu as requested */}
                  </div>
                </div>
              )}
            </div>

            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white grid place-items-center shadow-glow">📊</div>
              <span className="text-lg font-extrabold tracking-tight text-white">Excel Analytics</span>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden md:flex items-center gap-8 -translate-x-3">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                isCurrentPage('/') 
                  ? 'text-white bg-white/20 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } cursor-pointer`}
            >
              Home
            </Link>
            <Link 
              to="/datasets" 
              className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                isCurrentPage('/datasets') 
                  ? 'text-white bg-white/20 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } cursor-pointer`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                isCurrentPage('/about') 
                  ? 'text-white bg-white/20 shadow-lg' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } cursor-pointer`}
            >
              About
            </Link>
          </div>

          {/* Right: Profile / Auth buttons */}
          {isPublicHome ? (
            <div className="flex items-center gap-3">
              <Button variant="glassDark" onClick={() => { setAuthMode('login'); setAuthOpen(true); }} className="cursor-pointer">Login</Button>
              <Button variant="secondary" onClick={() => { setAuthMode('register'); setAuthOpen(true); }} className="cursor-pointer">Sign up</Button>
            </div>
          ) : user ? (
            <div className="relative" ref={avatarRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="relative cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[10px] leading-[16px] text-center font-bold ${
                  user?.role === 'admin' && user?.status === 'approved' ? 'bg-purple-600' : 'bg-blue-600'
                } text-white shadow`}>
                  {user?.role === 'admin' && user?.status === 'approved' ? 'A' : 'U'}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl p-4 bg-black/80 text-white border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-sm text-white/70 truncate">{user?.email}</div>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' && user?.status === 'approved' ? 'bg-purple-500/20 text-purple-200' : 'bg-blue-500/20 text-blue-200'}`}>
                          {user?.role === 'admin' && user?.status === 'approved' ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="my-3 h-px bg-white/20" />
                  <div className="space-y-2">
                    {user?.role === 'admin' && user?.status === 'approved' && (
                      <Link 
                        to="/admin" 
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-white transition-colors cursor-pointer"
                        onClick={() => setProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => setShowSwitchList(v => !v)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-white transition-colors cursor-pointer"
                    >
                      Switch User
                    </button>
                    {showSwitchList && (
                      <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10">
                        {(() => {
                          try {
                            const list = JSON.parse(localStorage.getItem('recentAccounts') || '[]');
                            if (!list.length) return <div className="text-xs text-white/60 px-2 py-1">No saved accounts</div>;
                            return (
                              <div className="space-y-1 max-h-56 overflow-auto">
                                {list.map(acc => (
                                  <button
                                    key={acc.email}
                                    onClick={async () => {
                                      const tokensByEmail = JSON.parse(localStorage.getItem('tokensByEmail') || '{}');
                                      const hasToken = !!tokensByEmail[acc.email];
                                      if (hasToken) {
                                        const r = await switchToAccount(acc.email);
                                        if (r.success) { setProfileOpen(false); setShowSwitchList(false); }
                                      } else {
                                        setAuthPrefill({ email: acc.email, role: acc.role });
                                        setAuthMode('login');
                                        setAuthOpen(true);
                                      }
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/10 text-left text-sm cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-white/90 text-xs">
                                        {acc.name?.charAt(0)?.toUpperCase() || acc.email.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="text-white/90 leading-tight">{acc.name || acc.email}</div>
                                        <div className="text-white/60 text-[11px] leading-tight">{acc.email} • {acc.role}</div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                <div className="flex items-center gap-2 pt-2">
                                  <Button variant="glassDark" className="flex-1 cursor-pointer" onClick={() => { setShowSwitchList(false); setAuthMode('login'); setAuthOpen(true); }}>Login</Button>
                                  <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => { setShowSwitchList(false); setAuthMode('register'); setAuthOpen(true); }}>Sign up</Button>
                                </div>
                              </div>
                            );
                          } catch {
                            return <div className="text-xs text-white/60 px-2 py-1">No saved accounts</div>;
                          }
                        })()}
                      </div>
                    )}
                    <Button variant="danger" className="w-full cursor-pointer" onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="glassDark" onClick={() => { setAuthMode('login'); setAuthOpen(true); }} className="cursor-pointer">Login</Button>
              <Button variant="secondary" onClick={() => { setAuthMode('register'); setAuthOpen(true); }} className="cursor-pointer">Sign up</Button>
            </div>
          )}
        </nav>
      </div>
      <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} prefill={authPrefill} />
    </header>
  );
};

export default Navbar;