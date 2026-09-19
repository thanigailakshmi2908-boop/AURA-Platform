import { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, Bot, BookOpen, Database, BrainCircuit,
  GitBranch, Activity, ShieldCheck, FileText, Bell, Code2, Settings,
  Cpu, ChevronDown, Search, Zap,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { INDUSTRIES, type IndustryKey } from '@/lib/data';
import { Badge } from '@/components/ui';

export type ViewKey =
  | 'overview' | 'copilot' | 'agents' | 'rag' | 'pipelines' | 'ml'
  | 'xai' | 'automl' | 'mlops' | 'security' | 'reports' | 'alerts' | 'api' | 'settings';

interface NavItem { key: ViewKey; label: string; icon: any; }

const NAV: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'copilot', label: 'Ask Your Data', icon: MessageSquare },
  { key: 'agents', label: 'AI Agents', icon: Bot },
  { key: 'rag', label: 'RAG Knowledge', icon: BookOpen },
  { key: 'pipelines', label: 'Big Data & Pipelines', icon: Database },
  { key: 'ml', label: 'ML Engine', icon: BrainCircuit },
  { key: 'xai', label: 'Explainable AI', icon: GitBranch },
  { key: 'automl', label: 'AutoML & Registry', icon: Cpu },
  { key: 'mlops', label: 'MLOps & Monitoring', icon: Activity },
  { key: 'security', label: 'Security & Governance', icon: ShieldCheck },
  { key: 'reports', label: 'Report Generator', icon: FileText },
  { key: 'alerts', label: 'Alerts & Observability', icon: Bell },
  { key: 'api', label: 'Developer API Portal', icon: Code2 },
  { key: 'settings', label: 'AI Settings', icon: Settings },
];

export function Sidebar({ view, setView, collapsed }: { view: ViewKey; setView: (v: ViewKey) => void; collapsed: boolean }) {
  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-30 aura-glass-strong border-r border-slate-800/50 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800/50 h-16">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <Cpu size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold aura-gradient-text leading-none">AURA</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Risk & Analytics</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 aura-no-scrollbar">
        {NAV.map((item) => {
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`group relative flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-200 ${active ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
              title={collapsed ? item.label : undefined}
            >
              {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 rounded-r" />}
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 aura-blink" />}
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/50">
          <div className="aura-glass rounded-lg p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 aura-blink" />
              <span className="text-[10px] text-slate-400">System Operational</span>
            </div>
            <div className="text-[10px] text-slate-600">9 agents · 6 models · 5 pipelines</div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function TopBar({
  industry,
  setIndustry,
  onToggleSidebar,
  onOpenSettings,
  onOpenAlerts,
}: {
  industry: IndustryKey;
  setIndustry: (i: IndustryKey) => void;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenAlerts: () => void;
}) {
  const [open, setOpen] = useState(false);
  const current = INDUSTRIES.find((i) => i.key === industry)!;
  const CurrentIcon = (Icons as any)[current.icon] || Icons.Building2;

  return (
    <header className="sticky top-0 z-20 h-16 aura-glass-strong border-b border-slate-800/50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-slate-400 hover:text-slate-200 transition-colors p-1.5">
          <Icons.Menu size={20} />
        </button>

        {/* Industry dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 aura-glass rounded-xl px-3 py-2 hover:border-cyan-400/30 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${current.accent}15`, color: current.accent }}>
              <CurrentIcon size={16} />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-none">{current.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{current.blurb}</div>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-72 aura-glass-strong rounded-xl p-2 z-20 aura-scale-in shadow-2xl">
                <div className="px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Switch Industry Engine</div>
                {INDUSTRIES.map((ind) => {
                  const Icon = (Icons as any)[ind.icon] || Icons.Building2;
                  return (
                    <button
                      key={ind.key}
                      onClick={() => { setIndustry(ind.key); setOpen(false); }}
                      className={`flex items-center gap-3 w-full rounded-lg px-2 py-2.5 transition-colors ${industry === ind.key ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'}`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0" style={{ background: `${ind.accent}15`, color: ind.accent }}>
                        <Icon size={15} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-200">{ind.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ind.blurb}</div>
                      </div>
                      {industry === ind.key && <div className="h-2 w-2 rounded-full" style={{ background: ind.accent }} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 aura-glass rounded-lg px-3 py-1.5">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none w-32"
          />
          <kbd className="text-[10px] text-slate-600 border border-slate-700 rounded px-1">⌘K</kbd>
        </div>

        <button onClick={onOpenAlerts} className="relative text-slate-400 hover:text-slate-200 transition-colors p-2">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-400" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Badge color="green" size="sm"><Zap size={10} /> Flash</Badge>
        </div>

        <button onClick={onOpenSettings} className="flex items-center gap-2 aura-glass rounded-lg pl-2 pr-3 py-1.5 hover:border-cyan-400/30 transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white">D</div>
          <span className="text-xs text-slate-300 hidden sm:block">Deepak</span>
        </button>
      </div>
    </header>
  );
}
