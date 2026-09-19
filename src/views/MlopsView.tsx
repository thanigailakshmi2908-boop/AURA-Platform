import { Activity, Gauge, TrendingDown, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';
import { Card, CardHeader, Badge, StatCard, LineChart, ProgressBar, Button } from '@/components/ui';
import { makeSeries } from '@/lib/data';

export function MlopsView() {
  const driftData = makeSeries(111, 20, 45, 25);
  const latencyData = makeSeries(222, 20, 120, 60);
  const errorData = makeSeries(333, 20, 8, 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">MLOps & Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Data drift, model drift, latency, and automated retraining pipelines</p>
        </div>
        <Button variant="outline" icon={RefreshCw}>Trigger Retrain</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Data Drift" value="0.12" delta={18} icon={TrendingDown} color="yellow" />
        <StatCard label="Model Drift" value="0.08" delta={-4} icon={Activity} color="green" />
        <StatCard label="Avg Latency" value="42ms" delta={-8} icon={Gauge} color="cyan" />
        <StatCard label="Error Rate" value="0.04%" delta={-1.2} icon={AlertTriangle} color="red" />
      </div>

      {/* Drift graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Data Drift" subtitle="PSI score over time" icon={TrendingDown}
            action={<Badge color="yellow" size="sm">threshold: 0.10</Badge>}
          />
          <div className="px-5 pb-5">
            <LineChart data={driftData} color="#f59e0b" height={180} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Model Drift" subtitle="Performance degradation tracking" icon={Activity}
            action={<Badge color="green" size="sm">healthy</Badge>}
          />
          <div className="px-5 pb-5">
            <LineChart data={makeSeries(444, 20, 8, 6)} color="#10b981" height={180} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latency */}
        <Card className="lg:col-span-2">
          <CardHeader title="API Latency" subtitle="Inference response time (ms)" icon={Gauge} />
          <div className="px-5 pb-5">
            <LineChart data={latencyData} color="#22d3ee" height={180} />
          </div>
        </Card>

        {/* Error rate */}
        <Card>
          <CardHeader title="Error Rate" subtitle="Requests failing (%)" icon={AlertTriangle} />
          <div className="px-5 pb-5">
            <LineChart data={errorData} color="#ef4444" height={180} />
          </div>
        </Card>
      </div>

      {/* Drift meters */}
      <Card>
        <CardHeader title="Model Drift Meters" subtitle="Per-model degradation score" icon={Cpu} />
        <div className="px-5 pb-5 space-y-4">
          {[
            { name: 'Sales Forecast XGBoost v3.2.1', drift: 12, status: 'warning' },
            { name: 'Anomaly Detector IsolationForest v2.0.4', drift: 6, status: 'healthy' },
            { name: 'Churn Predictor LightGBM v1.4.0', drift: 18, status: 'warning' },
            { name: 'Demand ARIMA v1.1.2', drift: 4, status: 'healthy' },
            { name: 'Fraud Ensemble XGB+RF v0.9.0', drift: 22, status: 'critical' },
          ].map((m, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-300">{m.name}</span>
                <Badge color={m.status === 'healthy' ? 'green' : m.status === 'warning' ? 'yellow' : 'red'} size="sm">
                  {m.drift}% drift
                </Badge>
              </div>
              <ProgressBar value={m.drift * 4} color={m.status === 'healthy' ? 'green' : m.status === 'warning' ? 'yellow' : 'red'} animated={m.status === 'critical'} />
            </div>
          ))}
        </div>
      </Card>

      {/* Retraining pipeline */}
      <Card>
        <CardHeader title="Automated Retraining Pipeline" subtitle="Triggered when drift exceeds threshold" icon={RefreshCw} />
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Detect Drift', 'Collect Data', 'Validate', 'Retrain', 'Evaluate', 'Canary Deploy', 'Full Rollout'].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${i < 2 ? 'bg-emerald-500/10 text-emerald-400' : i === 2 ? 'bg-cyan-500/10 text-cyan-400 aura-pulse-glow' : 'aura-glass text-slate-500'}`}>
                  <div className={`h-2 w-2 rounded-full ${i < 2 ? 'bg-emerald-400' : i === 2 ? 'bg-cyan-400 aura-blink' : 'bg-slate-600'}`} />
                  <span className="text-xs">{stage}</span>
                </div>
                {i < 6 && <span className="text-slate-700">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Last Retrain</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">2h ago</p>
            </div>
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Next Scheduled</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">4h</p>
            </div>
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Retrains / week</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">14</p>
            </div>
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Success Rate</p>
              <p className="text-sm font-semibold text-emerald-400 mt-1">96.8%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
