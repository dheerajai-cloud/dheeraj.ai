import React, { useState } from 'react';
import { Type, Clock, MessageSquare, BarChart2, Copy, Check, Trash2 } from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const WordCounterView: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, '').length;
  const sentenceCount = cleanText ? (cleanText.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphCount = cleanText ? text.split(/\n\s*\n/).filter(Boolean).length : 0;

  // Reading & speaking times (avg 200 wpm reading, 130 wpm speaking)
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const speakingTimeMinutes = Math.ceil(wordCount / 130);

  // Keyword density
  const wordFrequency: Record<string, number> = {};
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'with', 'are', 'as', 'at', 'be']);
  words.forEach((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanWord && cleanWord.length > 2 && !stopWords.has(cleanWord)) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900/30 via-emerald-900/20 to-cyan-900/30 border border-teal-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_word_counter')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium">
                Instant Text Analytics
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Live word count, characters, sentences, paragraphs, reading & speaking time, and keyword density.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={() => setText('')}
            disabled={!text}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Words</div>
          <div className="text-2xl font-black text-teal-400 font-mono mt-1">{wordCount.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Chars (Spaces)</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{charCountWithSpaces.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Chars (No Space)</div>
          <div className="text-2xl font-black text-slate-300 font-mono mt-1">{charCountNoSpaces.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Sentences</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{sentenceCount}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Reading Time</div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">~{readingTimeMinutes} min</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Speaking Time</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">~{speakingTimeMinutes} min</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to analyze in real-time..."
            rows={14}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-normal leading-relaxed resize-y"
          />
        </div>

        {/* Keyword Density Column */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4 h-4 text-teal-400" />
            Top Keyword Frequency
          </h3>

          {sortedKeywords.length > 0 ? (
            <div className="space-y-2.5">
              {sortedKeywords.map(([kw, count], idx) => {
                const percent = ((count / Math.max(1, wordCount)) * 100).toFixed(1);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-200 font-sans font-medium">{kw}</span>
                      <span className="text-slate-400">
                        {count}x ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, Number(percent) * 10)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">
              Start typing on the left to see frequent keyword density.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
