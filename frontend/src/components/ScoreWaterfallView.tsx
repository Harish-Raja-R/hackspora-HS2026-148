import React from 'react';
import { BarChart3, Cpu } from 'lucide-react';
import { ScoreWaterfallDriver } from '../types/investigation';

interface ScoreWaterfallViewProps {
  drivers?: ScoreWaterfallDriver[];
  finalScore: number;
}

export const ScoreWaterfallView: React.FC<ScoreWaterfallViewProps> = ({ drivers, finalScore }) => {
  if (!drivers || drivers.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50 uppercase">
                SCORING TRANSPARENCY
              </span>
              <span className="text-xs font-mono text-slate-400">
                Calibrated Deterministic Waterfall
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white font-['Outfit'] mt-0.5">
              What Drives The Score?
            </h3>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          Normalized Score: <strong className="text-white text-sm">{finalScore}/100</strong>
        </div>
      </div>

      {/* Itemized Drivers List */}
      <div className="space-y-2">
        {drivers.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
          >
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 font-bold">#{i + 1}</span>
              <span className="text-slate-200">{d.name}</span>
              <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-950">
                {d.category}
              </span>
            </div>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                d.delta > 0
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
              }`}
            >
              {d.delta > 0 ? `+${d.delta}` : d.delta} pts
            </span>
          </div>
        ))}
      </div>

      {/* Architecture Pipeline Transparency (Section 11) */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>HOW SCAMCHECK REACHED THIS ASSESSMENT:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono pt-1">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-cyan-300 font-bold">1. AI/NLP</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Entity & Context Extraction</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-blue-300 font-bold">2. Rules Engine</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Deterministic Signal Matching</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-purple-300 font-bold">3. Evidence Layer</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verbatim Quote Grounding</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-amber-300 font-bold">4. Confidence</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Completeness & Uncertainty</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-emerald-300 font-bold">5. Synthesis</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Actionable Playbook Directive</div>
          </div>
        </div>
      </div>
    </div>
  );
};
