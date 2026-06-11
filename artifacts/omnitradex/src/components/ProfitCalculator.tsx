import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useLang } from '../context/LangContext';

const ENTRY_PRICE = 117;
const PERFORMANCE_FEE_RATE = 0.17;
const MIN_SHARES = 87;

function fmtEur(n: number) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const SCENARIOS = [
  { exit: 200, grossProfit: 7221.0, fee: 1227.57, netProfit: 5993.43, total: 16172.43 },
  { exit: 300, grossProfit: 15921.0, fee: 2706.57, netProfit: 13214.43, total: 23393.43 },
  { exit: 400, grossProfit: 24621.0, fee: 4185.57, netProfit: 20435.43, total: 30614.43 },
];

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  accent?: boolean;
}

function ResultRow({ label, value, highlight, positive, accent }: ResultRowProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${highlight ? 'border-t border-slate-700/50 mt-1' : ''}`}>
      <span className={`text-sm font-medium ${highlight ? 'text-slate-200 font-semibold' : 'text-slate-500'}`}>{label}</span>
      <span className={`text-sm font-bold tabular-nums ${
        highlight ? 'text-white text-base' :
        positive ? 'text-emerald-400' :
        accent ? 'text-cyan-400' :
        'text-slate-300'
      }`}>{value}</span>
    </div>
  );
}

export default function ProfitCalculator() {
  const [shares, setShares] = useState(87);
  const [sharesInput, setSharesInput] = useState('87');
  const [exitPrice, setExitPrice] = useState(300);
  const { t } = useLang();

  const totalCapital = shares * ENTRY_PRICE;
  const grossPayout = shares * exitPrice;
  const grossProfit = grossPayout - totalCapital;
  const fee = grossProfit > 0 ? grossProfit * PERFORMANCE_FEE_RATE : 0;
  const netProfit = grossProfit - fee;
  const totalDisbursed = totalCapital + netProfit;

  function handleSharesChange(val: string) {
    setSharesInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= MIN_SHARES) {
      setShares(n);
    } else if (!isNaN(n) && n > 0) {
      setShares(n);
    }
  }

  function handleSharesBlur() {
    const n = parseInt(sharesInput, 10);
    if (isNaN(n) || n < MIN_SHARES) {
      setShares(MIN_SHARES);
      setSharesInput(String(MIN_SHARES));
    }
  }

  return (
    <section id="calculator" className="py-20 bg-[#000] bg-tech-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
            {t.calculator.section_label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Input Panel */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Calculator className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-white font-bold text-lg">{t.calculator.parameters}</h3>
            </div>

            {/* Shares input */}
            <div className="mb-8">
              <label className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-semibold">{t.calculator.lbl_shares}</span>
                <span className="text-xs text-slate-600 font-medium">{t.calculator.lbl_min}</span>
              </label>
              <input
                type="number"
                min={MIN_SHARES}
                value={sharesInput}
                onChange={(e) => handleSharesChange(e.target.value)}
                onBlur={handleSharesBlur}
                className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none transition-colors tabular-nums"
              />
            </div>

            {/* Exit price slider */}
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-semibold">{t.calculator.lbl_exit_price}</span>
                <span className="text-cyan-400 font-bold tabular-nums">{'\u20AC'}{exitPrice}</span>
              </label>
              <input
                type="range"
                min={117}
                max={600}
                step={1}
                value={exitPrice}
                onChange={(e) => setExitPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between mt-1.5 text-xs text-slate-600">
                <span>{'\u20AC'}117</span>
                <span>{t.calculator.lbl_target}</span>
                <span>{'\u20AC'}600</span>
              </div>
            </div>

            {/* Entry price note */}
            <div className="mt-6 px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-800/50 text-xs text-slate-500 flex items-center gap-2">
              <span className="text-slate-600">{t.calculator.entry_fixed}</span>
              <span className="text-slate-300 font-bold">{t.calculator.per_share}</span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-white font-bold text-lg mb-6">{t.calculator.results_title}</h3>
            <div className="divide-y divide-slate-800/50">
              <ResultRow label={t.calculator.total_capital} value={fmtEur(totalCapital)} />
              <ResultRow label={t.calculator.gross_payout} value={fmtEur(grossPayout)} />
              <ResultRow label={t.calculator.gross_profit} value={fmtEur(grossProfit)} positive={grossProfit > 0} />
              <ResultRow label={t.calculator.performance_fee} value={fmtEur(fee)} />
              <ResultRow label={t.calculator.net_profit} value={fmtEur(netProfit)} positive={netProfit > 0} />
              <ResultRow
                label={t.calculator.total_disbursed}
                value={fmtEur(totalDisbursed)}
                highlight
                accent
              />
            </div>

            {netProfit > 0 && (
              <div className="mt-6 px-4 py-3 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-xs text-emerald-400 font-semibold text-center">
                {t.calculator.projected_return} +{((netProfit / totalCapital) * 100).toFixed(1)}% {t.calculator.on_capital}
              </div>
            )}
          </div>
        </div>

        {/* Scenario Matrix */}
        <div>
          <h3 className="text-slate-300 font-bold text-lg mb-5">{t.calculator.scenario_title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.calculator.col_exit}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.calculator.col_gross}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.calculator.col_fee}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.calculator.col_net}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.calculator.col_disbursed}</th>
                </tr>
              </thead>
              <tbody>
                {SCENARIOS.map((s, i) => (
                  <tr
                    key={s.exit}
                    className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/20 ${
                      i === 1 ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{'\u20AC'}{s.exit} / share</span>
                        {i === 1 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/20">
                            {t.calculator.target_badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-semibold tabular-nums">{fmtEur(s.grossProfit)}</td>
                    <td className="py-4 px-4 text-right text-slate-400 tabular-nums">{fmtEur(s.fee)}</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-bold tabular-nums">{fmtEur(s.netProfit)}</td>
                    <td className="py-4 px-4 text-right text-white font-black tabular-nums">{fmtEur(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
