import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly) {
    if (user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.status !== 'approved') {
      return <Navigate to="/dashboard" replace state={{ info: 'Your admin account is pending approval.' }} />;
    }
  }

  return children;
};

export default ProtectedRoute;