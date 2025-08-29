import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import AISummary from '../components/AISummary';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';

function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const loadList = async () => {
    const { data } = await API.get('/files/list');
    setDatasets(data);
    if (data[0]) fetchDetails(data[0]._id);
  };

  const fetchDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/files/dataset/${id}`);
      setSelected(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadList(); }, []);
  
  useEffect(() => {
    const handleUserSwitch = () => {
      loadList();
    };
    
    window.addEventListener('userSwitched', handleUserSwitch);
    return () => window.removeEventListener('userSwitched', handleUserSwitch);
  }, []);

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;
    await API.delete(`/files/dataset/${id}`);
    if (selected?._id === id) setSelected(null);
    setDatasets((prev) => prev.filter((d) => d._id !== id));
    try {
      const { data } = await API.get('/activity/me');
      // Dashboard will show updated activity next mount; optional toast here.
    } catch {}
  };

  const rename = async (id, newName) => {
    try {
      await API.put(`/files/dataset/${id}`, { originalName: newName });
      setDatasets((prev) => prev.map((d) => d._id === id ? { ...d, originalName: newName } : d));
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, originalName: newName }));
      }
      setEditingName(null);
      setNewName('');
    } catch (error) {
      alert('Failed to rename dataset');
    }
  };

  const downloadDataset = async (dataset) => {
    try {
      // Convert dataset to CSV and download
      const headers = dataset.columns.join(',');
      const rows = dataset.dataSample.map(row => 
        dataset.columns.map(col => `"${row[col] || ''}"`).join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.originalName.replace(/\.[^/.]+$/, '')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download dataset');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await API.post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDatasets((prev) => [{ _id: data.id, originalName: data.originalName, columns: data.columns, rowCount: data.rowCount, createdAt: data.createdAt }, ...prev]);
      if (!selected) {
        fetchDetails(data.id);
      }
    } catch (err) {
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-padded py-10">
        <div className="flex items-center justify-between mb-6 text-white">
          <div>
            <h1 className="display-title">Datasets</h1>
            <p className="heading-subtle">Preview and manage your uploaded datasets.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="glassLight" 
              onClick={() => document.getElementById('file-input-datasets')?.click()}
              loading={uploading}
              rightIcon={uploading ? '…' : '📤'}
            >
              {uploading ? 'Uploading…' : 'Upload New'}
            </Button>
            <input 
              id="file-input-datasets" 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 card-light p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">My Datasets</h3>
              <span className="text-xs text-white/70">{datasets.length} files</span>
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {datasets.map((ds) => (
                <div key={ds._id} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${selected?._id===ds._id ? 'bg-white/10' : ''}`}>
                  <div onClick={() => fetchDetails(ds._id)} className="mb-2">
                    <div className="text-sm font-medium text-white truncate">{ds.originalName}</div>
                    <div className="text-xs text-white/70">{ds.rowCount} rows • {ds.columns?.length || 0} columns</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => downloadDataset(ds)}
                      className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors cursor-pointer"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => { setEditingName(ds._id); setNewName(ds.originalName); }}
                      className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors cursor-pointer"
                    >
                      Rename
                    </button>
                    <button 
                      onClick={() => remove(ds._id)}
                      className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  {editingName === ds._id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 text-xs px-2 py-1 rounded bg-white/10 text-white border border-white/20 cursor-text"
                        onKeyPress={(e) => e.key === 'Enter' && rename(ds._id, newName)}
                      />
                      <button 
                        onClick={() => rename(ds._id, newName)}
                        className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 cursor-pointer"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => { setEditingName(null); setNewName(''); }}
                        className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {datasets.length===0 && <div className="text-sm text-white/60">No datasets uploaded yet</div>}
            </div>
          </div>

          <div className="lg:col-span-2 card-light p-4">
            {!selected && <div className="text-white/60">Select a dataset to preview</div>}
            {selected && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-white">{selected.originalName}</h2>
                    <div className="text-xs text-white/70">{selected.rowCount} rows • {selected.columns.length} columns</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => downloadDataset(selected)}>Download CSV</Button>
                    <Button variant="glassDark" onClick={() => navigate(`/charts?dataset=${selected._id}`)} rightIcon="→">Open in Charts</Button>
                  </div>
                </div>
                <div className="overflow-auto max-h-[60vh] border border-white/20 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/10 sticky top-0">
                      <tr>
                        {selected.columns.map((c) => (
                          <th key={c} className="text-left font-medium text-white px-3 py-2 border-b border-white/20">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr><td className="px-3 py-2 text-white/60" colSpan={selected.columns.length}>Loading…</td></tr>
                      )}
                      {!loading && selected.dataSample?.slice(0, 50).map((row, i) => (
                        <tr key={i} className="odd:bg-white/5 even:bg-white/10">
                          {selected.columns.map((c) => (
                            <td key={c} className="px-3 py-2 border-b border-white/10 text-white/90">{String(row?.[c] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* AI Summary for Dataset */}
                {selected && (
                  <div className="mt-6">
                    <AISummary 
                      data={selected} 
                      type="dataset" 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Datasets;


