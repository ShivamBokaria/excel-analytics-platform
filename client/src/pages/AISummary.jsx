import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import AISummary from '../components/AISummary';
import { useState as useReactState } from 'react';
import API from '../utils/axios';

function AISummaryPage() {
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('dataset');
  const [selectedDataId, setSelectedDataId] = useState('');

  useEffect(() => {
    loadSavedSummaries();
    loadDataSources();
  }, []);

  useEffect(() => {
    const handleUserSwitch = () => {
      loadSavedSummaries();
    };
    
    const handleSummaryGenerated = () => {
      loadSavedSummaries();
    };
    
    window.addEventListener('userSwitched', handleUserSwitch);
    window.addEventListener('summaryGenerated', handleSummaryGenerated);
    
    return () => {
      window.removeEventListener('userSwitched', handleUserSwitch);
      window.removeEventListener('summaryGenerated', handleSummaryGenerated);
    };
  }, []);

  const loadSavedSummaries = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/ai/summaries');
      setSavedSummaries(data);
    } catch (error) {
      console.error('Failed to load saved summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSources = async () => {
    try {
      const [{ data: list }, { data: rep }] = await Promise.all([
        API.get('/files/list'),
        API.get('/reports'),
      ]);
      setDatasets(list);
      setReports(rep);
    } catch (e) {
      console.error('Failed to load data sources', e);
    }
  };

  const downloadSummary = async (summary, format) => {
    try {
      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('AI Summary Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Type: ${summary.type}`, 20, 40);
        doc.text(`Generated: ${new Date(summary.createdAt).toLocaleString()}`, 20, 50);
        
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(summary.summary, 170);
        doc.text(splitText, 20, 70);
        
        doc.save(`ai-summary-${summary.type}-${Date.now()}.pdf`);
      } else if (format === 'xlsx') {
        const XLSX = await import('xlsx');
        
        const ws = XLSX.utils.aoa_to_sheet([
          ['AI Summary Report'],
          [''],
          ['Type', summary.type],
          ['Generated', new Date(summary.createdAt).toLocaleString()],
          [''],
          ['Summary'],
          [summary.summary]
        ]);
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'AI Summary');
        
        XLSX.writeFile(wb, `ai-summary-${summary.type}-${Date.now()}.xlsx`);
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download summary');
    }
  };

  const deleteSummary = async (id) => {
    if (!confirm('Are you sure you want to delete this summary?')) return;
    
    try {
      await API.delete(`/ai/summaries/${id}`);
      setSavedSummaries(prev => prev.filter(s => s._id !== id));
      if (selectedSummary?._id === id) {
        setSelectedSummary(null);
      }
    } catch (error) {
      console.error('Failed to delete summary:', error);
      alert('Failed to delete summary');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container-padded pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🤖 AI Summary Hub</h1>
          <p className="text-white/80 text-lg">Generate intelligent insights from your data and save them for future reference</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Saved Summaries */}
          <div className="lg:col-span-1">
            <div className="card-light p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📚 Saved Summaries</h2>
              
              {loading ? (
                <div className="text-white/60">Loading...</div>
              ) : savedSummaries.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No saved summaries yet</p>
                  <p className="text-sm">Generate your first AI summary to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedSummaries.map((summary) => (
                    <div 
                      key={summary._id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSummary?._id === summary._id 
                          ? 'border-blue-500 bg-blue-500/20' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => setSelectedSummary(summary)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{summary.type}</div>
                          <div className="text-white/60 text-sm">
                            {new Date(summary.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSummary(summary._id);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Details & Actions */}
          <div className="lg:col-span-2">
            {selectedSummary ? (
              <div className="card-light p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedSummary.type} Summary</h3>
                    <p className="text-white/60">
                      Generated on {new Date(selectedSummary.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadSummary(selectedSummary, 'pdf')}
                      className="cursor-pointer"
                    >
                      📄 PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadSummary(selectedSummary, 'xlsx')}
                      className="cursor-pointer"
                    >
                      📊 Excel
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-white/80 mb-2">AI Analysis:</h4>
                  <p className="text-white/90 text-sm leading-relaxed">{selectedSummary.summary}</p>
                </div>
                
                <div className="text-xs text-white/60">
                  <strong>Data Source:</strong> {selectedSummary.dataSource || 'N/A'}
                </div>
              </div>
            ) : (
              <div className="card-light p-6">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Summary</h3>
                  <p className="text-white/60">Choose a saved summary from the left panel to view details and download options</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Generate Section with selectors */}
        <div className="mt-8">
          <div className="card-light p-6">
            <h2 className="text-xl font-semibold text-white mb-4">⚡ Quick Generate</h2>
            <p className="text-white/60 mb-4">Generate a new AI summary for an uploaded file or a saved chart</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Source Type</label>
                <select
                  value={selectedDataType}
                  onChange={(e)=>{ setSelectedDataType(e.target.value); setSelectedDataId(''); }}
                  className="w-full bg-black text-white border border-white/20 rounded px-3 py-2"
                >
                  <option value="dataset">Dataset (uploaded file)</option>
                  <option value="report">Saved Chart (preset)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm mb-2">Select {selectedDataType === 'dataset' ? 'Dataset' : 'Saved Chart'}</label>
                <select
                  value={selectedDataId}
                  onChange={(e)=> setSelectedDataId(e.target.value)}
                  className="w-full bg-black text-white border border-white/20 rounded px-3 py-2"
                >
                  <option value="">-- Choose --</option>
                  {selectedDataType === 'dataset' ? (
                    datasets.map(d => (
                      <option key={d._id} value={d._id}>{d.originalName}</option>
                    ))
                  ) : (
                    reports.map(r => (
                      <option key={r._id} value={r._id}>{r.name || `${r.chartType} (${r.dimension})`}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {selectedDataId && (
              <AISummary 
                data={
                  selectedDataType === 'dataset'
                    ? (datasets.find(d => d._id === selectedDataId) || {})
                    : (reports.find(r => r._id === selectedDataId) || {})
                }
                type={selectedDataType === 'dataset' ? 'dataset' : 'report'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AISummaryPage;
