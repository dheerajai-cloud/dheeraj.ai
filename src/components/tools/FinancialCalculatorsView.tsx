import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const FinancialCalculatorsView: React.FC = () => {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'sip' | 'emi'>('sip');

  // SIP Calculator State
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12.5);
  const [timePeriodYears, setTimePeriodYears] = useState(15);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);

  // SIP Math: M * [ (1 + i)^n - 1 ] / i * (1 + i)
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = timePeriodYears * 12;
  const totalInvestedAmount = monthlyInvestment * totalMonths;
  const futureValue =
    monthlyRate > 0
      ? monthlyInvestment *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate)
      : totalInvestedAmount;
  const totalEstimatedReturns = Math.max(0, futureValue - totalInvestedAmount);

  // EMI Math: P * r * (1 + r)^n / [ (1 + r)^n - 1 ]
  const emiMonthlyRate = loanInterestRate / 12 / 100;
  const emiTotalMonths = loanTenureYears * 12;
  const monthlyEmi =
    emiMonthlyRate > 0
      ? (loanAmount * emiMonthlyRate * Math.pow(1 + emiMonthlyRate, emiTotalMonths)) /
        (Math.pow(1 + emiMonthlyRate, emiTotalMonths) - 1)
      : loanAmount / emiTotalMonths;
  const totalLoanRepayment = monthlyEmi * emiTotalMonths;
  const totalInterestPayable = Math.max(0, totalLoanRepayment - loanAmount);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-cyan-900/30 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_finance_calc')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Compounding & Debt Planning
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Interactive SIP investment wealth growth and monthly loan EMI repayment calculator.
            </p>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sip')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sip' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            SIP Compounding
          </button>
          <button
            onClick={() => setActiveTab('emi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'emi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Loan EMI Calculator
          </button>
        </div>
      </div>

      {activeTab === 'sip' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              SIP Investment Parameters
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Monthly Investment</span>
                <span className="text-emerald-400 font-mono">₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={200000}
                step={500}
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Expected Annual Return Rate</span>
                <span className="text-emerald-400 font-mono">{annualReturnRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Time Horizon</span>
                <span className="text-emerald-400 font-mono">{timePeriodYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={timePeriodYears}
                onChange={(e) => setTimePeriodYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Wealth Projections
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Invested Amount</span>
                <span className="text-base font-bold text-slate-200 font-mono">
                  ₹{Math.round(totalInvestedAmount).toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Estimated Wealth Gains</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  +₹{Math.round(totalEstimatedReturns).toLocaleString()}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase">Total Corpus Value</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{Math.round(futureValue).toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-xs text-emerald-300 font-medium">
                  {((futureValue / Math.max(1, totalInvestedAmount)) * 100).toFixed(0)}% Growth
                </div>
              </div>
            </div>

            {/* Visual compounding bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Principal: {((totalInvestedAmount / futureValue) * 100).toFixed(0)}%</span>
                <span>Interest: {((totalEstimatedReturns / futureValue) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-slate-400 h-full"
                  style={{ width: `${(totalInvestedAmount / futureValue) * 100}%` }}
                />
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(totalEstimatedReturns / futureValue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Loan Repayment Details
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Total Loan Amount</span>
                <span className="text-emerald-400 font-mono">₹{loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={20000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Annual Interest Rate</span>
                <span className="text-emerald-400 font-mono">{loanInterestRate}%</span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                step={0.1}
                value={loanInterestRate}
                onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
                <span>Tenure Duration</span>
                <span className="text-emerald-400 font-mono">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Monthly Repayment & Total Cost
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase">Monthly EMI Payment</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{Math.round(monthlyEmi).toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  {emiTotalMonths} total installments
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Principal Loan Amount</span>
                <span className="text-base font-bold text-slate-200 font-mono">
                  ₹{loanAmount.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Interest Payable</span>
                <span className="text-base font-bold text-rose-400 font-mono">
                  ₹{Math.round(totalInterestPayable).toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Overall Outflow</span>
                <span className="text-base font-bold text-white font-mono">
                  ₹{Math.round(totalLoanRepayment).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
