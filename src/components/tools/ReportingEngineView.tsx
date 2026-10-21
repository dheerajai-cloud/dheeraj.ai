import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
  FileText,
  Sliders,
  Sparkles,
  Presentation,
  Table as TableIcon,
  Target,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface ReportData {
  reportTitle: string;
  subtitle: string;
  businessName: string;
  timePeriod: string;
  executiveSummary: string;
  keyMetrics: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    status: string;
  }[];
  swot?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  sections: {
    title: string;
    analysis: string;
    recommendations: string[];
  }[];
  slides?: {
    slideNumber: number;
    title: string;
    keyStat?: string;
    points: string[];
  }[];
  actionPlan?: {
    priority: string;
    initiative: string;
    timeline: string;
    owner: string;
    expectedImpact: string;
  }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export const ReportingEngineView: React.FC = () => {
  const { t } = useI18n();

  const [reportType, setReportType] = useState('Executive Quarterly Performance Report');
  const [businessName, setBusinessName] = useState('Apex Digital Enterprises');
  const [timePeriod, setTimePeriod] = useState('Q3 2026');
  const [goals, setGoals] = useState('Accelerate user acquisition, reduce churn to under 2%, and expand high-margin enterprise accounts');
  const [rawData, setRawData] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportData | null>(null);

  // Active view: 'doc' | 'slides' | 'table'
  const [activeFormat, setActiveFormat] = useState<'doc' | 'slides' | 'table'>('doc');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawData(content);
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          businessName,
          timePeriod,
          goals,
          rawData: rawData || 'Default benchmark performance metrics across revenue, churn, CAC, and channel efficiency',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        setCurrentSlide(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result?.tableData) return;
    const { headers, rows } = result.tableData;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${result.businessName}_KPI_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    let md = `# ${result.reportTitle}\n## ${result.subtitle}\n**Business:** ${result.businessName} | **Period:** ${result.timePeriod}\n\n`;
    md += `### Executive Summary\n${result.executiveSummary}\n\n`;
    md += `### Key Performance Metrics\n`;
    result.keyMetrics.forEach((m) => {
      md += `* **${m.label}**: ${m.value} (${m.change}) - Status: ${m.status}\n`;
    });
    md += `\n### Detailed Analysis\n`;
    result.sections.forEach((sec) => {
      md += `#### ${sec.title}\n${sec.analysis}\n\nRecommendations:\n`;
      sec.recommendations.forEach((r) => (md += `- ${r}\n`));
      md += '\n';
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-cyan-900/30 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_reporting_engine')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Multi-Format Strategy Engine
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Upload data or paste raw metrics to generate boardroom slide decks, executive audit documents, SWOT frameworks, and CSV tables.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>PPT Slides • PDF Doc • Excel CSV</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Report Directives & Data Sources
            </h3>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Report & Deliverable Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>Executive Quarterly Performance Report</option>
                <option>Strategic Client Proposal & Pitch Deck</option>
                <option>Comprehensive SEO & PPC Marketing Audit</option>
                <option>High-Impact Brand Case Study</option>
                <option>Weekly Operational Briefing</option>
              </select>
            </div>

            {/* Business & Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Time Period
                </label>
                <input
                  type="text"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Primary Goals */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Strategic Goals & Objectives
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-y"
              />
            </div>

            {/* Data Ingestion: Upload File or Paste Data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Upload CSV, JSON or Notes
                </label>
                {uploadedFileName && (
                  <span className="text-[11px] text-emerald-400 font-mono">
                    ✓ {uploadedFileName}
                  </span>
                )}
              </div>

              <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group">
                <input
                  type="file"
                  accept=".csv,.json,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 mb-1 transition-colors" />
                <span className="text-xs text-slate-300 font-medium">Click to upload raw data file</span>
                <span className="text-[10px] text-slate-500">Supports CSV, JSON, TXT metrics tables</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Or Paste Raw Metrics / Notes</span>
                <span
                  className="text-[11px] text-emerald-400 cursor-pointer hover:underline"
                  onClick={() =>
                    setRawData(`Revenue: $428,500 (+24.8%)\nCAC: $32.40 (down 14%)\nSEO Traffic: 145,200 visits\nTop Converting Channel: Organic Search (3.8% CVR)\nRetention Rate: 91.4%\nNext Quarter Target: $520,000`)
                  }
                >
                  Insert Sample Data
                </span>
              </label>
              <textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                placeholder="Paste performance numbers, bullet points, client notes, or raw financial tables..."
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Executive Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Multi-Format Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Deliverable Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Output Format Switcher & Action Bar */}
              <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-800">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveFormat('doc')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeFormat === 'doc'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Executive Document (PDF)</span>
                  </button>

                  <button
                    onClick={() => setActiveFormat('slides')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeFormat === 'slides'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Presentation Deck (PPT)</span>
                  </button>

                  <button
                    onClick={() => setActiveFormat('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeFormat === 'table'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Data Table (Excel)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 px-2.5"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 px-2.5"
                    title="Print or Save PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF Print</span>
                  </button>

                  {result.tableData && (
                    <button
                      onClick={handleDownloadCsv}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 px-2.5"
                      title="Download Excel CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Excel CSV</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View 1: Executive Document View */}
              {activeFormat === 'doc' && (
                <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-8 bg-slate-950/60 print:bg-white print:text-black">
                  {/* Document Header */}
                  <div className="border-b border-slate-800 pb-6 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        CONFIDENTIAL BOARD DELIVERABLE
                      </span>
                      <span className="text-slate-400 font-mono">
                        {result.timePeriod} • {result.businessName}
                      </span>
                    </div>
                    <h1 className="text-2xl font-black text-white">{result.reportTitle}</h1>
                    <p className="text-sm text-slate-300 font-medium">{result.subtitle}</p>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Executive Summary
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      {result.executiveSummary}
                    </p>
                  </div>

                  {/* Key Metrics Cards */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                      Core KPI Performance
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {result.keyMetrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1"
                        >
                          <div className="text-[11px] text-slate-400 font-medium truncate">
                            {metric.label}
                          </div>
                          <div className="text-lg font-black text-white font-mono">{metric.value}</div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span
                              className={`flex items-center gap-0.5 font-bold ${
                                metric.trend === 'up' ? 'text-emerald-400' : 'text-cyan-400'
                              }`}
                            >
                              {metric.trend === 'up' ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {metric.change}
                            </span>
                            <span className="text-[10px] text-slate-500">{metric.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SWOT Grid */}
                  {result.swot && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                        Strategic SWOT Evaluation
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Strengths (Internal)
                          </div>
                          <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                            {result.swot.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                            Weaknesses (Internal)
                          </div>
                          <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                            {result.swot.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            Opportunities (External)
                          </div>
                          <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                            {result.swot.opportunities.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Threats (External)
                          </div>
                          <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                            {result.swot.threats.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Analysis Sections */}
                  <div className="space-y-6">
                    {result.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <h4 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                          {sec.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{sec.analysis}</p>
                        {sec.recommendations && sec.recommendations.length > 0 && (
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                            <span className="text-xs font-bold text-emerald-400">
                              Action Recommendations:
                            </span>
                            <ul className="space-y-1">
                              {sec.recommendations.map((r, ri) => (
                                <li key={ri} className="text-xs text-slate-300 flex items-start gap-2">
                                  <span className="text-emerald-400 font-bold">→</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Prioritized Action Plan */}
                  {result.actionPlan && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                        Immediate Action Roadmap
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border border-slate-800 rounded-xl overflow-hidden">
                          <thead className="bg-slate-900 text-slate-300 uppercase font-semibold">
                            <tr>
                              <th className="p-3">Priority</th>
                              <th className="p-3">Initiative</th>
                              <th className="p-3">Timeline</th>
                              <th className="p-3">Owner</th>
                              <th className="p-3">Expected Impact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                            {result.actionPlan.map((act, i) => (
                              <tr key={i} className="hover:bg-slate-900/40">
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      act.priority === 'Urgent'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : 'bg-emerald-500/20 text-emerald-300'
                                    }`}
                                  >
                                    {act.priority}
                                  </span>
                                </td>
                                <td className="p-3 font-medium text-slate-100">{act.initiative}</td>
                                <td className="p-3 text-slate-400">{act.timeline}</td>
                                <td className="p-3 text-slate-400">{act.owner}</td>
                                <td className="p-3 text-emerald-400 font-semibold">{act.expectedImpact}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Slide Deck Presentation View */}
              {activeFormat === 'slides' && result.slides && (
                <div className="space-y-4">
                  <div className="glass-panel p-8 rounded-2xl border border-slate-800 min-h-[420px] flex flex-col justify-between relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800 mb-6">
                        <span className="font-semibold text-emerald-400">{result.businessName}</span>
                        <span className="font-mono">
                          Slide {currentSlide + 1} of {result.slides.length}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-2xl font-black text-white">
                          {result.slides[currentSlide].title}
                        </h2>

                        {result.slides[currentSlide].keyStat && (
                          <div className="inline-block p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-black text-3xl font-mono">
                            {result.slides[currentSlide].keyStat}
                          </div>
                        )}

                        <ul className="space-y-3 pt-2">
                          {result.slides[currentSlide].points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Slide bottom controls */}
                    <div className="flex items-center justify-between pt-8 border-t border-slate-800/80">
                      <button
                        onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                        disabled={currentSlide === 0}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Slide</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {result.slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              currentSlide === idx ? 'bg-emerald-400 w-6' : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentSlide((prev) => Math.min(result.slides!.length - 1, prev + 1))
                        }
                        disabled={currentSlide === result.slides.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-xs text-white hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <span>Next Slide</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Data Table / Excel View */}
              {activeFormat === 'table' && result.tableData && (
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-emerald-400" />
                      Extracted Performance Matrix
                    </h3>
                    <button
                      onClick={handleDownloadCsv}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .CSV File</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider">
                        <tr>
                          {result.tableData.headers.map((h, i) => (
                            <th key={i} className="p-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono">
                        {result.tableData.rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-slate-900/40">
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-3 text-slate-200">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-800 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-semibold text-white">Strategy Engine Ready</h4>
                <p className="text-xs text-slate-400">
                  Select your deliverable format, optionally upload raw CSV data or paste metrics on the left, then click "Generate Multi-Format Report".
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Boardroom Slides</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ SWOT Matrix</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Excel CSV Export</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
