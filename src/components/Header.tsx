import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Globe,
  Layers,
  Heart,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { useI18n, LANGUAGE_OPTIONS, SupportedLanguage } from '../utils/i18n';
import { ToolCategory } from '../types/tools';

interface HeaderProps {
  onOpenSearch: () => void;
  activeCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onReturnHome: () => void;
  isInsideTool: boolean;
  activeToolTitle?: string;
  favoritesCount: number;
  onShowFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  onReturnHome,
  isInsideTool,
  activeToolTitle,
  favoritesCount,
  onShowFavorites,
}) => {
  const { t, language, setLanguage } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07090e]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Back Breadcrumb */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onReturnHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                OMNI<span className="text-indigo-400">TOOLS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              {isInsideTool && activeToolTitle ? (
                <span className="text-indigo-400 font-medium">← {activeToolTitle}</span>
              ) : (
                t('tagline')
              )}
            </div>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <div
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-all w-80 lg:w-96"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="text-xs truncate flex-1">{t('search_placeholder')}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            Ctrl+K
          </span>
        </div>

        {/* Right Action Icons & Language Dropdown */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites Button */}
          <button
            onClick={onShowFavorites}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title={t('favorites')}
          >
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Multi-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition-colors"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900">
                  {t('language')}
                </div>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-900 transition-colors ${
                      language === lang.code ? 'text-indigo-400 font-bold bg-indigo-950/20' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                    {language === lang.code && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
