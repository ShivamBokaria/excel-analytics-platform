import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../utils/axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      const response = await API.get('/admin/pending-admins');
      setPendingAdmins(response.data);
    } catch (err) {
      setError('Failed to fetch pending admins');
    } finally {
      setLoading(false);
    }
  };

  const approveAdmin = async (adminId) => {
    try {
      await API.put(`/admin/approve/${adminId}`);
      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== adminId));
    } catch (err) {
      setError('Failed to approve admin');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Access denied. Admin privileges required.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">
            Manage users and platform settings
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pending Admin Approvals</h2>
            <p className="text-sm text-gray-500">Review and approve new admin requests</p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            ) : pendingAdmins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending admin approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAdmins.map((admin) => (
                  <div key={admin._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{admin.name}</h3>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                      <p className="text-xs text-gray-400">
                        Requested: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveAdmin(admin._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Users:</span>
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Files Uploaded:</span>
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reports Generated:</span>
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Server Status:</span>
                <span className="text-sm font-medium text-green-600">✅ Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Database:</span>
                <span className="text-sm font-medium text-green-600">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">API Status:</span>
                <span className="text-sm font-medium text-green-600">✅ Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                Export User Data
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                System Backup
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;