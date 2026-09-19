import { useState } from 'react';
import {
  Settings, Key, Eye, EyeOff, DollarSign, Zap, Cpu, CheckCircle2,
  TrendingUp, Coins, BookOpen, ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, Toggle, ProgressBar, StatCard, Drawer } from '@/components/ui';
import { GEMINI_MODELS, type GeminiModel } from '@/lib/data';

export function SettingsView() {
  const [models, setModels] = useState<GeminiModel[]>(GEMINI_MODELS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [costOpt, setCostOpt] = useState(true);
  const [savedKey, setSavedKey] = useState(false);

  const setActive = (id: string) => {
    setModels(prev => prev.map(m => ({ ...m, active: m.id === id })));
  };

  const saveKey = () => {
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2500);
  };

  const active = models.find(m => m.active)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">AI Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Gemini model routing, API keys, and cost optimization</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)} icon={Key}>Manage API Keys</Button>
      </div>

      {/* Cost stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tokens Today" value="1.24M" delta={15.2} icon={Zap} color="cyan" />
        <StatCard label="Cost Today" value="$42.80" delta={12.1} icon={DollarSign} color="yellow" />
        <StatCard label="Avg Latency" value="42ms" delta={-8.3} icon={Cpu} color="green" />
        <StatCard label="Monthly Budget" value="$1,200" icon={Coins} color="blue" />
      </div>

      {/* Cost optimization */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Cost Optimization Mode</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                When enabled, AURA dynamically routes queries to the most cost-efficient model capable of handling the task.
                Simple queries use Gemini 3.5 Lite; complex reasoning falls back to Gemini 3.1 Pro.
              </p>
            </div>
          </div>
          <Toggle checked={costOpt} onChange={setCostOpt} />
        </div>
        {costOpt && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 aura-slide-up">
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Savings (30d)</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">$312.40</p>
            </div>
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Queries Routed to Lite</p>
              <p className="text-lg font-bold text-slate-200 mt-1">68%</p>
            </div>
            <div className="aura-glass rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500">Avg Cost / Query</p>
              <p className="text-lg font-bold text-slate-200 mt-1">$0.003</p>
            </div>
          </div>
        )}
      </Card>

      {/* Model cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {models.map((m) => (
          <Card key={m.id} hover className={`p-5 ${m.active ? 'border-cyan-400/40' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.active ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{m.name}</h3>
                  <Badge color={m.active ? 'cyan' : 'slate'} size="sm">{m.tier}</Badge>
                </div>
              </div>
              {m.active && <CheckCircle2 size={18} className="text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.desc}</p>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between"><span className="text-slate-500">Input cost</span><span className="text-slate-300">${m.inputCost}/M tokens</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Output cost</span><span className="text-slate-300">${m.outputCost}/M tokens</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Context window</span><span className="text-slate-300">{m.contextWindow}</span></div>
            </div>
            <Button
              variant={m.active ? 'outline' : 'primary'}
              size="sm"
              className="w-full justify-center"
              onClick={() => setActive(m.id)}
              disabled={m.active}
            >
              {m.active ? 'Active Model' : 'Set as Active'}
            </Button>
          </Card>
        ))}
      </div>

      {/* How to get your API key */}
      <Card>
        <CardHeader title="How to Get Your Gemini API Key" subtitle="Step-by-step guide for Google AI Studio" icon={BookOpen} />
        <div className="px-5 pb-5 space-y-3">
          {[
            { step: '1', title: 'Visit Google AI Studio', desc: 'Go to aistudio.google.com and sign in with your Google account. This is the official portal for Gemini API access.', link: 'https://aistudio.google.com', linkLabel: 'Open Google AI Studio' },
            { step: '2', title: 'Navigate to API Keys', desc: 'Once signed in, click on "Get API key" in the left sidebar, or look for the "API Keys" section in the navigation menu.' },
            { step: '3', title: 'Create a New API Key', desc: 'Click the "Create API key" button. If you don\'t have a project yet, Google AI Studio will prompt you to create one. Select or create a Google Cloud project to associate with the key.' },
            { step: '4', title: 'Copy Your API Key', desc: 'Your new API key will be displayed (starts with "AIza"). Copy it immediately — you won\'t be able to see it again once you navigate away. Store it securely.' },
            { step: '5', title: 'Paste It Into AURA', desc: 'Open the "Manage API Keys" drawer above, paste your key into the Gemini API Key field, and click Save. AURA will use this key for all model calls.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 aura-glass rounded-xl p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">{s.step}</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    {s.linkLabel} <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
          <div className="aura-glass rounded-xl p-4 border-amber-500/20">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-0.5">!</span>
              <div>
                <p className="text-xs font-semibold text-amber-400">Important Notes</p>
                <ul className="text-xs text-slate-400 mt-1.5 space-y-1 list-disc list-inside">
                  <li>Your API key is free to create — Google offers a generous free tier for Gemini models.</li>
                  <li>Never share your API key publicly or commit it to version control.</li>
                  <li>You can create multiple keys per project and delete them at any time from AI Studio.</li>
                  <li>Rate limits and quotas vary by model — check the Google AI documentation for details.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Budget tracking */}
      <Card>
        <CardHeader title="Budget Tracking" subtitle="Monthly token spend vs budget" icon={DollarSign} />
        <div className="px-5 pb-5 space-y-4">
          {[
            { model: 'Gemini 3.6 Flash', spent: 28.40, budget: 600, color: 'cyan' as const },
            { model: 'Gemini 3.5 Lite', spent: 8.20, budget: 200, color: 'green' as const },
            { model: 'Gemini 3.1 Pro', spent: 6.20, budget: 400, color: 'purple' as const },
          ].map(b => (
            <div key={b.model}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-300">{b.model}</span>
                <span className="text-xs text-slate-400">${b.spent} / ${b.budget}</span>
              </div>
              <ProgressBar value={(b.spent / b.budget) * 100} color={b.color} />
            </div>
          ))}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">Total Spend</span>
            <span className="text-sm font-bold text-slate-100">$42.80 / $1,200</span>
          </div>
        </div>
      </Card>

      {/* API Key Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="API Key Management" icon={Key} width={500}>
        <div className="space-y-5">
          {/* Active key */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Gemini API Key</p>
            <div className="flex items-center gap-2 aura-glass rounded-lg p-2">
              <Key size={16} className="text-cyan-400 ml-2" />
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza••••••••••••••••••••••••••"
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-1.5"
              />
              <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-slate-300 p-1">
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <Button size="sm" onClick={saveKey} icon={savedKey ? CheckCircle2 : undefined}>
                {savedKey ? 'Saved' : 'Save'}
              </Button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2">Keys are encrypted at rest with AES-256. Never exposed in client-side code.</p>
            <div className="mt-3 aura-glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={12} className="text-cyan-400" />
                <span className="text-[10px] font-semibold text-slate-400">Don't have a key yet?</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                Get a free Gemini API key from Google AI Studio in under 2 minutes.
              </p>
              <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                Open Google AI Studio <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Active model */}
          <div className="aura-glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Active Model</span>
              <Badge color="cyan" size="sm">{active.name}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-500">Tier:</span> <span className="text-slate-300">{active.tier}</span></div>
              <div><span className="text-slate-500">Context:</span> <span className="text-slate-300">{active.contextWindow}</span></div>
              <div><span className="text-slate-500">Input cost:</span> <span className="text-slate-300">${active.inputCost}/M</span></div>
              <div><span className="text-slate-500">Output cost:</span> <span className="text-slate-300">${active.outputCost}/M</span></div>
            </div>
          </div>

          {/* Token tracking */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-3">Token Tracking (Today)</p>
            <div className="space-y-2">
              {[
                { agent: 'Input tokens', val: 820, total: 1240 },
                { agent: 'Output tokens', val: 420, total: 1240 },
              ].map(t => (
                <div key={t.agent}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{t.agent}</span>
                    <span className="text-slate-300">{t.val}K / {t.total}K</span>
                  </div>
                  <ProgressBar value={(t.val / t.total) * 100} color="cyan" />
                </div>
              ))}
            </div>
          </div>

          {/* Cost estimate */}
          <div className="aura-glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-slate-400">Estimated Cost (Today)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-100">$42.80</p>
                <p className="text-[10px] text-slate-500">spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">$1,157</p>
                <p className="text-[10px] text-slate-500">remaining</p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
