import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  RefreshCw,
  KeyRound,
  Palette,
  FileCode,
  CaseSensitive,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const DeveloperToolsView: React.FC = () => {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'json' | 'case' | 'password' | 'palette'>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. JSON Formatter
  const [jsonInput, setJsonInput] = useState('{"name":"OmniTools","version":"2.0.0","capabilities":["ai","content","video","reporting","trading"],"active":true}');
  const [jsonFormatted, setJsonFormatted] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonFormatted(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonFormatted(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  // 2. Case Converter
  const [caseInput, setCaseInput] = useState('Build unstoppable all in one super platform with high speed');
  const toCamelCase = (str: string) =>
    str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  const toSnakeCase = (str: string) => str.trim().toLowerCase().replace(/\s+/g, '_');
  const toKebabCase = (str: string) => str.trim().toLowerCase().replace(/\s+/g, '-');
  const toPascalCase = (str: string) =>
    str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');

  // 3. Password Generator
  const [passLength, setPassLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('Omni9#kL!29$Xw8m');

  const generateNewPassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';

    let pass = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      pass += chars[array[i] % chars.length];
    }
    setGeneratedPassword(pass);
  };

  // 4. Color Palette Generator
  const [palette, setPalette] = useState([
    { name: 'Obsidian Void', hex: '#090D16' },
    { name: 'Electric Indigo', hex: '#6366F1' },
    { name: 'Emerald Spark', hex: '#10B981' },
    { name: 'Cyber Rose', hex: '#F43F5E' },
    { name: 'Amber Glow', hex: '#F59E0B' },
  ]);

  const generateRandomPalette = () => {
    const letters = '0123456789ABCDEF';
    const names = ['Midnight Slate', 'Neon Cyan', 'Ultra Violet', 'Solar Flare', 'Deep Cosmos', 'Aurora Green', 'Crimson Flame'];
    const newPal = names.slice(0, 5).map((n) => {
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return { name: n, hex: color };
    });
    setPalette(newPal);
  };

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900/30 via-indigo-900/20 to-purple-900/30 border border-sky-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_dev_suite')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
                Developer & Text Utility Hub
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Format & validate JSON, convert text casing, generate cryptographic passwords, and extract color palettes.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'json' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON Formatter
          </button>
          <button
            onClick={() => setActiveTab('case')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'case' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Case Converter
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'password' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Password Vault
          </button>
          <button
            onClick={() => setActiveTab('palette')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'palette' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Color Palette
          </button>
        </div>
      </div>

      {/* Tab 1: JSON Formatter */}
      {activeTab === 'json' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Raw JSON Input</span>
              <div className="flex gap-2">
                <button
                  onClick={formatJson}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium"
                >
                  Beautify (Format)
                </button>
                <button
                  onClick={minifyJson}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Minify
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase">Output Result</span>
              {jsonFormatted && (
                <button
                  onClick={() => copyText(jsonFormatted, 'json_out')}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  {copiedKey === 'json_out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json_out' ? 'Copied' : 'Copy Output'}</span>
                </button>
              )}
            </div>

            {jsonError ? (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs font-mono">
                Error: {jsonError}
              </div>
            ) : (
              <pre className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto min-h-[260px]">
                {jsonFormatted || '// Click "Beautify (Format)" to format input'}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Case Converter */}
      {activeTab === 'case' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-300">Input String</label>
            <input
              type="text"
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div
              onClick={() => copyText(toCamelCase(caseInput), 'camel')}
              className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-sky-500/40 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">camelCase</span>
                <span className="text-sky-300 font-bold">{toCamelCase(caseInput)}</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </div>

            <div
              onClick={() => copyText(toSnakeCase(caseInput), 'snake')}
              className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-sky-500/40 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">snake_case</span>
                <span className="text-emerald-300 font-bold">{toSnakeCase(caseInput)}</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </div>

            <div
              onClick={() => copyText(toKebabCase(caseInput), 'kebab')}
              className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-sky-500/40 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">kebab-case</span>
                <span className="text-purple-300 font-bold">{toKebabCase(caseInput)}</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </div>

            <div
              onClick={() => copyText(toPascalCase(caseInput), 'pascal')}
              className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-sky-500/40 cursor-pointer flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">PascalCase</span>
                <span className="text-amber-300 font-bold">{toPascalCase(caseInput)}</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Password Vault */}
      {activeTab === 'password' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 max-w-xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-emerald-400 break-all select-all">
              {generatedPassword}
            </span>
            <button
              onClick={() => copyText(generatedPassword, 'pass')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 shrink-0 ml-3"
            >
              {copiedKey === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Password Length</span>
                <span className="text-sky-400 font-mono">{passLength} Chars</span>
              </div>
              <input
                type="range"
                min={8}
                max={48}
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded border-slate-800 accent-sky-500"
                />
                <span>Include Symbols (!@#$)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded border-slate-800 accent-sky-500"
                />
                <span>Include Numbers (0-9)</span>
              </label>
            </div>

            <button
              onClick={generateNewPassword}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Strong Password</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Color Palette */}
      {activeTab === 'palette' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Harmonized Hex Palette</h3>
            <button
              onClick={generateRandomPalette}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize Palette</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {palette.map((item, idx) => (
              <div
                key={idx}
                onClick={() => copyText(item.hex, `hex_${idx}`)}
                className="rounded-2xl border border-slate-800 overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1 shadow-lg"
              >
                <div className="h-32 w-full flex items-center justify-center" style={{ backgroundColor: item.hex }}>
                  <span className="opacity-0 group-hover:opacity-100 bg-black/60 px-2 py-1 rounded text-white text-[11px] font-mono transition-opacity">
                    {copiedKey === `hex_${idx}` ? 'Copied!' : 'Copy Hex'}
                  </span>
                </div>
                <div className="p-3 bg-slate-900 space-y-0.5">
                  <div className="text-[11px] text-slate-400 truncate">{item.name}</div>
                  <div className="text-xs font-mono font-bold text-white">{item.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
