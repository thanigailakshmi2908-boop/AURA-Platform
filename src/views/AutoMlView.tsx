import { useState } from 'react';
import { Cpu, FlaskConical, Rocket, CheckCircle2, GitCommit, Trophy, Clock } from 'lucide-react';
import { Card, CardHeader, Badge, Button, ProgressBar, StatCard } from '@/components/ui';
import { MODELS } from '@/lib/data';

export function AutoMlView() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runExperiment = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setRunning(false); return 100; }
        return p + 5;
      });
    }, 200);
  };

  const experiments = [
    { id: 'exp_091', model: 'XGBoost', params: 'lr=0.01, depth=8', score: 0.942, time: '14m 22s', status: 'best' },
    { id: 'exp_090', model: 'LightGBM', params: 'lr=0.05, leaves=64', score: 0.931, time: '8m 15s', status: 'completed' },
    { id: 'exp_089', model: 'Random Forest', params: 'trees=500, depth=12', score: 0.918, time: '22m 04s', status: 'completed' },
    { id: 'exp_088', model: 'CatBoost', params: 'lr=0.03, depth=10', score: 0.927, time: '18m 41s', status: 'completed' },
    { id: 'exp_087', model: 'Neural Net', params: 'layers=[128,64,32]', score: 0.912, time: '45m 12s', status: 'completed' },
    { id: 'exp_086', model: 'Gradient Boost', params: 'lr=0.1, estimators=200', score: 0.905, time: '12m 33s', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">AutoML & Model Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Experiment tracking, versioning, and deployment management</p>
        </div>
        <Button onClick={runExperiment} icon={FlaskConical} disabled={running}>
          {running ? `Running... ${progress}%` : 'New AutoML Run'}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Experiments" value="247" delta={12} icon={FlaskConical} color="cyan" />
        <StatCard label="Best Accuracy" value="94.2%" delta={2.1} icon={Trophy} color="green" />
        <StatCard label="Deployed Models" value={MODELS.filter(m => m.status === 'production').length} icon={Rocket} color="blue" />
        <StatCard label="Avg Run Time" value="18m" icon={Clock} color="purple" />
      </div>

      {/* Running experiment */}
      {running && (
        <Card className="p-5 border-cyan-500/30 aura-pulse-glow">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent aura-spin" />
            <span className="text-sm font-semibold text-slate-200">AutoML Experiment Running</span>
            <Badge color="cyan" size="sm">exploring 24 configs</Badge>
          </div>
          <ProgressBar value={progress} color="cyan" animated />
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>Stage: {progress < 30 ? 'Preprocessing' : progress < 60 ? 'Model Search' : progress < 90 ? 'Hyperparameter Tuning' : 'Evaluation'}</span>
            <span>Trials: {Math.floor(progress / 5)}/20</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experiment tracking */}
        <Card>
          <CardHeader title="Experiment Tracking" subtitle="Recent AutoML trials ranked by score" icon={FlaskConical} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th className="text-left font-medium px-5 py-2">ID</th>
                  <th className="text-left font-medium px-5 py-2">Model</th>
                  <th className="text-left font-medium px-5 py-2">Score</th>
                  <th className="text-left font-medium px-5 py-2">Time</th>
                  <th className="text-left font-medium px-5 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {experiments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-2.5 text-slate-500 font-mono text-xs">{e.id}</td>
                    <td className="px-5 py-2.5 text-slate-200">{e.model}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">{(e.score * 100).toFixed(1)}%</span>
                        {e.status === 'best' && <Trophy size={12} className="text-amber-400" />}
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-slate-500 text-xs">{e.time}</td>
                    <td className="px-5 py-2.5">
                      <Badge color={e.status === 'best' ? 'yellow' : 'green'} size="sm">{e.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Model registry */}
        <Card>
          <CardHeader title="Model Registry" subtitle="Versioned models with deployment states" icon={Cpu} />
          <div className="divide-y divide-slate-800/50">
            {MODELS.map((m) => (
              <div key={m.id} className="px-5 py-3 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GitCommit size={14} className="text-slate-500" />
                    <span className="text-sm text-slate-200">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color="slate" size="sm">{m.version}</Badge>
                    <Badge color={m.status === 'production' ? 'green' : m.status === 'staging' ? 'yellow' : 'blue'} size="sm">{m.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span>{m.algorithm}</span>
                  <span>Acc: {(m.accuracy * 100).toFixed(1)}%</span>
                  <span>F1: {(m.f1 * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Deployment pipeline */}
      <Card>
        <CardHeader title="Deployment Pipeline" subtitle="CI/CD for ML models" icon={Rocket} />
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Train', 'Validate', 'Stage', 'A/B Test', 'Deploy', 'Monitor'].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${i < 4 ? 'bg-emerald-500/10 text-emerald-400' : i === 4 ? 'bg-cyan-500/10 text-cyan-400 aura-pulse-glow' : 'aura-glass text-slate-500'}`}>
                  {i < 4 ? <CheckCircle2 size={14} /> : i === 4 ? <div className="h-3.5 w-3.5 rounded-full border-2 border-cyan-400 border-t-transparent aura-spin" /> : <div className="h-2 w-2 rounded-full bg-slate-600" />}
                  <span className="text-xs font-medium">{stage}</span>
                </div>
                {i < 5 && <span className="text-slate-700">→</span>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
