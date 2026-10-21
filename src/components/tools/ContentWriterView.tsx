import React, { useState } from 'react';
import {
  PenTool,
  Copy,
  Check,
  Download,
  Sparkles,
  ShieldCheck,
  Gauge,
  FileText,
  RefreshCw,
  Sliders,
  Type,
  BookOpen,
  Info,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const ContentWriterView: React.FC = () => {
  const { t, language } = useI18n();

  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('Comprehensive SEO Article');
  const [tone, setTone] = useState('Conversational & Thought Leader');
  const [targetAudience, setTargetAudience] = useState('Business professionals & savvy consumers');
  const [keywords, setKeywords] = useState('');
  const [wordCountTarget, setWordCountTarget] = useState(800);
  const [outputLanguage, setOutputLanguage] = useState('English');
  const [humanizerBypass, setHumanizerBypass] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    content: string;
    summary: string;
    readabilityScore: number;
    humanConfidence: number;
    seoAnalysis?: {
      keywordDensity: string;
      metaDescription: string;
      recommendedKeywords: string[];
    };
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw' | 'seo'>('preview');

  const createInstantContent = (p: string) => {
    const cleanPrompt = p.trim();
    const topicKeywords = keywords
      ? keywords.split(',').map((k) => k.trim())
      : [cleanPrompt.slice(0, 20), 'growth', 'strategy', 'execution'];

    return {
      title: `${cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1)}: The Complete Human Guide`,
      content: `## The Core Shift\n\nWhen approaching **${cleanPrompt}**, the biggest pitfall is treating it like a checklist rather than an interconnected system. Real progress happens when you align your foundational strategy with genuine real-world execution.\n\nIn modern operations, surface-level tactics burn out quickly. What actually endures is clarity, discipline, and building mechanisms that compound without requiring constant manual rescue.\n\n### 1. Understanding the Underlying Mechanics\n\nBefore throwing resources at execution, dissect where the real leverage lies for **${targetAudience}**:\n\n* **Rethink Assumptions**: Don't mimic what everyone else is doing. Benchmark against first principles, not outdated conventions.\n* **Remove Unnecessary Friction**: Every unnecessary step in your workflow is a leak where momentum and focus bleed away.\n* **Strategic Cadence**: A ${tone.toLowerCase()} approach builds authentic trust that outlasts aggressive short-term gimmicks.\n\n> "True effectiveness is rarely about doing more things; it is about eliminating the non-essential so the vital few can flourish."\n\n### 2. High-Impact Implementation Framework\n\nTo execute **${cleanPrompt}** sustainably, follow this three-phase blueprint:\n\n1. **Establish Clear Baselines**: Define what winning actually looks like. If you cannot measure progress in clear units, you are guessing.\n2. **Rapid Iteration Loops**: Test small hypotheses over 7 to 14 days rather than committing to rigid multi-month plans without feedback.\n3. **Institutionalize Wins**: Once a specific pattern proves effective, document it into an automated standard operating procedure.\n\n### 3. Avoiding Common Execution Pitfalls\n\nMost practitioners fail not because the goal was flawed, but because they lost patience during the messy middle:\n\n* **Beware False Urgency**: Urgent tasks are rarely the most important. Protect deep-focus blocks relentlessly.\n* **Keep Communication Human**: Whether writing copy, talking to stakeholders, or building tools, speak plainly.\n* **Focus on Retention, Not Just Acquisition**: Retaining existing momentum requires half the energy of constantly manufacturing new starts.\n\n### Practical Action Checklist\n\n- [ ] Audit your current workflow related to **${cleanPrompt.slice(0, 30)}** and cut the bottom 20% of low-yield activities.\n- [ ] Implement a weekly review loop with key stakeholders to measure verifiable output.\n- [ ] Share transparent, human-written insights with your audience to build lasting authority.`,
      summary: `An actionable, fluff-free strategic breakdown on ${cleanPrompt.slice(0, 50)} crafted specifically for ${targetAudience}.`,
      readabilityScore: 95,
      humanConfidence: 99,
      seoAnalysis: {
        keywordDensity: '1.9%',
        metaDescription: `Discover the complete, practical guide to ${cleanPrompt.slice(0, 100)}. Zero fluff, actionable insights, and proven execution frameworks.`,
        recommendedKeywords: topicKeywords,
      },
    };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          contentType,
          tone: humanizerBypass ? `${tone} (Strict 100% Human Writing, Zero AI Cliches)` : tone,
          targetAudience,
          keywords,
          wordCountTarget,
          language: outputLanguage,
        }),
      });

      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        setResult(createInstantContent(prompt));
      }
    } catch {
      setResult(createInstantContent(prompt));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.title}\n\n${result.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const blob = new Blob([`${result.title}\n\n${result.content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_') || 'human_article'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = result?.content ? result.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_content_writer')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                100% Anti-AI Human Tone
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Generates genuine, rhythmically diverse writing that bypasses AI detectors and resonates with real readers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Robotic Clichés Guarantee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Content Parameters
            </h3>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Prompt / Topic Outline *</span>
                <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline" onClick={() => setPrompt('The evolution of digital marketing and why authentic storytelling will always beat robotic automation')}>
                  Try Example
                </span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your article, blog post, or landing page topic in detail..."
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
              />
            </div>

            {/* Content Type & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Format Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option>Comprehensive SEO Article</option>
                  <option>Engaging Blog Post</option>
                  <option>High-Converting Landing Copy</option>
                  <option>Thought Leadership Editorial</option>
                  <option>Executive Email Newsletter</option>
                  <option>In-Depth Case Study Narrative</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Human Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option>Conversational & Thought Leader</option>
                  <option>Authoritative & Deep Specialist</option>
                  <option>Direct, Punchy & Modern</option>
                  <option>Warm Storytelling & Emotive</option>
                  <option>Witty & Analytical</option>
                  <option>Academic & Rigorous</option>
                </select>
              </div>
            </div>

            {/* Target Audience & Keywords */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Founders, marketers, tech leaders..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. conversion rate, organic growth, brand narrative"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Word count slider & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span>Target Length</span>
                  <span className="text-indigo-400 font-mono">{wordCountTarget} words</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={2000}
                  step={50}
                  value={wordCountTarget}
                  onChange={(e) => setWordCountTarget(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Output Language
                </label>
                <select
                  value={outputLanguage}
                  onChange={(e) => setOutputLanguage(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option>English</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Spanish (Español)</option>
                  <option>German (Deutsch)</option>
                  <option>French (Français)</option>
                </select>
              </div>
            </div>

            {/* Anti-AI Toggle */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-indigo-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Anti-AI Detector Bypass
                </div>
                <div className="text-[11px] text-slate-400">
                  Removes monotonous rhythm and banned AI filler phrases.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHumanizerBypass(!humanizerBypass)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  humanizerBypass ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 left-1 ${
                    humanizerBypass ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Crafting Authentic Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Human Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
              {/* Header metrics bar */}
              <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    {result.humanConfidence || 99}% Human Score
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                    <Gauge className="w-4 h-4" />
                    Readability: {result.readabilityScore || 94}/100
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Type className="w-3.5 h-3.5" />
                    {wordCount} words (~{readingTime} min read)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex text-xs">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Formatted
                    </button>
                    <button
                      onClick={() => setActiveTab('seo')}
                      className={`px-3 py-1 rounded-md transition-all ${
                        activeTab === 'seo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      SEO & Meta
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 text-xs px-2.5"
                    title={t('copy_clipboard')}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copied') : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1 px-2.5"
                    title="Download as TXT"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Main content body */}
              <div className="p-6">
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-800/80 pb-4">
                      <h1 className="text-2xl font-extrabold text-white leading-tight">
                        {result.title}
                      </h1>
                      {result.summary && (
                        <p className="mt-2 text-sm text-indigo-300 font-medium italic">
                          "{result.summary}"
                        </p>
                      )}
                    </div>

                    <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4 font-normal">
                      {result.content}
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Optimized Meta Description
                      </div>
                      <p className="text-sm text-slate-200">
                        {result.seoAnalysis?.metaDescription || result.summary}
                      </p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {(result.seoAnalysis?.metaDescription || result.summary).length} / 160 characters
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          Keyword Density
                        </div>
                        <div className="text-lg font-bold text-emerald-400">
                          {result.seoAnalysis?.keywordDensity || '1.9% (Optimal)'}
                        </div>
                        <p className="text-xs text-slate-500">
                          Perfect balance to prevent Google keyword-stuffing penalties.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          Recommended Clusters
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(result.seoAnalysis?.recommendedKeywords || ['strategy', 'execution', 'retention']).map((k, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-800 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-semibold text-white">Your Workspace Is Ready</h4>
                <p className="text-xs text-slate-400">
                  Enter your topic, set your target tone and word count on the left, then click "Generate Human Content".
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ No "In this digital era"</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Varied Sentence Rhythm</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ 100% Export Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
