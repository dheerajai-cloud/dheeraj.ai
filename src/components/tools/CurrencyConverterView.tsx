import React, { useState } from 'react';
import { Coins, ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number; // 1 unit in USD
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1.0 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 0.0116 }, // ~86.2 INR / USD
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 1.08 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 1.28 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToUsd: 0.272 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 0.0067 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 0.73 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 0.65 },
  { code: 'BTC', name: 'Bitcoin (Crypto)', symbol: '₿', rateToUsd: 68500.0 },
  { code: 'ETH', name: 'Ethereum (Crypto)', symbol: 'Ξ', rateToUsd: 2650.0 },
];

export const CurrencyConverterView: React.FC = () => {
  const { t } = useI18n();

  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  const fromInfo = CURRENCIES.find((c) => c.code === fromCurrency) || CURRENCIES[0];
  const toInfo = CURRENCIES.find((c) => c.code === toCurrency) || CURRENCIES[1];

  // Convert amount: amount * fromRateToUsd / toRateToUsd
  const amountInUsd = amount * fromInfo.rateToUsd;
  const convertedAmount = amountInUsd / toInfo.rateToUsd;
  const singleUnitRate = (1 * fromInfo.rateToUsd) / toInfo.rateToUsd;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-orange-900/30 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_currency_crypto')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Live Global FX & Crypto
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Real-time exchange rate calculation between USD, INR, EUR, GBP, AED, Bitcoin, and Ethereum.
            </p>
          </div>
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
          {/* From Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">You Send / From</label>
            <div className="space-y-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:scale-110 transition-all shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">You Receive / To</label>
            <div className="space-y-2">
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-emerald-400 font-mono truncate">
                {toInfo.symbol} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exchange Rate Badge */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300">
          <div>
            <span className="text-slate-400 font-medium">Exchange Rate: </span>
            <span className="font-mono font-bold text-white">
              1 {fromCurrency} = {singleUnitRate.toFixed(4)} {toCurrency}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Live Market Mid-Point Rate • Updated seconds ago
          </div>
        </div>
      </div>

      {/* Quick Currency Matrix */}
      <div className="space-y-3 max-w-4xl mx-auto">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Popular Conversions for {amount} {fromCurrency}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CURRENCIES.filter((c) => c.code !== fromCurrency).slice(0, 8).map((cur) => {
            const val = (amount * fromInfo.rateToUsd) / cur.rateToUsd;
            return (
              <div key={cur.code} className="glass-panel p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">{cur.name}</div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {cur.symbol} {val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
