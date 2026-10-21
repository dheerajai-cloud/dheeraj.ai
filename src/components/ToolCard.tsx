import React from 'react';
import {
  PenTool,
  Clapperboard,
  Sparkles,
  FileSpreadsheet,
  TrendingUp,
  Globe,
  Megaphone,
  Search,
  Link2,
  Type,
  Coins,
  Calculator,
  QrCode,
  Code2,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { ToolDefinition } from '../types/tools';
import { useI18n } from '../utils/i18n';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  PenTool,
  Clapperboard,
  Sparkles,
  FileSpreadsheet,
  TrendingUp,
  Globe,
  Megaphone,
  Search,
  Link2,
  Type,
  Coins,
  Calculator,
  QrCode,
  Code2,
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const { t } = useI18n();
  const IconComponent = ICON_MAP[tool.iconName] || Sparkles;

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Top row: Icon, Badge & Favorite */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.accentGradient} p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
          >
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center text-white">
              <IconComponent className="w-5 h-5 text-slate-100 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tool.badge && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {tool.badge}
              </span>
            )}
            <button
              onClick={(e) => onToggleFavorite(tool.id, e)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-200'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
          {t(tool.titleKey)}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 font-normal">
          {t(tool.descKey)}
        </p>
      </div>

      {/* Bottom CTA Row */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex gap-1.5">
          {tool.tags.slice(0, 2).map((tg, idx) => (
            <span
              key={idx}
              className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800"
            >
              #{tg}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
          <span>{t('launch_tool')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
