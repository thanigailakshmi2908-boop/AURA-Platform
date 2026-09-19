import { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, TrendingUp, AlertTriangle, Lightbulb, FileText,
  Brain, Search, ShieldCheck, BarChart3, CheckCircle2, User, Cpu,
} from 'lucide-react';
import { Card, Badge, Button, LineChart, BarChart, TypingIndicator } from '@/components/ui';
import { COPILOT_EXAMPLES, makeSeries } from '@/lib/data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  steps?: { agent: string; icon: string; status: 'done' | 'running' }[];
  charts?: { type: 'line' | 'bar'; data: any[]; title: string }[];
  rootCause?: string[];
  prediction?: string;
  recommendations?: string[];
}

export function CopilotView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { id: Date.now() + 'u', role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      const reply = generateReply(text);
      setMessages((m) => [...m, reply]);
    }, 2400);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Ask Your Data</h1>
            <p className="text-xs text-slate-500">Natural-language analytics powered by 9-agent orchestration</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge color="cyan"><Cpu size={10} /> Gemini 3.6 Flash</Badge>
            <Badge color="green">Online</Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto aura-slide-up">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mb-4">
                <Brain size={32} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">What would you like to know?</h2>
              <p className="text-sm text-slate-500">Ask anything about your data. I'll trigger the agent workflow and deliver insights.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COPILOT_EXAMPLES.map((ex) => (
                <button
                  key={ex.q}
                  onClick={() => send(ex.q)}
                  className="text-left aura-glass rounded-xl p-4 hover:border-cyan-400/30 transition-all group"
                >
                  <Badge color="cyan" size="sm">{ex.category}</Badge>
                  <p className="text-sm text-slate-300 mt-2 group-hover:text-cyan-400 transition-colors">{ex.q}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {thinking && <ThinkingBubble />}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800/50 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 aura-glass rounded-xl p-2 focus-within:border-cyan-400/40 transition-colors">
            <Sparkles size={18} className="text-cyan-400 shrink-0 ml-2" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask a question about your data..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-2"
            />
            <Button onClick={() => send(input)} icon={Send} disabled={thinking || !input.trim()}>Send</Button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">AURA routes queries across 9 agents · Results include citations and confidence scores</p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <div className="flex gap-3 justify-end aura-slide-up">
        <div className="aura-glass rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm text-slate-200">{msg.content}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
          <User size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 aura-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="flex-1 space-y-4">
        {/* Agent steps */}
        {msg.steps && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Agent Workflow</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 aura-glass rounded-lg px-2.5 py-1.5">
                  {s.status === 'done' ? <CheckCircle2 size={12} className="text-emerald-400" /> : <div className="h-3 w-3 rounded-full border-2 border-cyan-400 border-t-transparent aura-spin" />}
                  <span className="text-xs text-slate-400">{s.agent}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Root cause */}
        {msg.rootCause && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Root-Cause Breakdown</span>
            </div>
            <div className="space-y-2">
              {msg.rootCause.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-cyan-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Text content */}
        <div className="aura-glass rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-slate-300 leading-relaxed">{msg.content}</p>
        </div>

        {/* Charts */}
        {msg.charts && msg.charts.map((c, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">{c.title}</span>
            </div>
            {c.type === 'line' ? <LineChart data={c.data} height={180} /> : <BarChart data={c.data} height={180} />}
          </Card>
        ))}

        {/* Prediction */}
        {msg.prediction && (
          <Card className="p-4 border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">Predictive Outlook</span>
            </div>
            <p className="text-sm text-slate-400">{msg.prediction}</p>
          </Card>
        )}

        {/* Recommendations */}
        {msg.recommendations && (
          <Card className="p-4 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">Prescriptive Recommendations</span>
            </div>
            <div className="space-y-2">
              {msg.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  const steps = [
    { agent: 'Orchestrator', running: true },
    { agent: 'Data Agent', running: false },
    { agent: 'Analytics', running: false },
  ];
  return (
    <div className="flex gap-3 aura-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
        <Sparkles size={16} className="text-white" />
      </div>
      <div className="aura-glass rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <TypingIndicator />
          <span className="text-xs text-slate-500">Agents processing your query...</span>
        </div>
      </div>
    </div>
  );
}

function generateReply(query: string): Message {
  const q = query.toLowerCase();
  const baseId = Date.now() + 'a';

  if (q.includes('sales') || q.includes('fall') || q.includes('revenue')) {
    return {
      id: baseId,
      role: 'assistant',
      content: "Based on the multi-agent analysis of your sales pipeline, I've identified a convergence of factors driving the decline. The Data Agent pulled 8.2M transaction records, the Analytics Agent found a 12.4% drop in Q3, and the ML Agent's anomaly model flagged a customer acquisition slowdown as the primary driver.",
      steps: [
        { agent: 'Orchestrator', icon: 'Cpu', status: 'done' },
        { agent: 'Data Agent', icon: 'Database', status: 'done' },
        { agent: 'Analytics', icon: 'Calculator', status: 'done' },
        { agent: 'ML Agent', icon: 'Brain', status: 'done' },
        { agent: 'Research Agent', icon: 'Search', status: 'done' },
        { agent: 'Security Agent', icon: 'Shield', status: 'done' },
      ],
      rootCause: [
        'Customer acquisition rate dropped 18% in Q3, driven by reduced marketing spend in July.',
        'Average order value declined 7.2% due to a shift toward lower-margin product categories.',
        'Seasonal demand contraction accounted for an estimated 4% of the decline.',
        'A competitor promotional campaign captured ~3% market share in key segments.',
      ],
      charts: [
        { type: 'line', title: 'Monthly Revenue Trend', data: makeSeries(42, 12, 240, 90) },
        { type: 'bar', title: 'Revenue by Segment', data: [
          { label: 'Enterprise', value: 890 }, { label: 'SMB', value: 620 }, { label: 'Consumer', value: 410 }, { label: 'Partner', value: 280 },
        ]},
      ],
      prediction: "The predictive model forecasts a 4.7% recovery in Q4, contingent on restoring marketing spend to Q2 levels and launching targeted retention campaigns for high-value segments.",
      recommendations: [
        'Restore marketing budget to $1.2M/month targeting enterprise and SMB segments.',
        'Launch a customer retention program for the top 20% high-value accounts (projected ROI: 3.2x).',
        'Rebalance inventory toward higher-margin product categories to lift AOV by 5-8%.',
        'Deploy competitive price-matching on top 50 SKUs affected by the competitor campaign.',
      ],
    };
  }

  if (q.includes('anomal') || q.includes('risk')) {
    return {
      id: baseId,
      role: 'assistant',
      content: "The Monitoring Agent and ML Agent detected 142 anomalies in the last 24 hours, with 12 flagged as high-risk. The Isolation Forest model identified unusual patterns in transaction velocity and geographic distribution.",
      steps: [
        { agent: 'Orchestrator', icon: 'Cpu', status: 'done' },
        { agent: 'Data Agent', icon: 'Database', status: 'done' },
        { agent: 'ML Agent', icon: 'Brain', status: 'done' },
        { agent: 'Monitoring Agent', icon: 'Activity', status: 'done' },
      ],
      rootCause: [
        'Transaction velocity spike: 3.2x normal rate detected between 02:00-04:00 UTC.',
        'Geographic anomaly: 47 transactions from previously inactive regions.',
        'Amount distribution: 12 transactions exceeded the 99th percentile threshold.',
        'Correlation with IoT sensor drift on pipeline p3 (IoT Sensor Feed).',
      ],
      charts: [
        { type: 'bar', title: 'Anomaly Severity Distribution', data: [
          { label: 'Critical', value: 12 }, { label: 'High', value: 28 }, { label: 'Medium', value: 47 }, { label: 'Low', value: 55 },
        ]},
      ],
      prediction: "The model projects a 5.3% probability of a similar anomaly cluster recurring within 48 hours, linked to the IoT sensor drift pattern.",
      recommendations: [
        'Enable real-time alerts for transactions exceeding $50K from inactive regions.',
        'Trigger automated retraining of the Isolation Forest model with the latest 24h data.',
        'Investigate IoT sensor pipeline p3 for hardware degradation.',
        'Increase Security Agent scanning frequency to every 5 minutes for 24h.',
      ],
    };
  }

  if (q.includes('predict') || q.includes('forecast') || q.includes('quarter')) {
    return {
      id: baseId,
      role: 'assistant',
      content: "The ML Agent ran the Sales Forecast XGBoost model (v3.2.1) with a 94.2% accuracy score. The forecast incorporates seasonal decomposition, trend analysis, and external market signals.",
      steps: [
        { agent: 'Orchestrator', icon: 'Cpu', status: 'done' },
        { agent: 'ML Agent', icon: 'Brain', status: 'done' },
        { agent: 'Analytics', icon: 'Calculator', status: 'done' },
        { agent: 'Viz Agent', icon: 'BarChart', status: 'done' },
      ],
      charts: [
        { type: 'line', title: 'Quarterly Revenue Forecast', data: makeSeries(99, 8, 260, 70) },
      ],
      prediction: "Q4 revenue is projected at $2.68M (a 5.8% uplift), with a confidence interval of ±4.2%. Key growth drivers include seasonal demand recovery and planned marketing reinvestment.",
      recommendations: [
        'Proceed with planned Q4 marketing spend of $1.4M — model shows positive ROI at 2.8x.',
        'Monitor the forecast weekly and trigger retraining if MAPE exceeds 8%.',
        'Prepare inventory scaling for the 3 highest-forecasted product categories.',
      ],
    };
  }

  if (q.includes('churn') || q.includes('customer')) {
    return {
      id: baseId,
      role: 'assistant',
      content: "The Churn Predictor LightGBM model identified 1,847 customers with a >60% churn probability. The Research Agent cross-referenced this with support ticket sentiment analysis from the RAG knowledge base.",
      steps: [
        { agent: 'Orchestrator', icon: 'Cpu', status: 'done' },
        { agent: 'Data Agent', icon: 'Database', status: 'done' },
        { agent: 'ML Agent', icon: 'Brain', status: 'done' },
        { agent: 'Research Agent', icon: 'Search', status: 'done' },
        { agent: 'Report Agent', icon: 'FileText', status: 'done' },
      ],
      rootCause: [
        'Support ticket sentiment score dropped 22% for at-risk cohort.',
        'Average login frequency declined from 4.2x/week to 1.8x/week.',
        'Feature adoption rate 31% lower than retained customers.',
        'Billing disputes correlated with 3.4x higher churn probability.',
      ],
      charts: [
        { type: 'bar', title: 'Churn Risk by Segment', data: [
          { label: 'Enterprise', value: 180 }, { label: 'SMB', value: 520 }, { label: 'Consumer', value: 1147 },
        ]},
      ],
      prediction: "Without intervention, the model projects a 6.1% monthly churn rate, representing $340K in lost recurring revenue.",
      recommendations: [
        'Deploy targeted retention outreach to the top 500 at-risk accounts within 48 hours.',
        'Offer loyalty credits to customers with billing disputes (projected retention lift: 42%).',
        'Launch a feature-adoption onboarding campaign for low-engagement users.',
        'Set up automated churn-risk alerts in the Observability module.',
      ],
    };
  }

  return {
    id: baseId,
    role: 'assistant',
    content: "I've processed your query through the agent workflow. The Orchestrator routed this to the Data, Analytics, and Research agents. Based on the current data context, here's what I found:",
    steps: [
      { agent: 'Orchestrator', icon: 'Cpu', status: 'done' },
      { agent: 'Data Agent', icon: 'Database', status: 'done' },
      { agent: 'Analytics', icon: 'Calculator', status: 'done' },
      { agent: 'Report Agent', icon: 'FileText', status: 'done' },
    ],
    charts: [
      { type: 'line', title: 'Trend Analysis', data: makeSeries(77, 10, 180, 60) },
    ],
    prediction: "The model projects a 4.5% positive outlook for the next reporting period, based on current trajectory and leading indicators.",
    recommendations: [
      'Review the detailed analysis in the ML Engine and XAI modules for deeper insights.',
      'Set up automated alerts for key metric thresholds to stay ahead of changes.',
      'Export this analysis using the Report Generator for stakeholder distribution.',
    ],
  };
}
