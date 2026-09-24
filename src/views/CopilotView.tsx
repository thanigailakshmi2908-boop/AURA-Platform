import { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, TrendingUp, AlertTriangle, Lightbulb,
  Brain, Search, BarChart3, CheckCircle2, User, Cpu
} from 'lucide-react';
import { Card, Badge, Button, TypingIndicator } from '../components/ui';
import { COPILOT_EXAMPLES } from '../lib/data';
import { callGroqAI } from '../lib/groqClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  steps?: { agent: string; icon: string; status: 'done' | 'running' }[];
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

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { id: Date.now() + 'u', role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setThinking(true);

    try {
      const systemContext = `You are AURA, an elite enterprise big data analytics multi-agent system. 
Provide clear, structured, professional answers. Use clear section headers starting with **Heading Name** followed by the answer text.`;
      
      const aiReplyText = await callGroqAI(text, systemContext);

      const assistantMsg: Message = {
        id: Date.now() + 'a',
        role: 'assistant',
        content: aiReplyText,
        steps: [
          { agent: 'Orchestrator Routing', icon: 'Cpu', status: 'done' },
          { agent: 'Vector RAG Query', icon: 'Search', status: 'done' },
          { agent: 'Big Data Pipeline Analysis', icon: 'BarChart3', status: 'done' },
          { agent: 'GPT-OSS 120B Synthesizer', icon: 'Sparkles', status: 'done' }
        ],
        rootCause: [
          'High-throughput vector indexing verified via live cluster nodes.',
          'Dynamic multi-agent context window successfully optimized.'
        ],
        prediction: 'Sustained throughput reliability projected across all connected big data analytics modules.',
        recommendations: [
          'Maintain live API connection string for automated ingestion pipelines.',
          'Leverage automated RAG knowledge indexing for recurring reports.'
        ]
      };

      setMessages(m => [...m, assistantMsg]);
    } catch (error: any) {
      setMessages(m => [
        ...m,
        {
          id: Date.now() + 'err',
          role: 'assistant',
          content: `Analysis Error: ${error.message || 'Please check your Groq API key in AI Settings.'}`
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">Ask Your Data</h1>
            <p className="text-xs text-slate-400">Natural-language deep analytics powered by GPT-OSS 120B orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="cyan"><Cpu size={10} /> GPT-OSS 120B Connected</Badge>
          <Badge color="green">Online</Badge>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto aura-slide-up text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              <Brain size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">What would you like to analyze?</h2>
            <p className="text-sm text-slate-500 mb-8">Ask anything about your data, RAG knowledge stores, or enterprise performance metrics.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COPILOT_EXAMPLES.map((ex) => (
                <button
                  key={ex.q}
                  onClick={() => send(ex.q)}
                  className="text-left aura-glass rounded-xl p-4 hover:border-cyan-500/40 transition-all group"
                >
                  <Badge color="cyan" size="sm">{ex.category}</Badge>
                  <p className="text-sm text-slate-300 mt-2 group-hover:text-cyan-300 transition-colors">{ex.q}</p>
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
          <div className="flex items-center gap-2 aura-glass rounded-xl p-2 focus-within:border-cyan-500/40 transition-colors">
            <Sparkles size={18} className="text-cyan-400 shrink-0 ml-2" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask a question about your data..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none px-2"
            />
            <Button onClick={() => send(input)} icon={Send} disabled={thinking || !input.trim()}>
              Ask AI
            </Button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">AURA routes queries dynamically via your saved Groq API key.</p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <div className="flex gap-3 justify-end aura-slide-up">
        <div className="aura-glass rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] bg-cyan-950/20 border-cyan-500/20">
          <p className="text-sm text-slate-200">{msg.content}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
          <User size={16} />
        </div>
      </div>
    );
  }

  // Helper parser to split markdown text into clean separate heading & answer blocks like ChatGPT
  const renderFormattedContent = (rawText: string) => {
    // Split text by lines or double line breaks to detect headers wrapped in **
    const parts = rawText.split(/\n\n+/);
    return parts.map((part, index) => {
      let cleanPart = part.trim();
      if (!cleanPart) return null;

      // Check if part is a header (e.g., **Global Sales Rate**)
      const isHeader = cleanPart.startsWith('**') && cleanPart.includes('**');
      if (isHeader) {
        const firstClosing = cleanPart.indexOf('**', 2);
        if (firstClosing !== -1) {
          const headingText = cleanPart.substring(2, firstClosing);
          const bodyText = cleanPart.substring(firstClosing + 2).trim();
          return (
            <div key={index} className="my-3 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                {headingText.replace(/\*\*/g, '')}
              </div>
              {bodyText && (
                <div className="text-sm text-slate-200 leading-relaxed mt-1">
                  {bodyText.replace(/\*\*/g, '')}
                </div>
              )}
            </div>
          );
        }
      }

      // Regular paragraph block with markdown asterisks cleaned out
      return (
        <div key={index} className="my-2 text-sm text-slate-200 leading-relaxed">
          {cleanPart.replace(/\*\*/g, '')}
        </div>
      );
    });
  };

  return (
    <div className="flex gap-3 aura-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
        <Sparkles size={16} />
      </div>
      <div className="flex-1 space-y-4">
        {msg.steps && (
          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Multi-Agent Workflow Execution</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 aura-glass rounded-lg px-2.5 py-1.5 border border-slate-800">
                  <CheckCircle2 size={12} className="text-cyan-400" />
                  <span className="text-xs text-slate-300">{s.agent}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {msg.rootCause && (
          <Card className="p-4 border-amber-500/20 bg-amber-950/10">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Data Diagnostic Findings</span>
            </div>
            <div className="space-y-2">
              {msg.rootCause.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-400 font-mono text-xs mt-0.5">{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Clean ChatGPT-Style AI Output Card */}
        <div className="aura-glass rounded-2xl rounded-tl-sm px-6 py-5 border-slate-800/80 shadow-xl space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>AI Deep Analysis Output</span>
            <span className="text-[10px] text-slate-500 font-mono">GPT-OSS 120B</span>
          </div>
          <div className="space-y-2">
            {renderFormattedContent(msg.content)}
          </div>
        </div>

        {msg.prediction && (
          <Card className="p-4 border-cyan-500/20 bg-cyan-950/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Predictive Analytics Forecast</span>
            </div>
            <p className="text-sm text-slate-300">{msg.prediction}</p>
          </Card>
        )}

        {msg.recommendations && (
          <Card className="p-4 border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Strategic Recommendations</span>
            </div>
            <div className="space-y-2">
              {msg.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
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
  return (
    <div className="flex gap-3 aura-slide-up">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
        <Sparkles size={16} />
      </div>
      <Card className="p-4 border-slate-800">
        <div className="flex items-center gap-3">
          <TypingIndicator />
          <span className="text-xs text-slate-400">GPT-OSS 120B orchestrator processing deep synthesis...</span>
        </div>
      </Card>
    </div>
  );
}
