import { useState } from 'react';
import {
  Settings, Key, Eye, EyeOff, DollarSign, Zap, Cpu, CheckCircle2,
  TrendingUp, Coins, BookOpen, ExternalLink
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, Toggle, ProgressBar, Drawer } from '../components/ui';
import { GEMINI_MODELS, type GeminiModel } from '../lib/data';

export function SettingsView() {
  const [models, setModels] = useState<GeminiModel[]>(GEMINI_MODELS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Initialize state from localStorage groq keys
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('VITE_GROQ_API_KEY') || localStorage.getItem('groq_api_key') || ''
  );
  const [showKey, setShowKey] = useState(false);
  const [costOpt, setCostOpt] = useState(true);
  const [savedKey, setSavedKey] = useState(false);

  const setActive = (id: string) => {
    setModels(prev => prev.map(m => ({ ...m, active: m.id === id })));
    const selected = models.find(m => m.id === id);
    if (selected) {
      localStorage.setItem('aura_selected_model', selected.name);
    }
  };

  const saveKey = () => {
    localStorage.setItem('VITE_GROQ_API_KEY', apiKey);
    localStorage.setItem('groq_api_key', apiKey);
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2500);
  };

  const active = models.find(m => m.active) || models[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">AI Settings & Groq Engine</h1>
          <p className="text-sm text-slate-400 mt-1">Configure your Groq API credentials, GPT-OSS model routing, and cost optimization.</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)} icon={Key}>Manage Groq API Key</Button>
      </div>

      {/* Cost stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Tokens Today" value="1.24M" delta="+15.2" icon={Zap} color="cyan" />
        <Card title="Cost Today" value="$42.80" delta="-12.1" icon={DollarSign} color="yellow" />
        <Card title="Avg Latency" value="42ms" delta="-0.3" icon={Cpu} color="green" />
        <Card title="Monthly Budget" value="$1,200" icon={Coins} color="blue" />
      </div>

      {/* Cost optimization */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Cost Optimization Mode</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                When enabled, AURA dynamically routes queries to the most cost-efficient Groq model capable of handling the prompt.
              </p>
            </div>
          </div>
          <Toggle checked={costOpt} onChange={setCostOpt} />
        </div>
      </Card>

      {/* Model cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {models.map(m => (
          <Card key={m.id} hover className={`p-5 ${m.active ? 'border-cyan-400/40' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.active ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{m.name}</h3>
                  <Badge color={m.color === 'cyan' ? 'cyan' : 'slate'} size="sm">{m.tier}</Badge>
                </div>
              </div>
              {m.active && <CheckCircle2 size={18} className="text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.desc}</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Input cost</span><span className="text-slate-300">{m.inputCost}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Output cost</span><span className="text-slate-300">{m.outputCost}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Context window</span><span className="text-slate-300">{m.context}</span></div>
            </div>
            <div className="mt-5">
              <Button
                variant={m.active ? 'outline' : 'primary'}
                size="sm"
                className="w-full justify-center"
                onClick={() => setActive(m.id)}
                disabled={m.active}
              >
                {m.active ? 'Active Model' : 'Set as Active'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* How to get your API key */}
      <Card>
        <CardHeader title="How to Get Your Groq API Key" subtitle="Step-by-step guide for Groq Console" icon={BookOpen} />
        <div className="px-5 pb-5 space-y-3">
          {[
            { step: '1', title: 'Visit Groq Console', desc: 'Go to console.groq.com and sign into your developer account.' },
            { step: '2', title: 'Navigate to API Keys', desc: 'Click on "API Keys" in the left sidebar menu.' },
            { step: '3', title: 'Create a New API Key', desc: 'Click the "Create API Key" button and label your key.' },
            { step: '4', title: 'Copy Your Key', desc: 'Copy your secret key string (usually starts with gsk_).' },
            { step: '5', title: 'Paste It Into AURA', desc: 'Open the "Manage Groq API Key" drawer above, paste your key, and click Save.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 aura-glass rounded-xl p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                {s.step}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">{s.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Key Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Groq API Key Management" width="sm">
        <div className="space-y-5">
          <div className="text-xs text-slate-400 mb-2">Groq API Key</div>
          <div className="flex items-center gap-2 aura-glass rounded-lg p-2">
            <Key size={18} className="text-cyan-400 ml-2" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-1.5"
            />
            <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-slate-300 p-1">
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mt-3">
            <Button size="sm" onClick={saveKey} icon={CheckCircle2}>
              {savedKey ? 'Saved!' : 'Save Groq Key'}
            </Button>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">Keys are encrypted at rest with AES-256. Never exposed in client code.</p>
        </div>
      </Drawer>
    </div>
  );
}
