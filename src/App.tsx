import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './utils/i18n';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { ToolCard } from './components/ToolCard';
import { TOOLS_LIST } from './data/toolsList';
import { ToolCategory } from './types/tools';

// Dedicated Tool Views
import { ContentWriterView } from './components/tools/ContentWriterView';
import { VideoStudioView } from './components/tools/VideoStudioView';
import { ImageStudioView } from './components/tools/ImageStudioView';
import { ReportingEngineView } from './components/tools/ReportingEngineView';
import { StockOptionsView } from './components/tools/StockOptionsView';
import { DigitalMarketingView } from './components/tools/DigitalMarketingView';
import { WordCounterView } from './components/tools/WordCounterView';
import { CurrencyConverterView } from './components/tools/CurrencyConverterView';
import { FinancialCalculatorsView } from './components/tools/FinancialCalculatorsView';
import { QrCodeGeneratorView } from './components/tools/QrCodeGeneratorView';
import { DeveloperToolsView } from './components/tools/DeveloperToolsView';

import {
  Sparkles,
  ArrowLeft,
  Search,
  CheckCircle,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Heart,
  ChevronRight,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { t } = useI18n();

  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load favorites from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnitools_favs');
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('omnitools_favs', JSON.stringify(next));
      return next;
    });
  };

  const activeTool = TOOLS_LIST.find((t) => t.id === activeToolId);

  // Category Filtering
  const filteredTools = TOOLS_LIST.filter((tool) => {
    if (showOnlyFavorites) return favorites.includes(tool.id);
    if (selectedCategory === 'all') return true;
    return tool.category === selectedCategory;
  });

  const categories: { id: ToolCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'all_tools' },
    { id: 'featured', labelKey: 'featured' },
    { id: 'marketing', labelKey: 'marketing_seo' },
    { id: 'finance', labelKey: 'trading_finance' },
    { id: 'utilities', labelKey: 'daily_utilities' },
    { id: 'dev', labelKey: 'dev_text' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Universal Header */}
      <Header
        onOpenSearch={() => setSearchModalOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowOnlyFavorites(false);
          setActiveToolId(null);
        }}
        onReturnHome={() => {
          setActiveToolId(null);
          setShowOnlyFavorites(false);
        }}
        isInsideTool={Boolean(activeToolId)}
        activeToolTitle={activeTool ? t(activeTool.titleKey) : undefined}
        favoritesCount={favorites.length}
        onShowFavorites={() => {
          setActiveToolId(null);
          setShowOnlyFavorites(!showOnlyFavorites);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeToolId && activeTool ? (
          /* Dedicated Tool Studio Workspace View */
          <div className="space-y-6 animate-fadeIn">
            {/* Top Breadcrumb & Quick Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <button
                onClick={() => setActiveToolId(null)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('back_to_catalog')}</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:inline">Switch Studio:</span>
                <select
                  value={activeToolId}
                  onChange={(e) => setActiveToolId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {TOOLS_LIST.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {t(tool.titleKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Render the specific studio component */}
            {activeToolId === 'content-writer' && <ContentWriterView />}
            {activeToolId === 'video-studio' && <VideoStudioView />}
            {activeToolId === 'image-studio' && <ImageStudioView />}
            {activeToolId === 'reporting-engine' && <ReportingEngineView />}
            {activeToolId === 'stock-options' && <StockOptionsView />}
            {(activeToolId === 'seo-meta' ||
              activeToolId === 'ad-copy' ||
              activeToolId === 'keyword-cluster' ||
              activeToolId === 'utm-builder') && <DigitalMarketingView />}
            {activeToolId === 'word-counter' && <WordCounterView />}
            {activeToolId === 'currency-crypto' && <CurrencyConverterView />}
            {activeToolId === 'financial-calculators' && <FinancialCalculatorsView />}
            {activeToolId === 'qr-generator' && <QrCodeGeneratorView />}
            {activeToolId === 'dev-suite' && <DeveloperToolsView />}
          </div>
        ) : (
          /* Catalog & Hero Explorer View */
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/70 to-indigo-950/20 text-center space-y-6">
              {/* Background ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('active_tools_count')}</span>
                  <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span>100% Free Forever</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {t('hero_headline')}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {t('hero_subheadline')}
                </p>

                {/* Big Search Input Trigger */}
                <div className="pt-2 max-w-xl mx-auto">
                  <div
                    onClick={() => setSearchModalOpen(true)}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-500/60 shadow-xl cursor-pointer transition-all group"
                  >
                    <Search className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-slate-400 flex-1 text-left truncate">
                      {t('search_placeholder')}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      Ctrl+K
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero Robotic AI Cliches</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Beginner-Friendly Options Levels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Real-Time In-Browser Execution</span>
                </div>
              </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowOnlyFavorites(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat.id && !showOnlyFavorites
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {t(cat.labelKey)}
                    </button>
                  ))}

                  {favorites.length > 0 && (
                    <button
                      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        showOnlyFavorites
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : 'bg-slate-900/80 text-rose-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {t('favorites')} ({favorites.length})
                      </span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
                </div>
              </div>

              {/* Tools Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={(id) => setActiveToolId(id)}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTool={(id) => setActiveToolId(id)}
      />

      {/* Universal Footer */}
      <footer className="border-t border-slate-900 bg-[#07090e] mt-16 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">DHEERAJ TOOLS PRO</span>
            <span>•</span>
            <span>The Comprehensive Multi-Tool Power Platform by Dheeraj</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Free & Unlimited Access</span>
            <span>•</span>
            <span>Multi-Language Ready</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Status: Systems Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <MainAppContent />
    </I18nProvider>
  );
}
