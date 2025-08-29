import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import API from '../utils/axios';
import AISummary from '../components/AISummary';
import { Bar, Line, Pie, Scatter, Doughnut, Radar, Bubble } from 'react-chartjs-2';
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
  RadialLinearScale,
  Filler,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Tooltip, 
  Legend,
  RadialLinearScale,
  Filler
);

// 3D Chart Component with clear, big axes like 2D graphs
const ThreeDChart = ({ data, chartType, xCol, yCol, zCol, width = 600, height = 400 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart area with margins
    const margin = 80;
    const chartWidth = canvas.width - 2 * margin;
    const chartHeight = canvas.height - 2 * margin;
    const chartX = margin;
    const chartY = margin;
    
    // Find data ranges
    const xValues = data.map(d => d.x).filter(x => !isNaN(x));
    const yValues = data.map(d => d.y).filter(y => !isNaN(y));
    const zValues = data.map(d => d.z).filter(z => !isNaN(z));
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const zMin = Math.min(...zValues);
    const zMax = Math.max(...zValues);
    
    // Draw major grid lines and axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    
    // X-axis grid lines
    for (let i = 0; i <= 10; i++) {
      const x = chartX + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
    }
    
    // Y-axis grid lines
    for (let i = 0; i <= 10; i++) {
      const y = chartY + (i / 10) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
    }
    
    // Z-axis grid lines (diagonal)
    for (let i = 0; i <= 5; i++) {
      const z = chartX + (i / 5) * chartWidth * 0.3;
      const y = chartY + chartHeight - (i / 5) * chartHeight * 0.3;
      ctx.beginPath();
      ctx.moveTo(z, chartY + chartHeight);
      ctx.lineTo(z + chartWidth * 0.3, y);
      ctx.stroke();
    }
    
    // Draw main axes with thick lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    
    // X-axis (horizontal)
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.stroke();
    
    // Y-axis (vertical)
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.stroke();
    
    // Z-axis (diagonal for 3D effect)
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth * 0.3, chartY);
    ctx.stroke();
    
    // Draw axis labels with larger, clearer text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    
    // X-axis label
    ctx.fillText(xCol, chartX + chartWidth / 2, chartY + chartHeight + 40);
    
    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(chartX - 40, chartY + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yCol, 0, 0);
    ctx.restore();
    
    // Z-axis label
    ctx.fillText(zCol, chartX + chartWidth * 0.15, chartY - 20);
    
    // Draw tick marks and values
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // X-axis ticks
    for (let i = 0; i <= 5; i++) {
      const x = chartX + (i / 5) * chartWidth;
      const value = xMin + (i / 5) * (xMax - xMin);
      ctx.beginPath();
      ctx.moveTo(x, chartY + chartHeight);
      ctx.lineTo(x, chartY + chartHeight + 8);
      ctx.stroke();
      ctx.fillText(value.toFixed(1), x, chartY + chartHeight + 25);
    }
    
    // Y-axis ticks
    for (let i = 0; i <= 5; i++) {
      const y = chartY + (i / 5) * chartHeight;
      const value = yMax - (i / 5) * (yMax - yMin);
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX - 8, y);
      ctx.stroke();
      ctx.fillText(value.toFixed(1), chartX - 15, y + 4);
    }
    
    // Z-axis ticks
    for (let i = 0; i <= 3; i++) {
      const z = chartX + (i / 3) * chartWidth * 0.3;
      const value = zMin + (i / 3) * (zMax - zMin);
      ctx.beginPath();
      ctx.moveTo(z, chartY + chartHeight - (i / 3) * chartHeight * 0.3);
      ctx.lineTo(z + 8, chartY + chartHeight - (i / 3) * chartHeight * 0.3 - 8);
      ctx.stroke();
      ctx.fillText(value.toFixed(1), z + 15, chartY + chartHeight - (i / 3) * chartHeight * 0.3 - 8);
    }
    
    // Draw data points
    if (chartType === '3d-scatter') {
      data.forEach(point => {
        if (isNaN(point.x) || isNaN(point.y) || isNaN(point.z)) return;
        
        const x = chartX + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
        const y = chartY + ((yMax - point.y) / (yMax - yMin)) * chartHeight;
        const zNormalized = (point.z - zMin) / (zMax - zMin);
        
        // Enhanced Z-based visualization
        const radius = 5 + zNormalized * 8;
        const hue = 200 + zNormalized * 140;
        const saturation = 80;
        const lightness = 55 + zNormalized * 20;
        
        // Draw enhanced shadow for better depth
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, 30%, 0.5)`;
        ctx.arc(x + 4, y + 4, radius + 1, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw main point with gradient effect
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Enhanced border
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, 40%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add highlight for 3D effect
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, 80%, 0.6)`;
        ctx.arc(x - radius/3, y - radius/3, radius/3, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else if (chartType === '3d-bar') {
      // 3D bar chart with improved rendering
      const barWidth = chartWidth / Math.max(xValues.length, 8);
      const barDepth = chartHeight * 0.15;
      
      data.forEach((point, index) => {
        if (isNaN(point.x) || isNaN(point.y) || isNaN(point.z)) return;
        
        const x = chartX + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
        const y = chartY + ((yMax - point.y) / (yMax - yMin)) * chartHeight;
        const z = chartX + ((point.z - zMin) / (zMax - zMin)) * chartWidth * 0.3;
        
        const height = Math.abs(point.y) / (yMax - yMin) * chartHeight;
        
        // Enhanced color scheme
        const hue = 200 + (index * 45) % 360;
        const saturation = 75;
        
        // Draw 3D bar with proper depth ordering
        // Back face (darkest)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, 35%)`;
        ctx.fillRect(x + barWidth/2, y - height, barDepth, height);
        
        // Right face (darker)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, 45%)`;
        ctx.fillRect(x + barWidth/2, y - height, barDepth, height);
        
        // Top face (lighter)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, 75%)`;
        ctx.fillRect(x - barWidth/2, y - height, barWidth, barDepth);
        
        // Front face (main)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, 60%)`;
        ctx.fillRect(x - barWidth/2, y - height, barWidth, height);
        
        // Enhanced borders
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, 40%)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - barWidth/2, y - height, barWidth, height);
        
        // Add highlight on top edge
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, 85%)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - barWidth/2, y - height);
        ctx.lineTo(x + barWidth/2, y - height);
        ctx.stroke();
      });
    } else if (chartType === '3d-line') {
      // Enhanced 3D line chart
      const zValues = data.map(p => p.z).filter(z => !isNaN(z));
      const zMin = Math.min(...zValues);
      const zMax = Math.max(...zValues);
      
      // Draw line with Z-based color variation
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      data.forEach((point, index) => {
        if (isNaN(point.x) || isNaN(point.y) || isNaN(point.z)) return;
        
        const x = chartX + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
        const y = chartY + ((yMax - point.y) / (yMax - yMin)) * chartHeight;
        const zNormalized = (point.z - zMin) / (zMax - zMin);
        
        if (index === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          // Color varies with Z value
          const hue = 220 + zNormalized * 60;
          ctx.strokeStyle = `hsl(${hue}, 75%, 60%)`;
          ctx.lineTo(x, y);
          ctx.stroke();
          
          // Start new path for next segment
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      });
      
      // Draw enhanced points on the line
      data.forEach(point => {
        if (isNaN(point.x) || isNaN(point.y) || isNaN(point.z)) return;
        
        const x = chartX + ((point.x - xMin) / (xMax - xMin)) * chartWidth;
        const y = chartY + ((yMax - point.y) / (yMax - yMin)) * chartHeight;
        const zNormalized = (point.z - zMin) / (zMax - zMin);
        
        const radius = 5 + zNormalized * 3;
        const hue = 220 + zNormalized * 60;
        
        // Draw point with depth effect
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue}, 75%, 60%)`;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add highlight
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, 75%, 80%, 0.7)`;
        ctx.arc(x - radius/3, y - radius/3, radius/3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = `hsl(${hue}, 75%, 40%)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  }, [data, chartType, xCol, yCol, zCol, width, height]); 
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-white/20 rounded-lg bg-black/20"
        style={{ width: '100%', height: '500px' }}
      />
      <div className="absolute top-4 left-4 text-white/90 text-sm bg-black/50 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="font-medium">X: {xCol}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="font-medium">Y: {yCol}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="font-medium">Z: {zCol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const chartTypes = {
  '2D': [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'area', label: 'Area Chart' },
    { value: 'doughnut', label: 'Doughnut Chart' },
    { value: 'radar', label: 'Radar Chart' },
    { value: 'bubble', label: 'Bubble Chart' },
    { value: 'horizontal-bar', label: 'Horizontal Bar' },
    { value: 'stacked-bar', label: 'Stacked Bar' },
  ],
  '3D': [
    { value: '3d-bar', label: '3D Bar Chart' },
    { value: '3d-scatter', label: '3D Scatter Plot' },
    { value: '3d-line', label: '3D Line Chart' },
  ]
};

function Charts() {
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

  const fetchDatasets = async () => {
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
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    const handleUserSwitch = () => {
      fetchDatasets();
    };
    
    window.addEventListener('userSwitched', handleUserSwitch);
    return () => window.removeEventListener('userSwitched', handleUserSwitch);
  }, []);

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
      if (chartType === 'area') {
        const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
        const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
        return {
          labels,
          datasets: [{ 
            label: yCol || 'value', 
            data, 
            backgroundColor: 'hsla(220, 70%, 55%, 0.3)', 
            borderColor: 'hsl(220, 70%, 55%)',
            fill: true,
            tension: 0.4
          }],
        };
      }
      if (chartType === 'doughnut') {
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
      if (chartType === 'radar') {
        const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
        const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
        return {
          labels,
          datasets: [{ 
            label: yCol || 'value', 
            data, 
            backgroundColor: 'hsla(220, 70%, 55%, 0.2)', 
            borderColor: 'hsl(220, 70%, 55%)',
            borderWidth: 2,
            pointBackgroundColor: 'hsl(220, 70%, 55%)',
            pointBorderColor: 'white',
            pointBorderWidth: 2
          }],
        };
      }
      if (chartType === 'bubble') {
        const data = rows
          .map((r) => ({ 
            x: Number(r?.[xCol]), 
            y: Number(r?.[yCol]),
            r: Math.abs(Number(r?.[yCol])) / 10 + 5 // Bubble size based on Y value
          }))
          .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y));
        return { 
          datasets: [{ 
            label: `${yCol} vs ${xCol}`, 
            data, 
            backgroundColor: 'hsla(220, 70%, 55%, 0.6)',
            borderColor: 'hsl(220, 70%, 55%)'
          }] 
        };
      }
      if (chartType === 'horizontal-bar') {
        const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
        const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
        return {
          labels,
          datasets: [{ 
            label: yCol || 'value', 
            data, 
            backgroundColor: 'hsl(220 70% 55%)', 
            borderColor: 'hsl(220 70% 45%)',
            indexAxis: 'y'
          }],
        };
      }
      if (chartType === 'stacked-bar') {
        const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
        const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
        return {
          labels,
          datasets: [{ 
            label: yCol || 'value', 
            data, 
            backgroundColor: 'hsl(220 70% 55%)', 
            borderColor: 'hsl(220 70% 45%)',
            stack: 'stack1'
          }],
        };
      }
      // Default bar/line
    const labels = rows.map((r, idx) => String(r?.[xCol] ?? idx + 1));
    const data = rows.map((r) => Number(r?.[yCol])).map((n) => (Number.isNaN(n) ? 0 : n));
    return {
      labels,
      datasets: [{ label: yCol || 'value', data, backgroundColor: 'hsl(220 70% 55%)', borderColor: 'hsl(220 70% 45%)' }],
    };
    } else {
      // 3D charts with proper axis handling
      if (chartType === '3d-scatter') {
        const data = rows
          .map((r) => ({ 
            x: Number(r?.[xCol]), 
            y: Number(r?.[yCol]),
            z: Number(r?.[zCol])
          }))
          .filter((p) => !Number.isNaN(p.x) && !Number.isNaN(p.y) && !Number.isNaN(p.z));
        
        return { 
          datasets: [{ 
            label: `${xCol} vs ${yCol} vs ${zCol}`, 
            data: data,
            backgroundColor: 'hsl(220, 70%, 55%)',
            pointRadius: 6,
            pointHoverRadius: 8
          }] 
        };
      }
      
      if (chartType === '3d-bar') {
        // 3D bar chart with X, Y, Z axes
        const data = rows
          .map((r) => ({ 
            x: r?.[xCol], 
            y: Number(r?.[yCol]),
            z: Number(r?.[zCol])
          }))
          .filter((p) => p.x !== undefined && !Number.isNaN(p.y) && !Number.isNaN(p.z));
        
        return { 
          datasets: [{ 
            label: `${xCol} vs ${yCol} vs ${zCol}`, 
            data: data,
            backgroundColor: 'hsl(220, 70%, 55%)'
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
    scales: (chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar') ? {} : { 
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
    elements: {
      point: {
        radius: chartType === 'bubble' ? 0 : 3,
        hoverRadius: chartType === 'bubble' ? 0 : 5
      }
    }
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
                {chartType === 'area' && <Line data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'doughnut' && <Doughnut data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'radar' && <Radar data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'bubble' && <Bubble data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'horizontal-bar' && <Bar data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType === 'stacked-bar' && <Bar data={chartData} options={commonOptions} ref={(instance)=>{ chartRef.current = instance?.canvas ? instance : instance?.[0]; }} />}
                {chartType.startsWith('3d') && (
                  <ThreeDChart 
                    data={chartData.datasets?.[0]?.data || []}
                    chartType={chartType}
                    xCol={xCol}
                    yCol={yCol}
                    zCol={zCol}
                  />
                )}
              </div>
            )}
            
            {/* AI Summary Section */}
            {dataset && (
              <div className="mt-6">
                <AISummary 
                  data={{ 
                    chartType, 
                    xCol, 
                    yCol, 
                    zCol, 
                    dimension,
                    name: `${chartType} Chart`,
                    dataset: dataset.originalName
                  }} 
                  type="chart" 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Charts;


