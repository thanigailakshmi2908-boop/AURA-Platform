import { useState, useEffect } from 'react';
import {
  Play, RotateCcw, CheckCircle2, Cpu, ArrowRight,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardHeader, Badge, Button, ProgressBar } from '@/components/ui';
import { AGENTS, type AgentDef } from '@/lib/data';

export function AgentsView() {
  const [agents, setAgents] = useState<AgentDef[]>(AGENTS.map(a => ({ ...a, status: 'idle' as const })));
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  const workflow = ['orchestrator', 'data', 'analytics', 'ml', 'research', 'report', 'viz', 'monitor', 'security'];

  const runWorkflow = () => {
    if (running) return;
    setRunning(true);
    setAgents(AGENTS.map(a => ({ ...a, status: 'idle' })));
    setActiveStep(0);

    workflow.forEach((id, i) => {
      setTimeout(() => {
        setActiveStep(i);
        setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'running' } : a));
        if (i > 0) {
          setAgents(prev => prev.map(a => a.id === workflow[i - 1] ? { ...a, status: 'done' } : a));
        }
      }, i * 600);
    });

    setTimeout(() => {
      setAgents(prev => prev.map(a => a.id === workflow[workflow.length - 1] ? { ...a, status: 'done' } : a));
      setRunning(false);
      setActiveStep(-1);
    }, workflow.length * 600 + 400);
  };

  const reset = () => {
    setAgents(AGENTS.map(a => ({ ...a, status: 'idle' })));
    setActiveStep(-1);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">AI Agent Orchestration</h1>
          <p className="text-sm text-slate-500 mt-1">9 specialized agents coordinated by the Orchestrator</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={reset} icon={RotateCcw} disabled={running}>Reset</Button>
          <Button onClick={runWorkflow} icon={Play} disabled={running}>
            {running ? 'Running...' : 'Run Workflow'}
          </Button>
        </div>
      </div>

      {/* Workflow graph */}
      <Card className="p-6">
        <CardHeader title="Execution Pipeline" subtitle="Live agent workflow visualization" icon={Cpu} />
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2">
          {workflow.map((id, i) => {
            const agent = agents.find(a => a.id === id)!;
            const Icon = (Icons as any)[agent.icon] || Icons.Cpu;
            const isActive = activeStep === i;
            return (
              <div key={id} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl p-3 min-w-[120px] transition-all duration-300 ${isActive ? 'aura-glass-strong scale-105 aura-pulse-glow' : 'aura-glass'}`}
                  style={{ borderColor: agent.status === 'done' ? `${agent.color}40` : undefined }}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${agent.status === 'running' ? 'aura-pulse-glow' : ''}`}
                    style={{ background: `${agent.color}15`, color: agent.color }}
                  >
                    {agent.status === 'done' ? <CheckCircle2 size={20} style={{ color: '#10b981' }} /> :
                     agent.status === 'running' ? <div className="h-5 w-5 rounded-full border-2 border-t-transparent aura-spin" style={{ borderColor: agent.color, borderTopColor: 'transparent' }} /> :
                     <Icon size={20} />}
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 text-center leading-tight">{agent.name}</span>
                  <Badge color={agent.status === 'done' ? 'green' : agent.status === 'running' ? 'cyan' : 'slate'} size="sm">
                    {agent.status}
                  </Badge>
                </div>
                {i < workflow.length - 1 && <ArrowRight size={16} className="text-slate-700 shrink-0" />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = (Icons as any)[agent.icon] || Icons.Cpu;
          return (
            <Card key={agent.id} hover className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${agent.color}15`, color: agent.color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{agent.name}</h3>
                    <p className="text-[10px] text-slate-500">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {agent.status === 'running' && <div className="h-2 w-2 rounded-full bg-cyan-400 aura-blink" />}
                  {agent.status === 'done' && <CheckCircle2 size={14} className="text-emerald-400" />}
                  <Badge color={agent.status === 'done' ? 'green' : agent.status === 'running' ? 'cyan' : 'slate'} size="sm">{agent.status}</Badge>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{agent.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span>Latency: {(Math.random() * 200 + 50).toFixed(0)}ms</span>
                <span>Tokens: {(Math.random() * 500 + 100).toFixed(0)}</span>
              </div>
              <ProgressBar value={agent.status === 'done' ? 100 : agent.status === 'running' ? 60 : 0} color={agent.status === 'done' ? 'green' : 'cyan'} animated={agent.status === 'running'} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
