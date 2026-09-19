import { useState } from 'react';
import { BrainCircuit, TrendingUp, Target, GitBranch, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardHeader, Badge, StatCard, LineChart, BarChart, ProgressBar, DonutChart } from '@/components/ui';
import { MODELS, makeSeries } from '@/lib/data';

export function MlView() {
  const [selected, setSelected] = useState(MODELS[0]);
  const forecastData = makeSeries(88, 12, 320, 80);
  const clusterData = makeSeries(123, 20, 50, 30);
  const anomalyData = makeSeries(222, 20, 15, 25);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Machine Learning Engine</h1>
        <p className="text-sm text-slate-500 mt-1">Model metrics, anomaly detection, and time-series forecasting</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Models" value={MODELS.length} icon={BrainCircuit} color="cyan" />
        <StatCard label="Avg Accuracy" value="87.7" unit="%" delta={2.1} icon={Target} color="green" />
        <StatCard label="Anomalies Today" value="142" delta={8.7} icon={AlertTriangle} color="red" />
        <StatCard label="Predictions / hr" value="12.4K" delta={5.3} icon={Activity} color="blue" />
      </div>

      {/* Forecasting */}
      <Card>
        <CardHeader title="Time-Series Forecasting" subtitle="ARIMA + XGBoost ensemble — 12 month projection" icon={TrendingUp}
          action={<Badge color="cyan">94.2% accuracy</Badge>}
        />
        <div className="px-5 pb-5">
          <LineChart data={forecastData} color="#22d3ee" height={220} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Anomaly detection */}
        <Card>
          <CardHeader title="Anomaly Detection" subtitle="Isolation Forest — sensor data stream" icon={AlertTriangle} />
          <div className="px-5 pb-5">
            <LineChart data={anomalyData} color="#ef4444" height={180} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Detected</p>
                <p className="text-lg font-bold text-red-400">12</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Threshold</p>
                <p className="text-lg font-bold text-amber-400">3.2σ</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">False Positive</p>
                <p className="text-lg font-bold text-slate-300">2.1%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Clustering */}
        <Card>
          <CardHeader title="Anomaly Clusters" subtitle="K-Means — unsupervised grouping" icon={GitBranch} />
          <div className="px-5 pb-5">
            <DonutChart data={[
              { label: 'Cluster A (normal)', value: 68, color: '#22d3ee' },
              { label: 'Cluster B (minor)', value: 22, color: '#f59e0b' },
              { label: 'Cluster C (critical)', value: 10, color: '#ef4444' },
            ]} />
          </div>
        </Card>
      </div>

      {/* Model details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Model selector */}
        <Card className="lg:col-span-1">
          <CardHeader title="Models" subtitle="Select to inspect" icon={BrainCircuit} />
          <div className="divide-y divide-slate-800/50">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className={`flex items-center gap-3 w-full px-5 py-3 text-left transition-colors ${selected.id === m.id ? 'bg-cyan-500/10' : 'hover:bg-slate-800/20'}`}
              >
                <div className={`h-2 w-2 rounded-full ${m.status === 'production' ? 'bg-emerald-400' : m.status === 'staging' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.algorithm} · {m.version}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Model detail */}
        <Card className="lg:col-span-2">
          <CardHeader title={selected.name} subtitle={`${selected.algorithm} · ${selected.type} · ${selected.version}`} icon={Target}
            action={<Badge color={selected.status === 'production' ? 'green' : selected.status === 'staging' ? 'yellow' : 'blue'}>{selected.status}</Badge>}
          />
          <div className="px-5 pb-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="aura-glass rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Accuracy</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{(selected.accuracy * 100).toFixed(1)}%</p>
                <ProgressBar value={selected.accuracy * 100} color="green" />
              </div>
              <div className="aura-glass rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">F1 Score</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{(selected.f1 * 100).toFixed(1)}%</p>
                <ProgressBar value={selected.f1 * 100} color="cyan" />
              </div>
              <div className="aura-glass rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Precision</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{((selected.f1 + 0.04) * 100).toFixed(1)}%</p>
                <ProgressBar value={(selected.f1 + 0.04) * 100} color="blue" />
              </div>
              <div className="aura-glass rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Recall</p>
                <p className="text-xl font-bold text-slate-100 mt-1">{((selected.f1 - 0.02) * 100).toFixed(1)}%</p>
                <ProgressBar value={(selected.f1 - 0.02) * 100} color="purple" />
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Feature Importance (Top 8)</p>
              <BarChart horizontal data={[
                { label: 'revenue_t-1', value: 87 },
                { label: 'customer_count', value: 72 },
                { label: 'marketing_spend', value: 64 },
                { label: 'seasonality', value: 51 },
                { label: 'competitor_idx', value: 43 },
                { label: 'avg_order_val', value: 36 },
                { label: 'region_score', value: 28 },
                { label: 'support_tickets', value: 19 },
              ]} />
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Training Loss Curve</p>
              <LineChart data={makeSeries(selected.id.charCodeAt(0) * 5, 20, 50, 40)} color="#a78bfa" height={120} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
