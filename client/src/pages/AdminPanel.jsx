import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../utils/axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ users: 0, datasets: 0, reports: 0 });
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDatasets, setUserDatasets] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [viewingUserData, setViewingUserData] = useState(false);

  useEffect(() => {
    fetchPendingAdmins();
    fetchStats();
    fetchUsers();
  }, [user?.id]);

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

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (e) {
      // ignore for now
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsersList(data);
    } catch {}
  };

  const setRole = async (id, role) => {
    await API.put(`/admin/users/${id}/role`, { role });
    setUsersList((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    await API.delete(`/admin/users/${id}`);
    setUsersList((prev) => prev.filter((u) => u._id !== id));
  };

  const openUser = async (userId) => {
    try {
      setViewingUserData(true);
      const [datasetsResponse, reportsResponse] = await Promise.all([
        API.get(`/admin/users/${userId}/datasets`),
        API.get(`/admin/users/${userId}/reports`)
      ]);
      setSelectedUser(datasetsResponse.data.user);
      setUserDatasets(datasetsResponse.data.datasets);
      setUserReports(reportsResponse.data.reports || []);
    } catch (error) {
      setError('Failed to fetch user data');
      setViewingUserData(false);
    }
  };

  const closeUserView = () => {
    setSelectedUser(null);
    setUserDatasets([]);
    setUserReports([]);
    setViewingUserData(false);
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
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded">
            Access denied. Admin privileges required.
          </div>
        </div>
      </div>
    );
  }

  if (viewingUserData && selectedUser) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-white">
            <div className="flex items-center gap-4">
              <button 
                onClick={closeUserView}
                className="text-white/80 hover:text-white text-sm font-medium"
              >
                ← Back to Admin Panel
              </button>
            </div>
            <h1 className="display-title mt-4">User Data</h1>
            <p className="mt-2 heading-subtle">
              Viewing data for {selectedUser.name} ({selectedUser.email})
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Uploaded Files */}
            <div className="card-light p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Uploaded Files ({userDatasets.length})</h2>
              </div>
              
              {userDatasets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">No files uploaded by this user</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {userDatasets.map((dataset) => (
                    <div key={dataset._id} className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-white">{dataset.originalName}</h3>
                        <p className="text-xs text-white/70">{dataset.rowCount} rows • {dataset.columns?.length || 0} columns</p>
                        <p className="text-xs text-white/60">
                          Uploaded: {new Date(dataset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/charts?dataset=${dataset._id}`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Reports */}
            <div className="card-light p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Saved Reports ({userReports.length})</h2>
              </div>
              
              {userReports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">No reports saved by this user</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {userReports.map((report) => (
                    <div key={report._id} className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-white">{report.name}</h3>
                        <p className="text-xs text-white/70">{report.chartType.toUpperCase()} • x: {report.xCol} • y: {report.yCol}</p>
                        <p className="text-xs text-white/60">
                          Created: {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/charts?report=${report._id}`, '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-white">
          <h1 className="display-title">Admin Panel</h1>
          <p className="mt-2 heading-subtle">
            Manage users and platform settings
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="card-light">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-lg font-medium text-white">Pending Admin Approvals</h2>
            <p className="text-sm text-white/80">Review and approve new admin requests</p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-white/60">Loading...</p>
              </div>
            ) : pendingAdmins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60">No pending admin approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAdmins.map((admin) => (
                  <div key={admin._id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-white">{admin.name}</h3>
                      <p className="text-sm text-white/70">{admin.email}</p>
                      <p className="text-xs text-white/60">Requested: {new Date(admin.createdAt).toLocaleString()}</p>
                      <p className="text-xs text-white/60 capitalize">Status: {admin.status}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveAdmin(admin._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                      >
                        Approve
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
          <div className="card-light p-6">
            <h3 className="text-lg font-medium text-white mb-4">Platform Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Total Users:</span>
                <span className="text-sm font-medium text-white">{stats.users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Files Uploaded:</span>
                <span className="text-sm font-medium text-white">{stats.datasets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Reports Generated:</span>
                <span className="text-sm font-medium text-white">{stats.reports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Online (10 min):</span>
                <span className="text-sm font-medium text-white">{stats.online ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="card-light p-6 md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-light p-4">
                <div className="text-sm text-white/80">Server Status</div>
                <div className="text-green-400 font-semibold">Online</div>
              </div>
              <div className="card-light p-4">
                <div className="text-sm text-white/80">Database</div>
                <div className="text-green-400 font-semibold">Connected</div>
              </div>
              <div className="card-light p-4">
                <div className="text-sm text-white/80">API</div>
                <div className="text-green-400 font-semibold">Operational</div>
              </div>
            </div>
          </div>
        </div>

        {/* User management */}
        <div className="mt-8 card-light p-6">
          <h3 className="text-lg font-medium text-white mb-4">Users</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left px-3 py-2 text-white">Name</th>
                  <th className="text-left px-3 py-2 text-white">Email</th>
                  <th className="text-left px-3 py-2 text-white">Role</th>
                  <th className="text-right px-3 py-2 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} className="odd:bg-white/10 even:bg-white/5 text-white">
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 capitalize">{u.role}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-2">
                        {u.role !== 'admin' && (
                          <button onClick={() => openUser(u._id)} className="px-3 py-1 rounded bg-white/10 text-white text-xs hover:bg-white/20 cursor-pointer">View Data</button>
                        )}
                        <button onClick={() => deleteUser(u._id)} className="px-3 py-1 rounded bg-rose-600 text-white text-xs hover:bg-rose-700 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;