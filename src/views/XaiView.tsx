import { useState } from 'react';
import { GitBranch, Eye, TrendingUp, Info } from 'lucide-react';
import { Card, CardHeader, Badge, BarChart, ProgressBar, Button } from '@/components/ui';

export function XaiView() {
  const [sample, setSample] = useState(0);

  const samples = [
    { id: 'pred_4821', input: 'Customer #28471 — churn risk', prediction: 'HIGH (0.87)', features: [
      { name: 'login_frequency', contribution: 0.28, direction: '+' },
      { name: 'support_tickets', contribution: 0.22, direction: '+' },
      { name: 'contract_age', contribution: 0.18, direction: '+' },
      { name: 'monthly_spend', contribution: -0.12, direction: '-' },
      { name: 'feature_adoption', contribution: 0.15, direction: '+' },
      { name: 'billing_disputes', contribution: 0.11, direction: '+' },
      { name: 'region_score', contribution: -0.06, direction: '-' },
      { name: 'tenure_months', contribution: -0.04, direction: '-' },
    ]},
    { id: 'pred_4822', input: 'Transaction #91823 — fraud risk', prediction: 'MEDIUM (0.54)', features: [
      { name: 'amount_zscore', contribution: 0.31, direction: '+' },
      { name: 'geo_distance', contribution: 0.24, direction: '+' },
      { name: 'velocity_1h', contribution: 0.19, direction: '+' },
      { name: 'merchant_risk', contribution: 0.12, direction: '+' },
      { name: 'device_trust', contribution: -0.18, direction: '-' },
      { name: 'time_of_day', contribution: 0.08, direction: '+' },
      { name: 'card_age', contribution: -0.10, direction: '-' },
      { name: 'avg_transaction', contribution: -0.05, direction: '-' },
    ]},
    { id: 'pred_4823', input: 'Machine #14 — failure risk', prediction: 'LOW (0.18)', features: [
      { name: 'vibration_level', contribution: 0.15, direction: '+' },
      { name: 'temperature', contribution: 0.08, direction: '+' },
      { name: 'operating_hours', contribution: 0.12, direction: '+' },
      { name: 'maintenance_age', contribution: 0.06, direction: '+' },
      { name: 'load_capacity', contribution: -0.14, direction: '-' },
      { name: 'oil_quality', contribution: -0.09, direction: '-' },
      { name: 'error_rate', contribution: 0.04, direction: '+' },
      { name: 'calibration', contribution: -0.02, direction: '-' },
    ]},
  ];

  const current = samples[sample];
  const maxContribution = Math.max(...current.features.map(f => Math.abs(f.contribution)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Explainable AI (XAI)</h1>
        <p className="text-sm text-slate-500 mt-1">SHAP-style feature importance and factor contribution breakdowns</p>
      </div>

      {/* Sample selector */}
      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 mr-2"><Eye size={14} /> Prediction Samples:</div>
          {samples.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSample(i)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${sample === i ? 'bg-cyan-500/20 text-cyan-400' : 'aura-glass text-slate-400 hover:text-slate-200'}`}
            >
              {s.input}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction summary */}
        <Card className="lg:col-span-1">
          <CardHeader title="Prediction" subtitle={current.id} icon={TrendingUp} />
          <div className="px-5 pb-5 space-y-4">
            <div className="text-center py-4">
              <p className="text-xs text-slate-500 mb-2">{current.input}</p>
              <p className={`text-3xl font-bold ${current.prediction.includes('HIGH') ? 'text-red-400' : current.prediction.includes('MEDIUM') ? 'text-amber-400' : 'text-emerald-400'}`}>
                {current.prediction}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-slate-300">{current.prediction.match(/[\d.]+/)?.[0] ? (parseFloat(current.prediction.match(/[\d.]+/)?.[0] || '0') * 100).toFixed(0) : 0}%</span>
                </div>
                <ProgressBar value={parseFloat(current.prediction.match(/[\d.]+/)?.[0] || '0') * 100} color={current.prediction.includes('HIGH') ? 'red' : current.prediction.includes('MEDIUM') ? 'yellow' : 'green'} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Model Agreement</span>
                  <span className="text-slate-300">92%</span>
                </div>
                <ProgressBar value={92} color="cyan" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Data Quality</span>
                  <span className="text-slate-300">97%</span>
                </div>
                <ProgressBar value={97} color="blue" />
              </div>
            </div>
          </div>
        </Card>

        {/* SHAP feature importance */}
        <Card className="lg:col-span-2">
          <CardHeader title="SHAP Feature Importance" subtitle="Contribution to prediction (positive increases risk)" icon={GitBranch}
            action={<Badge color="cyan" size="sm">SHAP v0.44</Badge>}
          />
          <div className="px-5 pb-5 space-y-2">
            {current.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-36 truncate shrink-0">{f.name}</span>
                <div className="flex-1 flex items-center">
                  <div className="flex-1 flex justify-end">
                    {f.direction === '-' && (
                      <div className="h-5 rounded-l bg-gradient-to-l from-blue-500/60 to-blue-500/30 aura-bar-grow flex items-center justify-start pl-2" style={{ width: `${(Math.abs(f.contribution) / maxContribution) * 50}%`, animationDelay: `${i * 0.06}s` }}>
                        <span className="text-[10px] text-white">{f.contribution.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="w-px h-6 bg-slate-700 mx-1" />
                  <div className="flex-1">
                    {f.direction === '+' && (
                      <div className="h-5 rounded-r bg-gradient-to-r from-red-500/60 to-red-500/30 aura-bar-grow flex items-center justify-end pr-2" style={{ width: `${(Math.abs(f.contribution) / maxContribution) * 50}%`, animationDelay: `${i * 0.06}s` }}>
                        <span className="text-[10px] text-white">+{f.contribution.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-3 mt-3 border-t border-slate-800 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-red-500/60" /> Increases risk</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded bg-blue-500/60" /> Decreases risk</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Global importance */}
      <Card>
        <CardHeader title="Global Feature Importance" subtitle="Aggregate across all predictions" icon={Info} />
        <div className="px-5 pb-5">
          <BarChart horizontal data={[
            { label: 'revenue_t-1', value: 87 },
            { label: 'login_frequency', value: 79 },
            { label: 'amount_zscore', value: 72 },
            { label: 'support_tickets', value: 64 },
            { label: 'contract_age', value: 58 },
            { label: 'geo_distance', value: 51 },
            { label: 'marketing_spend', value: 44 },
            { label: 'device_trust', value: 38 },
            { label: 'seasonality', value: 31 },
            { label: 'region_score', value: 24 },
          ]} />
        </div>
      </Card>
    </div>
  );
}
