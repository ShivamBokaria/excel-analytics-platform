/*
AISummary.jsx - Component
------------------------
- Imports: useState, Button, API
- Main Component: AISummary({ data, type, onDownload })
  - State: summary, loading, error
  - Functions:
    - generateSummary: Calls API to get AI summary
    - buildPromptWithContext: Builds prompt for AI based on data/type
    - computeBasicStats: Computes stats for dataset columns
    - downloadSummary: Exports summary as PDF/XLSX
  - Renders: Card with summary, error, download/save buttons
- Exports: AISummary
*/
import { useState } from 'react';
import Button from './Button';
import API from '../utils/axios';

const AISummary = ({ data, type, onDownload }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    
    try {
      const promptText = await buildPromptWithContext(data, type);

      const { data: result } = await API.post('/ai/generate-summary', {
        prompt: promptText,
        type: type,
        dataSource: data.originalName || data.name || data.platform || 'User generated'
      });
      setSummary(result.summary || 'Summary generated successfully');
      // No autosave; no refresh event on generate
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to generate AI summary. Please try again.';
      setError(msg);
      console.error('AI Summary Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildPromptWithContext = async (payload, theType) => {
    try {
      if (theType === 'dataset') {
        // Enrich with sample rows and basic stats
        let details = payload;
        if (!details?.dataSample && details?._id) {
          const { data: full } = await API.get(`/files/dataset/${details._id}`);
          details = full;
        }
        const columns = details?.columns || [];
        const sample = Array.isArray(details?.dataSample) ? details.dataSample.slice(0, 10) : [];

        const stats = computeBasicStats(sample, columns);

        return [
          `You are a senior data analyst. Analyze the following dataset and produce a concise, actionable summary.`,
          `- Dataset name: ${details?.originalName || 'Unknown'}`,
          `- Rows (approx): ${details?.rowCount ?? 'N/A'}`,
          `- Columns (${columns.length}): ${columns.join(', ')}`,
          `- Basic stats by column (derived from sample):`,
          JSON.stringify(stats, null, 2),
          `- Sample rows (up to 10):`,
          JSON.stringify(sample, null, 2),
          `Instructions: Based on the above context, summarize key patterns, trends, anomalies, and recommendations. Do NOT ask for data. Keep it under 10 bullet points.`
        ].join('\n');
      }

      if (theType === 'report') {
        // Provide chart/report configuration; prompt model to infer insights
        const cfg = {
          name: payload?.name,
          chartType: payload?.chartType,
          dimension: payload?.dimension,
          xCol: payload?.xCol,
          yCol: payload?.yCol,
          zCol: payload?.zCol || null,
          filters: payload?.filters || null,
        };
        return [
          `You are a senior data visualization analyst. Given the chart configuration below, describe likely insights and how to interpret the visualization.`,
          JSON.stringify(cfg, null, 2),
          `Instructions: Provide meaningful, specific insights one could derive from such a chart. Do NOT ask for raw data. Include potential caveats and recommended follow-ups.`
        ].join('\n');
      }

      // Fallback for generic chart
      if (theType === 'chart') {
        const cfg = {
          chartType: payload?.chartType,
          xCol: payload?.xCol,
          yCol: payload?.yCol,
          zCol: payload?.zCol || null,
        };
        return [
          `Analyze this chart configuration for insights and recommendations. Do NOT ask for raw data.`,
          JSON.stringify(cfg, null, 2)
        ].join('\n');
      }

      // Platform / other
      return `Provide a high-level analysis and recommendations for the following context: ${JSON.stringify(payload)}`;
    } catch (e) {
      // Fallback to basic prompt if enrichment fails
      return `Analyze this context and provide insights: ${JSON.stringify(payload)}`;
    }
  };

  const computeBasicStats = (rows, columns) => {
    const stats = {};
    for (const col of columns) {
      const values = rows.map(r => r?.[col]).filter(v => v !== null && v !== undefined);
      const numeric = values.filter(v => typeof v === 'number');
      if (numeric.length >= Math.max(3, Math.ceil(values.length * 0.5))) {
        const min = Math.min(...numeric);
        const max = Math.max(...numeric);
        const mean = numeric.reduce((a,b)=>a+b,0) / numeric.length || 0;
        stats[col] = { type: 'numeric', count: values.length, min, max, mean: Number(mean.toFixed(2)) };
      } else {
        const freq = {};
        for (const v of values) {
          const key = String(v);
          freq[key] = (freq[key] || 0) + 1;
        }
        const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);
        stats[col] = { type: 'categorical', count: values.length, topValues: top.map(([k,c])=>({ value:k, count:c })) };
      }
    }
    return stats;
  };

  const downloadSummary = async (format) => {
    if (!summary) return;
    
    try {
      if (format === 'pdf') {
        // Simple PDF generation using jsPDF
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('AI Summary Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Type: ${type}`, 20, 40);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
        
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(summary, 170);
        doc.text(splitText, 20, 70);
        
        doc.save(`ai-summary-${type}-${Date.now()}.pdf`);
      } else if (format === 'xlsx') {
        // Simple XLSX generation
        const XLSX = await import('xlsx');
        
        const ws = XLSX.utils.aoa_to_sheet([
          ['AI Summary Report'],
          [''],
          ['Type', type],
          ['Generated', new Date().toLocaleString()],
          [''],
          ['Summary'],
          [summary]
        ]);
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'AI Summary');
        
        XLSX.writeFile(wb, `ai-summary-${type}-${Date.now()}.xlsx`);
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download summary');
    }
  };

  return (
    <div className="card-light p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🤖 AI Summary</h3>
        <Button 
          variant="primary" 
          onClick={generateSummary} 
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {summary && (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white/80 mb-2">AI Analysis:</h4>
            <p className="text-white/90 text-sm leading-relaxed">{summary}</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => downloadSummary('pdf')}
              className="cursor-pointer"
            >
              📄 Download PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => downloadSummary('xlsx')}
              className="cursor-pointer"
            >
              📊 Download Excel
            </Button>
            <Button 
              variant="primary" 
              onClick={async ()=>{
                try {
                  const payload = {
                    type,
                    summary,
                    // Best-effort prompt context for traceability
                    prompt: await buildPromptWithContext(data, type),
                    dataSource: data.originalName || data.name || data.platform || 'User generated',
                  };
                  await API.post('/ai/summaries', payload);
                  window.dispatchEvent(new CustomEvent('summaryGenerated'));
                  alert('Summary saved');
                } catch (e) {
                  console.error('Save summary failed', e);
                  alert(e?.response?.data?.message || 'Failed to save summary');
                }
              }}
              className="cursor-pointer"
            >
              💾 Save
            </Button>
          </div>
        </div>
      )}
      
      {/* Note removed as requested */}
    </div>
  );
};

export default AISummary;
