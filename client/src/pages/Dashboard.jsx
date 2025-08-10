import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import GradientCard from "../components/GradientCard";
import FeatureCard from "../components/FeatureCard";
import ActivityTimeline from "../components/ActivityTimeline";
import Button from "../components/Button";

function Dashboard() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    setRecentActivity([
      { id: 1, action: "Uploaded sales_Q4_2024.xlsx", time: "2 hours ago", type: "upload", details: "Processed 2,547 rows" },
      { id: 2, action: "Generated revenue report", time: "5 hours ago", type: "report", details: "Quarterly trend analysis" },
      { id: 3, action: "Created new dashboard", time: "1 day ago", type: "dashboard", details: "Customer segmentation" },
    ]);
  }, []);

  const statsData = [
    { title: "Files Uploaded", value: "47", subtitle: "This month", icon: "📊", gradient: "bg-gradient-to-br from-blue-500 to-blue-700", trend: 23 },
    { title: "Reports Generated", value: "128", subtitle: "Total", icon: "📈", gradient: "bg-gradient-to-br from-green-500 to-emerald-600", trend: 15 },
    { title: "Data Points", value: "2.4M", subtitle: "Analyzed", icon: "🔍", gradient: "bg-gradient-to-br from-purple-500 to-purple-700", trend: 35 },
    { title: "Active Users", value: "12", subtitle: "This week", icon: "👥", gradient: "bg-gradient-to-br from-orange-500 to-red-500", trend: -8 },
  ];

  const quickActions = [
    { title: "Upload Excel", description: "Import Excel files to start analysis.", icon: "📤", comingSoon: true },
    { title: "Create Report", description: "Build visual, exportable reports.", icon: "📋", comingSoon: true },
    { title: "Explore Analytics", description: "Filter, segment and discover trends.", icon: "📊", comingSoon: true },
    { title: user?.role === 'admin' ? "Manage Users" : "My Workspace", description: user?.role === 'admin' ? "User roles & permissions." : "Organize files and reports.", icon: user?.role === 'admin' ? "⚙️" : "🗂️", comingSoon: true },
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
        <section className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 bg-clip-text text-transparent">
            Welcome, {user?.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600">Analyze Excel data, generate reports, and uncover insights.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" rightIcon={"→"}>Quick Start</Button>
            <Button variant="secondary" size="lg">View Tutorials</Button>
            <Button variant="subtle" size="lg">What’s New</Button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((s, i) => (
            <GradientCard key={i} title={s.title} value={s.value} subtitle={s.subtitle} icon={s.icon} gradient={s.gradient} trend={s.trend} />
          ))}
        </section>

        {/* Actions + Activity */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-gray-600">Jump right into common tasks</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">All actions</Button>
                <Button variant="primary">Create New</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((a, i) => (
                <FeatureCard key={i} title={a.title} description={a.description} icon={a.icon} comingSoon={a.comingSoon} primaryCta="Open" secondaryCta="Details" />
              ))}
            </div>
          </div>
          <div>
            <ActivityTimeline activities={recentActivity} />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-10 border-t border-gray-200 mt-12">
          <p className="text-sm text-gray-500">Excel Analytics Platform • {new Date().getFullYear()}</p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
