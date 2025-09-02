import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import AISummary from '../components/AISummary';
import API from '../utils/axios';

function Reports() {
  const [reports, setReports] = useState([]);

  const load = async () => {
    const { data } = await API.get('/reports');
    setReports(data);
  };

  useEffect(() => { load(); }, []);
  
  useEffect(() => {
    const handleUserSwitch = () => {
      load();
    };
    
    window.addEventListener('userSwitched', handleUserSwitch);
    return () => window.removeEventListener('userSwitched', handleUserSwitch);
  }, []);

  const remove = async (id) => {
    await API.delete(`/reports/${id}`);
    setReports((prev) => prev.filter((r) => r._id !== id));
  };

  const download = async (id) => {
    // Navigate to charts with report loaded and instruct user to use Download buttons there.
    window.location.assign(`/charts?report=${id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-padded py-10">
        <div className="mb-6 text-white">
          <h1 className="display-title">Saved Reports</h1>
          <p className="heading-subtle">Reuse chart presets you saved.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <div key={r._id} className="card-light p-4">
              <div className="font-semibold text-white">{r.name}</div>
              <div className="text-xs text-white/70">
                {r.chartType.toUpperCase()} • {r.dimension || '2D'} • x: {r.xCol} • y: {r.yCol}
                {r.dimension === '3D' && r.zCol && ` • z: ${r.zCol}`}
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="glassLight" onClick={() => window.location.assign(`/charts?report=${r._id}`)} className="cursor-pointer">Open</Button>
                <Button variant="outline" onClick={() => download(r._id)} className="cursor-pointer">Download</Button>
                <Button variant="danger" onClick={() => remove(r._id)} className="cursor-pointer">Delete</Button>
              </div>
              
              {/* AI Summary for Report */}
              <div className="mt-4">
                <AISummary 
                  data={r} 
                  type="report" 
                />
              </div>
            </div>
          ))}
          {reports.length === 0 && <div className="text-white/80">No saved reports yet</div>}
        </div>
      </main>
    </div>
  );
}

export default Reports;


