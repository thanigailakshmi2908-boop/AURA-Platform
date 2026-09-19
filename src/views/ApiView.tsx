import { useState } from 'react';
import { Code2, Copy, CheckCircle2, Terminal, Book, Zap, Webhook } from 'lucide-react';
import { Card, CardHeader, Badge, Button } from '@/components/ui';
import { API_ENDPOINTS } from '@/lib/data';

export function ApiView() {
  const [selected, setSelected] = useState(API_ENDPOINTS[0]);
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Developer API Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Endpoint documentation and integration examples</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400"><Zap size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-slate-200">API Version</p>
              <p className="text-xs text-slate-500">v1.4.2 · stable</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Uptime</p>
              <p className="text-xs text-slate-500">99.97% (30d)</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"><Terminal size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Rate Limit</p>
              <p className="text-xs text-slate-500">1000 req/min</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints list */}
        <Card className="lg:col-span-1">
          <CardHeader title="Endpoints" subtitle="REST API" icon={Code2} />
          <div className="divide-y divide-slate-800/50">
            {API_ENDPOINTS.map((ep) => (
              <button
                key={ep.path}
                onClick={() => setSelected(ep)}
                className={`flex items-center gap-3 w-full px-5 py-3 text-left transition-colors ${selected.path === ep.path ? 'bg-cyan-500/10' : 'hover:bg-slate-800/20'}`}
              >
                <Badge color={ep.method === 'GET' ? 'green' : ep.method === 'POST' ? 'cyan' : ep.method === 'PUT' ? 'yellow' : 'red'} size="sm">{ep.method}</Badge>
                <span className="text-xs font-mono text-slate-300">{ep.path}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Endpoint detail */}
        <Card className="lg:col-span-2">
          <CardHeader title={selected.path} subtitle={selected.description} icon={Book}
            action={<Badge color={selected.method === 'GET' ? 'green' : 'cyan'}>{selected.method}</Badge>}
          />
          <div className="px-5 pb-5 space-y-4">
            {/* Request sample */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Request Body</span>
                <button onClick={() => copyCode(selected.sample)} className="text-slate-500 hover:text-slate-300">
                  {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre>{JSON.stringify(JSON.parse(selected.sample), null, 2)}</pre>
              </div>
            </div>

            {/* cURL */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">cURL</span>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-slate-300"><span className="text-emerald-400">curl</span> -X <span className="text-cyan-400">{selected.method}</span> <span className="text-blue-400">https://api.aura.ai{selected.path}</span>{'\n'}  <span className="text-slate-500">-H</span> "Authorization: Bearer aura_sk_••••••••"{'\n'}  <span className="text-slate-500">-H</span> "Content-Type: application/json"{'\n'}  <span className="text-slate-500">-d</span> '{selected.sample}'</pre>
              </div>
            </div>

            {/* JS SDK */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">JavaScript SDK</span>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-slate-300"><span className="text-violet-400">import</span> {'{ AuraClient }'} <span className="text-violet-400">from</span> <span className="text-emerald-400">'@aura/sdk'</span>;{'\n\n'}<span className="text-violet-400">const</span> aura = <span className="text-violet-400">new</span> <span className="text-cyan-400">AuraClient</span>(<span className="text-emerald-400">'aura_sk_••••••••'</span>);{'\n\n'}<span className="text-violet-400">const</span> result = <span className="text-violet-400">await</span> aura.<span className="text-blue-400">{selected.path.split('/').pop()}</span>({selected.sample});</pre>
              </div>
            </div>

            {/* Response */}
            <div>
              <span className="text-xs font-semibold text-slate-400 mb-2 block">Response (200 OK)</span>
              <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-slate-300">{'{'}
  <span className="text-cyan-400">"status"</span>: <span className="text-emerald-400">"success"</span>,
  <span className="text-cyan-400">"data"</span>: {'{ ... }'},
  <span className="text-cyan-400">"agent_trace"</span>: [<span className="text-emerald-400">"orchestrator"</span>, <span className="text-emerald-400">"data"</span>, <span className="text-emerald-400">"analytics"</span>],
  <span className="text-cyan-400">"confidence"</span>: <span className="text-amber-400">0.94</span>,
  <span className="text-cyan-400">"latency_ms"</span>: <span className="text-amber-400">42</span>,
  <span className="text-cyan-400">"tokens_used"</span>: <span className="text-amber-400">1240</span>
{'}'}</pre>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Webhooks */}
      <Card>
        <CardHeader title="Webhooks" subtitle="Subscribe to platform events" icon={Webhook} />
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 aura-glass rounded-lg p-1.5 mb-4">
            <input
              type="text"
              placeholder="https://your-app.com/webhook"
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-1.5 px-2"
            />
            <Button size="sm" icon={Webhook}>Add Webhook</Button>
          </div>
          <div className="space-y-2">
            {['alert.critical', 'model.deployed', 'drift.detected', 'rag.indexed'].map(e => (
              <div key={e} className="flex items-center gap-3 aura-glass rounded-lg px-4 py-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-300">{e}</span>
                <Badge color="green" size="sm" >active</Badge>
                <span className="ml-auto text-[10px] text-slate-600">12 deliveries today</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
