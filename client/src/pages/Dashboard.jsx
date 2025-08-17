import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import GradientCard from "../components/GradientCard";
import FeatureCard from "../components/FeatureCard";
import ActivityTimeline from "../components/ActivityTimeline";
import Button from "../components/Button";
import API from "../utils/axios";


function Dashboard() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [reportsCount, setReportsCount] = useState(0);

  const fetchData = async () => {
    try {
      const [{ data: list }, { data: reports }, { data: activities }] = await Promise.all([
        API.get('/files/list'),
        API.get('/reports'),
        API.get('/activity/me'),
      ]);
      setDatasets(list);
      setReportsCount(reports.length);
      const formatted = activities.map(a => ({ 
        id: a._id, action: a.action, time: a.createdAt, type: a.type, details: a.details 
      }));
      setRecentActivity(formatted);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]); // Refresh when user changes

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await API.post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDatasets((prev) => [{ _id: data.id, originalName: data.originalName, columns: data.columns, rowCount: data.rowCount, createdAt: data.createdAt }, ...prev]);
      setRecentActivity((prev) => [{ id: Date.now(), action: `Uploaded ${data.originalName}`, time: new Date().toISOString(), type: 'upload', details: `${data.rowCount} rows • ${data.columns.length} columns` }, ...prev]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };



  const statsData = [
    { title: "Files Uploaded", value: String(datasets.length), subtitle: "All time", icon: "📊", gradient: "bg-gradient-to-br from-blue-500 to-blue-700", trend: 0 },
    { title: "Reports Saved", value: String(reportsCount), subtitle: "All time", icon: "📈", gradient: "bg-gradient-to-br from-green-500 to-emerald-600", trend: 0 },
    { title: "Data Sample Rows", value: String(datasets.reduce((a,d)=>a + (d.rowCount||0),0)), subtitle: "Across uploads", icon: "🔍", gradient: "bg-gradient-to-br from-purple-500 to-purple-700", trend: 0 },
    { title: "Unique Columns", value: String(new Set(datasets.flatMap(d=>d.columns||[])).size), subtitle: "Across uploads", icon: "🗂️", gradient: "bg-gradient-to-br from-orange-500 to-red-500", trend: 0 },
  ];

  const quickActions = [
    { title: "Upload Excel", description: "Import Excel files to start analysis.", icon: "📤", comingSoon: false },
    { title: "Open Datasets", description: "Preview uploaded datasets.", icon: "🗂️", comingSoon: false },
    { title: "Create Chart", description: "Build visual charts from data.", icon: "📊", comingSoon: false },
    { title: "Saved Reports", description: "Open your saved chart presets.", icon: "📋", comingSoon: false },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-padded py-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
        </div>

        {/* Hero */}
        <section className="mb-6 text-center text-white">
          <h1 className="display-title">Welcome, {user?.name}</h1>
          <p className="mt-3 text-lg heading-subtle">Analyze Excel data, generate reports, and uncover insights.</p>
        </section>

        {/* Upload section */}
        <section className="mb-10">
          <div
            onDragOver={(e)=>{e.preventDefault();}}
            onDrop={(e)=>{e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f){ const evt={target:{files:[f]}}; handleUpload(evt);} }}
            className="card-light p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">Upload your data</h2>
            <p className="text-sm text-white/80 mb-5">Drag & drop an Excel file here, or choose one of the options below.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="glassLight" onClick={(e)=>{e.preventDefault(); document.getElementById('file-input-hidden')?.click();}} rightIcon={uploading ? '…' : '➔'} loading={uploading}>
                {uploading ? 'Uploading…' : 'Upload from device'}
              </Button>

              <input id="file-input-hidden" type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsData.map((s, i) => (
            <GradientCard key={i} title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} gradient={s.gradient} trend={s.trend} />
          ))}
        </section>

        {/* Actions + Activity */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                <p className="text-white/80">Jump right into common tasks</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard title="Open Datasets" description="Preview uploaded datasets." icon="🗂️" comingSoon={false} primaryCta="Open" onClick={() => window.location.assign('/datasets')} />
              <FeatureCard title="Create Chart" description="Build visual charts from data." icon="📊" comingSoon={false} primaryCta="Open" onClick={() => window.location.assign('/charts')} />
              <FeatureCard title="Saved Reports" description="Open your saved chart presets." icon="📋" comingSoon={false} primaryCta="Open" onClick={() => window.location.assign('/reports')} />
            </div>
          </div>
          <div>
            <div className="card-light p-4">
              <ActivityTimeline activities={recentActivity} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-10 border-t border-white/10 mt-12">
          <p className="text-sm text-white/60">Excel Analytics Platform • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
