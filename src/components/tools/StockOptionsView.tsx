import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Calculator,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  Activity,
  Layers,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface StockOptionResult {
  symbol: string;
  currentPrice: number;
  marketTrend: string;
  biasScore: number;
  verdict: string;
  simpleExplanation: string;
  callOptionSetup: {
    recommendedStrike: string;
    entryPrice: string;
    stopLoss: string;
    target1: string;
    target2: string;
    riskRewardRatio: string;
    winProbability: string;
    triggerCondition: string;
  };
  putOptionSetup: {
    recommendedStrike: string;
    entryPrice: string;
    stopLoss: string;
    target1: string;
    target2: string;
    riskRewardRatio: string;
    winProbability: string;
    triggerCondition: string;
  };
  riskManagementRules: string[];
  supportResistanceLevels: {
    immediateSupport: number;
    majorSupport: number;
    immediateResistance: number;
    majorResistance: number;
  };
}

const POPULAR_TICKERS = [
  { symbol: 'NIFTY 50', name: 'India Benchmark Index', price: 24865, change: '+0.54%', trend: 'up' },
  { symbol: 'BANK NIFTY', name: 'Banking Sector Index', price: 53420, change: '+0.88%', trend: 'up' },
  { symbol: 'FINNIFTY', name: 'Financial Services', price: 23810, change: '+0.42%', trend: 'up' },
  { symbol: 'S&P 500', name: 'US 500 Index', price: 5885, change: '+0.32%', trend: 'up' },
  { symbol: 'NASDAQ 100', name: 'Tech US Index', price: 18450, change: '-0.18%', trend: 'down' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2895, change: '+1.15%', trend: 'up' },
  { symbol: 'TATA MOTORS', name: 'Automotive Giant', price: 948, change: '+1.40%', trend: 'up' },
  { symbol: 'APPLE', name: 'Apple Inc.', price: 234.5, change: '+0.65%', trend: 'up' },
];

export const StockOptionsView: React.FC = () => {
  const { t } = useI18n();

  const [selectedTicker, setSelectedTicker] = useState('NIFTY 50');
  const [currentPrice, setCurrentPrice] = useState(24865);
  const [tradingStyle, setTradingStyle] = useState('Intraday Options Buying (15M Scalp)');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StockOptionResult | null>(null);

  // Profit calculator state
  const [lotSize, setLotSize] = useState(25);
  const [numLots, setNumLots] = useState(2);
  const [calcEntry, setCalcEntry] = useState(140);
  const [calcTarget, setCalcTarget] = useState(195);
  const [calcStopLoss, setCalcStopLoss] = useState(115);

  const fetchAnalysis = async (sym: string, price: number, style: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: sym,
          currentPrice: price,
          tradingStyle: style,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(selectedTicker, currentPrice, tradingStyle);
  }, [selectedTicker, tradingStyle]);

  const handleSelectTicker = (tick: (typeof POPULAR_TICKERS)[0]) => {
    setSelectedTicker(tick.symbol);
    setCurrentPrice(tick.price);
    if (tick.symbol.includes('NIFTY') && !tick.symbol.includes('BANK')) setLotSize(25);
    else if (tick.symbol.includes('BANK')) setLotSize(15);
    else setLotSize(100);
  };

  // Calculations
  const totalQuantity = lotSize * numLots;
  const totalInvestment = totalQuantity * calcEntry;
  const totalPotentialProfit = totalQuantity * (calcTarget - calcEntry);
  const totalMaxRisk = totalQuantity * (calcEntry - calcStopLoss);
  const returnOnCapital = totalInvestment > 0 ? ((totalPotentialProfit / totalInvestment) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-green-900/20 to-teal-900/30 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_stock_options')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Beginner Friendly • Zero Technical Jargon
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Clear CALL and PUT buying levels with exact Entry, Stop Loss, and Targets, explained in plain English for anyone to understand.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchAnalysis(selectedTicker, currentPrice, tradingStyle)}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Live Market Symbols Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Select Market Ticker
          </span>
          <span className="text-[11px] text-slate-500">Live Simulated Order Flow</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {POPULAR_TICKERS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => handleSelectTicker(t)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedTicker === t.symbol
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span>{t.symbol}</span>
                <span className={t.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
                  {t.change}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300 font-semibold mt-1">
                {t.price.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Output */}
      {analysis && (
        <div className="space-y-6">
          {/* Verdict Summary Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Today's Trade Bias for {analysis.symbol} (₹{analysis.currentPrice.toLocaleString()})
                </span>
                <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-2">
                  <ArrowUpRight className="w-6 h-6" />
                  {analysis.verdict}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Bullish Confidence</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">{analysis.biasScore}%</div>
                </div>
                <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${analysis.biasScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Beginner-Friendly Simple Explanation */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                Why This Trade? (Explained For Beginners With Zero Jargon)
              </div>
              <p className="text-sm text-slate-100 leading-relaxed font-medium">
                {analysis.simpleExplanation}
              </p>
            </div>
          </div>

          {/* Option Buying Cards: CALL (CE) vs PUT (PE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CALL BUY CARD */}
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-bl-xl border-l border-b border-emerald-500/30">
                PROFIT WHEN MARKET RISES
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  CE
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    CALL OPTION ({analysis.callOptionSetup.recommendedStrike})
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold">
                    Win Probability: {analysis.callOptionSetup.winProbability} • Risk-to-Reward:{' '}
                    {analysis.callOptionSetup.riskRewardRatio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Entry Trigger</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {analysis.callOptionSetup.entryPrice}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Strict Stop-Loss</span>
                  <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                    {analysis.callOptionSetup.stopLoss}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Target 1 (Book 50%)</span>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                    {analysis.callOptionSetup.target1}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Target 2 (Runner)</span>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {analysis.callOptionSetup.target2}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-emerald-300">Simple Rule: </strong>
                {analysis.callOptionSetup.triggerCondition}
              </div>
            </div>

            {/* PUT BUY CARD */}
            <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider rounded-bl-xl border-l border-b border-rose-500/30">
                PROFIT WHEN MARKET FALLS
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                  PE
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    PUT OPTION ({analysis.putOptionSetup.recommendedStrike})
                  </h3>
                  <p className="text-xs text-rose-400 font-semibold">
                    Win Probability: {analysis.putOptionSetup.winProbability} • Risk-to-Reward:{' '}
                    {analysis.putOptionSetup.riskRewardRatio}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Entry Trigger</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {analysis.putOptionSetup.entryPrice}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Strict Stop-Loss</span>
                  <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                    {analysis.putOptionSetup.stopLoss}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Target 1 (Book 50%)</span>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                    {analysis.putOptionSetup.target1}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-amber-400">Target 2 (Runner)</span>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                    {analysis.putOptionSetup.target2}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-rose-300">Simple Rule: </strong>
                {analysis.putOptionSetup.triggerCondition}
              </div>
            </div>
          </div>

          {/* Golden Rules & Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Capital Protection Rules (Non-Negotiable)
              </h4>
              <ul className="space-y-2">
                {analysis.riskManagementRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Key Floor & Ceiling Price Levels
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">Support Floor</span>
                  <span className="font-bold text-emerald-400">
                    ₹{analysis.supportResistanceLevels.immediateSupport}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">Resistance Ceiling</span>
                  <span className="font-bold text-rose-400">
                    ₹{analysis.supportResistanceLevels.immediateResistance}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">Major Floor</span>
                  <span className="font-bold text-slate-300">
                    ₹{analysis.supportResistanceLevels.majorSupport}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">Major Breakout Point</span>
                  <span className="font-bold text-slate-300">
                    ₹{analysis.supportResistanceLevels.majorResistance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Option Lot & Profit Calculator */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Interactive Option Lot & Profit Calculator</h3>
                <p className="text-xs text-slate-400">
                  Calculate required investment capital, maximum loss at stop-loss, and total net profit in rupees.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Lot Size (Per Lot)</label>
                <input
                  type="number"
                  value={lotSize}
                  onChange={(e) => setLotSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Number of Lots</label>
                <input
                  type="number"
                  min={1}
                  value={numLots}
                  onChange={(e) => setNumLots(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Buy Entry (₹)</label>
                <input
                  type="number"
                  value={calcEntry}
                  onChange={(e) => setCalcEntry(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Exit (₹)</label>
                <input
                  type="number"
                  value={calcTarget}
                  onChange={(e) => setCalcTarget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Stop Loss Exit (₹)</label>
                <input
                  type="number"
                  value={calcStopLoss}
                  onChange={(e) => setCalcStopLoss(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Results Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Quantity</div>
                <div className="text-xl font-bold font-mono text-white mt-1">{totalQuantity} Units</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{numLots} lots x {lotSize} qty</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Capital Required</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  ₹{totalInvestment.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Total upfront money</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-rose-400 uppercase font-semibold">Max Risk (At Stop Loss)</div>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                  -₹{Math.max(0, totalMaxRisk).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Worst case scenario</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="text-[11px] text-emerald-300 uppercase font-bold">Estimated Net Profit</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  +₹{Math.max(0, totalPotentialProfit).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                  +{returnOnCapital}% ROI on capital
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
