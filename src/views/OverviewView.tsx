import { useState } from 'react';
import {
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, Cpu, Gauge,
  Activity, ShieldCheck, Zap, Brain, ArrowUpRight, Eye, Code,
} from 'lucide-react';
import { Card, CardHeader, StatCard, LineChart, BarChart, DonutChart, Badge, ProgressBar, AnimatedCounter, Toggle } from '@/components/ui';
import { makeSeries, ALERTS, MODELS, PIPELINES } from '@/lib/data';
import { type IndustryKey, INDUSTRIES } from '@/lib/data';

export function OverviewView({ industry }: { industry: IndustryKey }) {
  const [mode, setMode] = useState<'executive' | 'technical'>('executive');
  const ind = INDUSTRIES.find((i) => i.key === industry)!;

  const revenueData = makeSeries(industry.charCodeAt(0) * 7, 12, 240, 80);
  const riskData = makeSeries(industry.charCodeAt(0) * 13, 8, 45, 30);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">{ind.label} — real-time intelligence dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 aura-glass rounded-lg p-1">
            <button
              onClick={() => setMode('executive')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${mode === 'executive' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Eye size={14} /> Executive
            </button>
            <button
              onClick={() => setMode('technical')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${mode === 'technical' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Code size={14} /> Technical
            </button>
          </div>
        </div>
      </div>

      {mode === 'executive' ? <ExecutiveMode industry={industry} revenueData={revenueData} riskData={riskData} /> : <TechnicalMode industry={industry} />}
    </div>
  );
}

function ExecutiveMode({ industry, revenueData, riskData }: { industry: IndustryKey; revenueData: any[]; riskData: any[] }) {
  return (
    <div className="space-y-6 aura-slide-up">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="$2.41M" delta={12.4} icon={DollarSign} color="cyan" />
        <StatCard label="Risk Score" value="38" unit="/100" delta={-5.2} icon={AlertTriangle} color="yellow" />
        <StatCard label="Anomalies Detected" value="142" delta={8.7} icon={Activity} color="red" />
        <StatCard label="Model Accuracy" value="94.2" unit="%" delta={2.1} icon={Brain} color="green" />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue Trend" subtitle="Monthly performance with predictive outlook" icon={TrendingUp}
            action={<Badge color="cyan"><ArrowUpRight size={10} /> +12.4%</Badge>}
          />
          <div className="px-5 pb-5">
            <LineChart data={revenueData} color="#22d3ee" height={200} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Risk Distribution" subtitle="By category" icon={ShieldCheck} />
          <div className="px-5 pb-5">
            <DonutChart data={[
              { label: 'Operational', value: 42, color: '#22d3ee' },
              { label: 'Financial', value: 28, color: '#3b82f6' },
              { label: 'Compliance', value: 18, color: '#f59e0b' },
              { label: 'Security', value: 12, color: '#ef4444' },
            ]} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Risk Trend" subtitle="8-week rolling average" icon={TrendingDown} />
          <div className="px-5 pb-5">
            <LineChart data={riskData} color="#f59e0b" height={180} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Anomalies" subtitle="By impact score" icon={AlertTriangle} />
          <div className="px-5 pb-5">
            <BarChart
              horizontal
              data={[
                { label: 'Revenue dip', value: 87 },
                { label: 'Churn spike', value: 72 },
                { label: 'Latency', value: 61 },
                { label: 'Drift alert', value: 54 },
                { label: 'PII risk', value: 38 },
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Recent alerts */}
      <Card>
        <CardHeader title="Recent Alerts" subtitle="Latest system events" icon={Activity} />
        <div className="divide-y divide-slate-800/50">
          {ALERTS.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
              <div className={`h-2 w-2 rounded-full ${a.severity === 'critical' ? 'bg-red-400' : a.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
              <span className="text-sm text-slate-300 flex-1">{a.title}</span>
              <Badge color={a.severity === 'critical' ? 'red' : a.severity === 'warning' ? 'yellow' : 'blue'} size="sm">{a.source}</Badge>
              <span className="text-xs text-slate-600">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TechnicalMode({ industry }: { industry: IndustryKey }) {
  const latencyData = makeSeries(industry.charCodeAt(0) * 17, 20, 120, 60);
  return (
    <div className="space-y-6 aura-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="API Latency" value="42" unit="ms" delta={-8.3} icon={Gauge} color="cyan" />
        <StatCard label="Token Usage" value="1.2M" delta={15.2} icon={Zap} color="blue" />
        <StatCard label="Pipeline Throughput" value="74.3K/s" delta={4.1} icon={Cpu} color="green" />
        <StatCard label="Error Rate" value="0.04" unit="%" delta={-1.2} icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="API Latency" subtitle="Last 20 minutes (ms)" icon={Gauge} />
          <div className="px-5 pb-5">
            <LineChart data={latencyData} color="#22d3ee" height={180} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Pipeline Health" subtitle="Live stream status" icon={Activity} />
          <div className="px-5 pb-5 space-y-3">
            {PIPELINES.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${p.health === 'healthy' ? 'bg-emerald-400' : p.health === 'degraded' ? 'bg-amber-400' : 'bg-red-400'}`} />
                <span className="text-sm text-slate-300 flex-1 truncate">{p.name}</span>
                <span className="text-xs text-slate-500">{p.throughput}</span>
                <Badge color={p.health === 'healthy' ? 'green' : p.health === 'degraded' ? 'yellow' : 'red'} size="sm">{p.health}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Developer Logs" subtitle="Real-time system output" icon={Code} />
        <div className="px-5 pb-5">
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
            {[
              { t: '09:42:11', lvl: 'INFO', msg: 'Orchestrator agent initialized workflow #4821' },
              { t: '09:42:12', lvl: 'INFO', msg: 'Data Agent: querying sales_events stream (Kafka)' },
              { t: '09:42:14', lvl: 'INFO', msg: 'Analytics Agent: computed rolling avg over 8.2M records' },
              { t: '09:42:16', lvl: 'INFO', msg: 'ML Agent: loaded model sales-forecast v3.2.1' },
              { t: '09:42:18', lvl: 'WARN', msg: 'Monitoring Agent: drift score 0.12 (threshold 0.10)' },
              { t: '09:42:19', lvl: 'INFO', msg: 'Research Agent: RAG retrieval — 5 chunks, confidence 0.94' },
              { t: '09:42:21', lvl: 'INFO', msg: 'Security Agent: scanned input — no PII detected' },
              { t: '09:42:22', lvl: 'INFO', msg: 'Viz Agent: generated line chart (revenue trend)' },
              { t: '09:42:24', lvl: 'INFO', msg: 'Report Agent: synthesized root-cause breakdown' },
              { t: '09:42:25', lvl: 'INFO', msg: 'Workflow #4821 completed in 14.2s' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-slate-600">{log.t}</span>
                <span className={log.lvl === 'WARN' ? 'text-amber-400' : log.lvl === 'ERROR' ? 'text-red-400' : 'text-cyan-400'}>[{log.lvl}]</span>
                <span className="text-slate-400">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Model Performance" subtitle="Production models" icon={Brain} />
          <div className="px-5 pb-5 space-y-3">
            {MODELS.filter(m => m.status === 'production').map((m) => (
              <div key={m.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300">{m.name}</span>
                  <span className="text-xs text-slate-500">{(m.accuracy * 100).toFixed(1)}%</span>
                </div>
                <ProgressBar value={m.accuracy * 100} color="green" />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Token Usage by Agent" subtitle="Last 24h" icon={Zap} />
          <div className="px-5 pb-5">
            <BarChart data={[
              { label: 'Orchestrator', value: 420 },
              { label: 'Data', value: 310 },
              { label: 'Analytics', value: 280 },
              { label: 'ML', value: 190 },
              { label: 'Research', value: 160 },
              { label: 'Report', value: 120 },
            ]} height={160} />
          </div>
        </Card>
      </div>
    </div>
  );
}
