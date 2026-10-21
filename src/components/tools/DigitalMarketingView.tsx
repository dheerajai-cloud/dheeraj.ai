import React, { useState } from 'react';
import {
  Globe,
  Megaphone,
  Search,
  Link2,
  Copy,
  Check,
  Eye,
  Sparkles,
  ExternalLink,
  Sliders,
  Share2,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const DigitalMarketingView: React.FC = () => {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'serp' | 'ads' | 'keywords' | 'utm'>('serp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // SERP state
  const [pageTitle, setPageTitle] = useState('Best AI Super Platform for Modern Creators & Marketers | OmniTools');
  const [metaDescription, setMetaDescription] = useState('Discover 35+ high-performance tools in one studio. Generate undetectable human content, cinematic AI videos, 8K art, business reports, and live stock options levels.');
  const [targetUrl, setTargetUrl] = useState('https://omnitools.pro/ai-studio');
  const [devicePreview, setDevicePreview] = useState<'google' | 'facebook' | 'twitter'>('google');

  // Ad Copy state
  const [adBrand, setAdBrand] = useState('OmniTools Cloud');
  const [adProduct, setAdProduct] = useState('All-in-One Digital Marketing & AI Suite');
  const [adGoal, setAdGoal] = useState('Drive Free Signups & Trial Users');
  const [generatedAds, setGeneratedAds] = useState([
    {
      headline: '35+ AI Tools in 1 Studio',
      description: 'Ditch multiple $99/mo subscriptions. Create human articles, cinematic videos, 8K visuals & strategy decks instantly.',
      ctrScore: '8.4% Est. CTR',
    },
    {
      headline: 'Human-Written AI Copy That Converts',
      description: 'Zero robotic clichés. Generate 100% authentic, SEO-optimized blogs & landing copy with one click. Try free now.',
      ctrScore: '9.2% Est. CTR',
    },
    {
      headline: 'Instant Options Trading Levels',
      description: 'No technical jargon. Clear Call & Put buying levels, exact stop-losses, and profit targets. Start trading smarter today.',
      ctrScore: '7.8% Est. CTR',
    },
  ]);

  // Keywords state
  const [seedKeyword, setSeedKeyword] = useState('digital marketing tools');
  const [keywordResults, setKeywordResults] = useState([
    { keyword: 'best digital marketing tools 2026', volume: '49,500', cpc: '$3.45', difficulty: 'Medium (42)' },
    { keyword: 'free ai content writer undetectable', volume: '74,200', cpc: '$2.80', difficulty: 'High (68)' },
    { keyword: 'ai video generator for youtube', volume: '110,000', cpc: '$4.12', difficulty: 'High (74)' },
    { keyword: 'stock options buying levels today', volume: '33,100', cpc: '$1.95', difficulty: 'Low (28)' },
    { keyword: 'online executive report generator', volume: '18,400', cpc: '$5.60', difficulty: 'Low (22)' },
  ]);

  // UTM builder state
  const [utmUrl, setUtmUrl] = useState('https://mywebsite.com/landing');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('summer_scale_2026');
  const [utmTerm, setUtmTerm] = useState('ai_tools');

  const generatedUtmLink = `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}${utmTerm ? `&utm_term=${utmTerm}` : ''}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-teal-900/30 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Digital Marketing & Growth Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                PPC • SEO • UTM • SERP
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              High-CTR ad generators, Google SERP & OpenGraph card previews, keyword clustering, and campaign tracking builders.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('serp')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'serp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SERP & Meta
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'ads' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ad Copywriter
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'keywords' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Keywords
          </button>
          <button
            onClick={() => setActiveTab('utm')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'utm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            UTM Builder
          </button>
        </div>
      </div>

      {/* Tab 1: SERP Meta & Social Card Preview */}
      {activeTab === 'serp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Meta Tag Specifications
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-300">Target Web URL</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Page Meta Title</span>
                <span className={pageTitle.length > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                  {pageTitle.length} / 60
                </span>
              </div>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Meta Description</span>
                <span className={metaDescription.length > 160 ? 'text-amber-400' : 'text-emerald-400'}>
                  {metaDescription.length} / 160
                </span>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-y"
              />
            </div>

            <button
              onClick={() => {
                const code = `<title>${pageTitle}</title>\n<meta name="description" content="${metaDescription}" />\n<meta property="og:title" content="${pageTitle}" />\n<meta property="og:description" content="${metaDescription}" />\n<meta property="og:url" content="${targetUrl}" />\n<meta name="twitter:card" content="summary_large_image" />`;
                copyToClipboard(code, 'html_tags');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              {copiedKey === 'html_tags' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'html_tags' ? 'HTML Meta Tags Copied!' : 'Copy HTML Meta Code'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Live Search & Social Preview</h3>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setDevicePreview('google')}
                  className={`px-2.5 py-1 rounded ${devicePreview === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Google SERP
                </button>
                <button
                  onClick={() => setDevicePreview('facebook')}
                  className={`px-2.5 py-1 rounded ${devicePreview === 'facebook' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Facebook / LinkedIn
                </button>
                <button
                  onClick={() => setDevicePreview('twitter')}
                  className={`px-2.5 py-1 rounded ${devicePreview === 'twitter' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  Twitter / X Card
                </button>
              </div>
            </div>

            {devicePreview === 'google' && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#202124] text-[#bdc1c6] space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#9aa0a6] font-sans">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                    G
                  </div>
                  <span className="truncate">{targetUrl}</span>
                </div>
                <h4 className="text-lg text-[#8ab4f8] font-normal hover:underline cursor-pointer leading-tight">
                  {pageTitle}
                </h4>
                <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                  {metaDescription}
                </p>
              </div>
            )}

            {devicePreview === 'facebook' && (
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 flex items-center justify-center text-white text-base font-bold">
                  {pageTitle.slice(0, 45)}...
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[11px] uppercase font-mono text-slate-400">{new URL(targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl).hostname}</div>
                  <div className="text-sm font-bold text-white">{pageTitle}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">{metaDescription}</div>
                </div>
              </div>
            )}

            {devicePreview === 'twitter' && (
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 bg-black">
                <div className="h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center text-white text-base font-bold p-4 text-center">
                  {pageTitle}
                </div>
                <div className="p-4 space-y-1 border-t border-slate-800">
                  <div className="text-xs font-bold text-white">{pageTitle}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{metaDescription}</div>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">{targetUrl}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: High-CTR Ad Copywriter */}
      {activeTab === 'ads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Campaign Ad Parameters
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Brand / Service Name</label>
              <input
                type="text"
                value={adBrand}
                onChange={(e) => setAdBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Value Proposition / Product</label>
              <input
                type="text"
                value={adProduct}
                onChange={(e) => setAdProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Campaign Call To Action (Goal)</label>
              <input
                type="text"
                value={adGoal}
                onChange={(e) => setAdGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              />
            </div>

            <button
              onClick={() => {
                setGeneratedAds([
                  {
                    headline: `${adBrand} • Top Rated Solution`,
                    description: `Experience ${adProduct} built to ${adGoal.toLowerCase()}. Zero risk, setup in 60 seconds.`,
                    ctrScore: '9.4% Est. CTR',
                  },
                  {
                    headline: `Stop Wasting Time on Clunky Tools`,
                    description: `Switch to ${adBrand}. Powerful, human-crafted, and designed for immediate results. Get started today.`,
                    ctrScore: '8.9% Est. CTR',
                  },
                ]);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate High-CTR Variants</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-white">Recommended High-CTR Ad Variations</h3>
            <div className="space-y-3">
              {generatedAds.map((ad, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Ad Variant #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {ad.ctrScore}
                    </span>
                  </div>

                  <div className="text-sm font-black text-white">{ad.headline}</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{ad.description}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500">30 char headline • 90 char body standard</span>
                    <button
                      onClick={() => copyToClipboard(`${ad.headline}\n${ad.description}`, `ad_${idx}`)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedKey === `ad_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Ad Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Keyword Clustering & Research */}
      {activeTab === 'keywords' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={seedKeyword}
                onChange={(e) => setSeedKeyword(e.target.value)}
                placeholder="Enter seed keyword (e.g. digital marketing, options trading)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              onClick={() => {
                setKeywordResults([
                  { keyword: `${seedKeyword} software free`, volume: '38,200', cpc: '$2.90', difficulty: 'Medium (38)' },
                  { keyword: `best ${seedKeyword} strategies 2026`, volume: '62,000', cpc: '$4.10', difficulty: 'High (65)' },
                  { keyword: `${seedKeyword} step by step tutorial`, volume: '22,400', cpc: '$1.75', difficulty: 'Low (19)' },
                  { keyword: `how to use ${seedKeyword} for business`, volume: '41,500', cpc: '$3.50', difficulty: 'Medium (44)' },
                ]);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs whitespace-nowrap"
            >
              Analyze Clusters
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-3">Search Query / Keyword Cluster</th>
                  <th className="p-3">Monthly Volume</th>
                  <th className="p-3">Avg CPC</th>
                  <th className="p-3">SEO Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono">
                {keywordResults.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 font-medium text-slate-100 font-sans">{kw.keyword}</td>
                    <td className="p-3 text-cyan-400 font-bold">{kw.volume}</td>
                    <td className="p-3 text-emerald-400">{kw.cpc}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {kw.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: UTM Link Builder */}
      {activeTab === 'utm' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              UTM Parameters
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Website URL *</label>
              <input
                type="text"
                value={utmUrl}
                onChange={(e) => setUtmUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Campaign Source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="google, newsletter, twitter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Campaign Medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="cpc, banner, email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Campaign Name</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="black_friday, q3_launch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Campaign Term / Keyword</label>
                <input
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  placeholder="ai_software"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-emerald-400" />
                Generated Tracking URL
              </h3>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 break-all font-mono text-xs text-emerald-400 leading-relaxed">
                {generatedUtmLink}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(generatedUtmLink, 'utm_link')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {copiedKey === 'utm_link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'utm_link' ? 'Copied UTM Link!' : 'Copy Full Tracking URL'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
