import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, Zap, Activity, Gauge, DollarSign, Filter } from 'lucide-react';
import { Card, CardHeader, Badge, StatCard, LineChart, BarChart, Sparkline } from '@/components/ui';
import { ALERTS, makeSeries } from '@/lib/data';

export function AlertsView() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filtered = filter === 'all' ? ALERTS : ALERTS.filter(a => a.severity === filter);

  const apiLatency = makeSeries(333, 20, 120, 60);
  const tokenCost = makeSeries(444, 20, 180, 80);
  const eventFeed = makeSeries(555, 15, 25, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Intelligent Alerts & Observability</h1>
        <p className="text-sm text-slate-500 mt-1">Live system events, API monitoring, and token cost analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Alerts" value={ALERTS.length} delta={3} icon={Bell} color="red" />
        <StatCard label="API P95 Latency" value="180ms" delta={-5.2} icon={Gauge} color="cyan" />
        <StatCard label="Daily Token Cost" value="$42.80" delta={15.1} icon={DollarSign} color="yellow" />
        <StatCard label="Uptime" value="99.97" unit="%" delta={0.01} icon={Activity} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="API Latency Monitor" subtitle="P50 / P95 / P99 (ms)" icon={Gauge} />
          <div className="px-5 pb-5">
            <LineChart data={apiLatency} color="#22d3ee" height={180} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Token Cost Analyzer" subtitle="Hourly spend ($)" icon={DollarSign}
            action={<Badge color="yellow" size="sm">trending up</Badge>}
          />
          <div className="px-5 pb-5">
            <LineChart data={tokenCost} color="#f59e0b" height={180} />
          </div>
        </Card>
      </div>

      {/* Event feed */}
      <Card>
        <CardHeader title="Live System Event Feed" subtitle="Real-time events (events/min)" icon={Activity} />
        <div className="px-5 pb-5">
          <LineChart data={eventFeed} color="#10b981" height={140} />
        </div>
      </Card>

      {/* Alerts feed */}
      <Card>
        <CardHeader title="Alerts" subtitle={`${filtered.length} alerts`} icon={Bell}
          action={
            <div className="flex items-center gap-1">
              {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-all ${filter === f ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        />
        <div className="divide-y divide-slate-800/50">
          {filtered.map((a) => {
            const Icon = a.severity === 'critical' ? AlertTriangle : a.severity === 'warning' ? AlertTriangle : Info;
            return (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                  a.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                  a.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-200">{a.title}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{a.source} · {a.time}</div>
                </div>
                <Badge color={a.severity === 'critical' ? 'red' : a.severity === 'warning' ? 'yellow' : 'blue'} size="sm">{a.severity}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Token cost breakdown */}
      <Card>
        <CardHeader title="Token Cost by Agent" subtitle="Last 24 hours" icon={Zap} />
        <div className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { agent: 'Orchestrator', tokens: 420, cost: 8.40, color: '#22d3ee' },
              { agent: 'Data Agent', tokens: 310, cost: 6.20, color: '#3b82f6' },
              { agent: 'Analytics', tokens: 280, cost: 5.60, color: '#a78bfa' },
              { agent: 'ML Agent', tokens: 190, cost: 3.80, color: '#10b981' },
              { agent: 'Research Agent', tokens: 160, cost: 3.20, color: '#f59e0b' },
              { agent: 'Report Agent', tokens: 120, cost: 2.40, color: '#ec4899' },
            ].map((a) => (
              <div key={a.agent} className="aura-glass rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">{a.agent}</span>
                  <Sparkline data={[20, 35, 30, 45, 40, 55, 50, a.tokens / 10]} color={a.color} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{a.tokens}K tokens</span>
                  <span className="text-slate-300 font-semibold">${a.cost}</span>
                </div>
              </div>
            ))}
          </div>
          <BarChart data={[
            { label: 'Orch', value: 420 }, { label: 'Data', value: 310 }, { label: 'Analyt', value: 280 },
            { label: 'ML', value: 190 }, { label: 'Research', value: 160 }, { label: 'Report', value: 120 },
            { label: 'Viz', value: 90 }, { label: 'Monitor', value: 70 }, { label: 'Security', value: 60 },
          ]} height={140} />
        </div>
      </Card>
    </div>
  );
}
