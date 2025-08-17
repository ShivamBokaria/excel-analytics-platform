import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API from '../utils/axios';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const chartTypes = {
  '2D': [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
  ],
  '3D': [
    { value: '3d-bar', label: '3D Bar Chart' },
    { value: '3d-scatter', label: '3D Scatter Plot' },
    { value: '3d-surface', label: '3D Surface Plot' },
  ]
};

function Charts() {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [dataset, setDataset] = useState(null);
  const [dimension, setDimension] = useState('2D');
  const [chartType, setChartType] = useState('bar');
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [zCol, setZCol] = useState('');
  const chartRef = useRef(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get('/files/list');
        setDatasets(data);
        const params = new URLSearchParams(window.location.search);
        const datasetParam = params.get('dataset');
        if (datasetParam) setSelectedId(datasetParam);
        else if (data[0]) setSelectedId(data[0]._id);
        const reportId = params.get('report');
        if (reportId) {
          const { data: report } = await API.get(`/reports/${reportId}`);
          setSelectedId(report.dataset);
          setDimension(report.dimension || '2D');
          setChartType(report.chartType);
          setXCol(report.xCol);
          setYCol(report.yCol);
          setZCol(report.zCol);
        }
      } catch {}
    })();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        const { data } = await API.get(`/files/dataset/${selectedId}`);
        setDataset(data);
        if (data?.columns?.[0]) setXCol(data.columns[0]);
        if (data?.columns?.[1]) setYCol(data.columns[1]);
        if (data?.columns?.[2] && dimension === '3D') setZCol(data.columns[2]);
      } catch {}
    })();
  }, [selectedId, dimension]);

  // Reset chart type when dimension changes
  useEffect(() => {
    const availableTypes = chartTypes[dimension];
    if (availableTypes && !availableTypes.find(t => t.value === chartType)) {
      setChartType(availableTypes[0].value);
    }
  }, [dimension]);

  const isNumericColumn = (name) => {
    if (!dataset?.dataSample?.length) return false;
    const vals = dataset.dataSample.map((r) => r?.[name]).filter((v) => v !== null && v !== undefined && v !== '' );
    const numbers = vals.map((v) => Number(v)).filter((v) => !Number.isNaN(v));
    return numbers.length >= Math.max(3, Math.floor(vals.length * 0.6));
  };

  const chartData = useMemo(() => {
    if (!dataset) return null;
    const rows = dataset.dataSample || [];
    
    if (dimension === '2D') {
      if (chartType === 'pie') {
        const counts = new Map();
        for (const row of rows) {
          const key = row?.[xCol];
          if (key === undefined) continue;
          counts.set(key, (counts.get(key) || 0) + Number(row?.[yCol] ?? 1));
        }
        const labels = Array.from(counts.keys());
        const data = Array.from(counts.values());
        return {
          labels,
          datasets: [{ label: yCol || 'count', data, backgroundColor: labels.map((_, i) => `hsl(${(i*47)%360} 70% 55%)`) }],
        };
      }
      if (chartType === 'scatter') {
        const data = rows
          .map((r) => ({ x: Number(r?.[xCol]), y: Number(r?.[yCol]) }))
          .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y));
        return { datasets: [{ label: `${yCol} vs ${xCol}`, data, backgroundColor: 'hsl(220 70% 55%)' }] };
      }
      // bar/line
      const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
      const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
      return {
        labels,
        datasets: [{ label: yCol || 'value', data, backgroundColor: 'hsl(220 70% 55%)', borderColor: 'hsl(220 70% 45%)' }],
      };
    } else {
      // 3D charts - for now, we'll show a 2D representation with color coding for Z
      if (chartType === '3d-scatter') {
        const data = rows
          .map((r) => ({ 
            x: Number(r?.[xCol]), 
            y: Number(r?.[yCol]),
            z: Number(r?.[zCol])
          }))
          .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y) && !Number.isNaN(p.z));
        
        // Color code by Z value
        const colors = data.map(point => {
          const normalizedZ = (point.z - Math.min(...data.map(p => p.z))) / (Math.max(...data.map(p => p.z)) - Math.min(...data.map(p => p.z)));
          return `hsl(${240 + normalizedZ * 120}, 70%, 50%)`;
        });
        
        return { 
          datasets: [{ 
            label: `${zCol} vs ${xCol} vs ${yCol}`, 
            data: data.map(p => ({ x: p.x, y: p.y })), 
            backgroundColor: colors 
          }] 
        };
      }
      // Default 3D representation
      const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
      const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
      return {
        labels,
        datasets: [{ label: yCol || 'value', data, backgroundColor: 'hsl(220 70% 55%)', borderColor: 'hsl(220 70% 45%)' }],
      };
    }
  }, [dataset, dimension, chartType, xCol, yCol, zCol]);

  const commonOptions = {
    responsive: true,
    plugins: { 
      legend: { 
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      } 
    },
    scales: chartType === 'pie' ? {} : { 
      x: { 
        ticks: { 
          autoSkip: true, 
          maxTicksLimit: 12,
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }, 
      y: { 
        beginAtZero: true,
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      } 
    },
  };

  const validate = () => {
    if (!dataset) return 'Please select a dataset';
    if (!xCol) return 'Please choose an X axis column';
    if (!yCol) return 'Please choose a Y/value column';
    if (dimension === '3D' && !zCol) return 'Please choose a Z axis column for 3D charts';
    if ((chartType === 'bar' || chartType === 'line' || chartType === 'scatter' || chartType.startsWith('3d')) && !isNumericColumn(yCol)) {
      return 'Y column must contain mostly numeric values for this chart type';
    }
    if ((chartType === 'scatter' || chartType.startsWith('3d')) && !isNumericColumn(xCol)) {
      return 'X column must be numeric for scatter charts';
    }
    if (chartType.startsWith('3d') && !isNumericColumn(zCol)) {
      return 'Z column must be numeric for 3D charts';
    }
    return '';
  };

  useEffect(() => {
    setError(validate());
  }, [dataset, xCol, yCol, zCol, chartType, dimension]);

  const saveReport = async () => {
    const err = validate();
    if (err) return setError(err);
    setSaving(true);
    try {
      const name = `${dimension} ${chartType.toUpperCase()}: ${yCol} vs ${xCol}${zCol ? ` vs ${zCol}` : ''}`;
      await API.post('/reports', { 
        dataset: selectedId, 
        name, 
        dimension,
        chartType, 
        xCol, 
        yCol, 
        zCol,
        options: {} 
      });
      
      // Add chart creation activity to localStorage for dashboard
      const chartActivity = {
        id: Date.now(),
        action: `Created ${chartType} chart`,
        time: new Date().toISOString(),
        type: 'chart',
        details: `${name} • ${dataset?.originalName}`
      };
      
      // Store in localStorage to be picked up by dashboard
      const existingActivities = JSON.parse(localStorage.getItem('chartActivities') || '[]');
      existingActivities.unshift(chartActivity);
      localStorage.setItem('chartActivities', JSON.stringify(existingActivities.slice(0, 10)));
      
      alert('Report saved');
    } catch {
      alert('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPng = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.png';
    a.click();
  };

  const handleDownloadPdf = async () => {
    const container = document.getElementById('chart-card');
    if (!container) return;
    const canvas = await html2canvas(container, { backgroundColor: '#ffffff', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;
    pdf.addImage(imgData, 'PNG', x, y, w, h);
    pdf.save('chart.pdf');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-padded py-10">
        <section className="mb-6 text-white">
          <h1 className="display-title">Create Chart</h1>
          <p className="heading-subtle">Select a dataset, pick dimensions, and render charts.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 card-light p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white">Dataset <span className="text-white/60 font-normal">(pick a source file)</span></label>
                <select value={selectedId} onChange={(e)=>setSelectedId(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white placeholder-white/60">
                  {datasets.map(d => (
                    <option key={d._id} value={d._id} className="bg-black text-white">{d.originalName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Chart Dimension <span className="text-white/60 font-normal">(2D or 3D)</span></label>
                <select value={dimension} onChange={(e)=>setDimension(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white">
                  <option value="2D" className="bg-black text-white">2D Charts</option>
                  <option value="3D" className="bg-black text-white">3D Charts</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Chart Type <span className="text-white/60 font-normal">(visual style)</span></label>
                <select value={chartType} onChange={(e)=>setChartType(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white">
                  {chartTypes[dimension]?.map(t => <option key={t.value} value={t.value} className="bg-black text-white">{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white">X axis <span className="text-white/60 font-normal">(category or numeric)</span></label>
                <select value={xCol} onChange={(e)=>setXCol(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white">
                  {dataset?.columns?.map(c => <option key={c} value={c} className="bg-black text-white">{c} {chartType !== 'pie' && isNumericColumn(c) ? '(num)' : ''}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-white">Y axis / Value <span className="text-white/60 font-normal">(numeric)</span></label>
                <select value={yCol} onChange={(e)=>setYCol(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white">
                  {dataset?.columns?.map(c => <option key={c} value={c} className="bg-black text-white">{c} {isNumericColumn(c) ? '(num)' : ''}</option>)}
                </select>
              </div>

              {dimension === '3D' && (
                <div>
                  <label className="text-sm font-semibold text-white">Z axis <span className="text-white/60 font-normal">(numeric)</span></label>
                  <select value={zCol} onChange={(e)=>setZCol(e.target.value)} className="mt-1 w-full border border-white/30 rounded-lg px-3 py-2 bg-black/50 text-white">
                    <option value="" className="bg-black text-white">Select Z axis</option>
                    {dataset?.columns?.map(c => <option key={c} value={c} className="bg-black text-white">{c} {isNumericColumn(c) ? '(num)' : ''}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleDownloadPng}>Download PNG</Button>
                <Button variant="primary" onClick={handleDownloadPdf}>Download PDF</Button>
                <Button variant="outline" onClick={saveReport} disabled={saving}>{saving ? 'Saving…' : 'Save preset'}</Button>
              </div>
              {error && <div className="text-sm text-red-400">{error}</div>}
            </div>
          </div>

          <div id="chart-card" className="lg:col-span-2 card-light p-4">
            {!dataset && <div className="text-white/60">No dataset selected</div>}
            {dataset && chartData && (
              <div className="min-h-[360px]">
                {chartType === 'bar' && <Bar data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'line' && <Line data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'pie' && <Pie data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'scatter' && <Scatter data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType.startsWith('3d') && <Scatter data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Charts;


