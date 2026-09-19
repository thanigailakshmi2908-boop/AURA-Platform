import { useState } from 'react';
import { Database, Activity, AlertTriangle, Zap, Cpu, Gauge, RefreshCw } from 'lucide-react';
import { Card, CardHeader, Badge, StatCard, LineChart, ProgressBar, Button } from '@/components/ui';
import { PIPELINES, makeSeries } from '@/lib/data';

export function PipelinesView() {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const healthy = PIPELINES.filter(p => p.health === 'healthy').length;
  const degraded = PIPELINES.filter(p => p.health === 'degraded').length;
  const down = PIPELINES.filter(p => p.health === 'down').length;

  const throughputData = makeSeries(55, 20, 60, 30);
  const ingestionData = makeSeries(77, 20, 12, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Big Data & Pipelines</h1>
          <p className="text-sm text-slate-500 mt-1">PySpark / Kafka stream health, ingestion logs, and feature stores</p>
        </div>
        <Button variant="outline" onClick={refresh} icon={refreshing ? RefreshCw : RefreshCw} className={refreshing ? 'aura-spin' : ''}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Pipelines" value={PIPELINES.length} delta={0} icon={Database} color="cyan" />
        <StatCard label="Total Throughput" value="74.3K/s" delta={4.1} icon={Zap} color="green" />
        <StatCard label="Avg Latency" value="115ms" delta={-3.2} icon={Gauge} color="blue" />
        <StatCard label="Records Ingested" value="48.6M" delta={8.9} icon={Activity} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Stream Throughput" subtitle="Records/sec across all pipelines" icon={Zap} />
          <div className="px-5 pb-5">
            <LineChart data={throughputData} color="#22d3ee" height={180} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Ingestion Rate" subtitle="Millions of records / hour" icon={Database} />
          <div className="px-5 pb-5">
            <LineChart data={ingestionData} color="#10b981" height={180} />
          </div>
        </Card>
      </div>

      {/* Pipeline table */}
      <Card>
        <CardHeader title="Pipeline Status" subtitle="Live stream health monitor" icon={Activity}
          action={
            <div className="flex items-center gap-2 text-xs">
              <Badge color="green" size="sm">{healthy} healthy</Badge>
              <Badge color="yellow" size="sm">{degraded} degraded</Badge>
              <Badge color="red" size="sm">{down} down</Badge>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="text-left font-medium px-5 py-2">Pipeline</th>
                <th className="text-left font-medium px-5 py-2">Source</th>
                <th className="text-left font-medium px-5 py-2">Throughput</th>
                <th className="text-left font-medium px-5 py-2">Latency</th>
                <th className="text-left font-medium px-5 py-2">Records</th>
                <th className="text-left font-medium px-5 py-2">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {PIPELINES.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3 text-slate-200 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{p.source}</td>
                  <td className="px-5 py-3 text-slate-400">{p.throughput}</td>
                  <td className="px-5 py-3 text-slate-400">{p.latency}</td>
                  <td className="px-5 py-3 text-slate-400">{p.records}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${p.health === 'healthy' ? 'bg-emerald-400' : p.health === 'degraded' ? 'bg-amber-400' : 'bg-red-400'} ${p.health !== 'healthy' ? 'aura-blink' : ''}`} />
                      <Badge color={p.health === 'healthy' ? 'green' : p.health === 'degraded' ? 'yellow' : 'red'} size="sm">{p.health}</Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature store */}
      <Card>
        <CardHeader title="Feature Store" subtitle="Online & offline feature groups" icon={Cpu} />
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'customer_features', entities: '4.2M', freshness: '2m ago', status: 'fresh' },
            { name: 'transaction_agg', entities: '8.1M', freshness: '45s ago', status: 'fresh' },
            { name: 'iot_sensor_features', entities: '31M', freshness: '12m ago', status: 'stale' },
            { name: 'sales_daily_rollup', entities: '890K', freshness: '5m ago', status: 'fresh' },
            { name: 'inventory_features', entities: '120K', freshness: '1h ago', status: 'stale' },
            { name: 'risk_scores', entities: '2.1M', freshness: '3m ago', status: 'fresh' },
          ].map((f) => (
            <div key={f.name} className="aura-glass rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-300">{f.name}</span>
                <Badge color={f.status === 'fresh' ? 'green' : 'yellow'} size="sm">{f.status}</Badge>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{f.entities} entities</span>
                <span>Updated {f.freshness}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
