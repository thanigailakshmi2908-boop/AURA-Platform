import { useEffect, useState } from 'react';
import { Sparkles, Mail, ArrowRight, Cpu } from 'lucide-react';

export function WelcomeModal({ onEnter }: { onEnter: () => void }) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setClosing(true);
    setTimeout(onEnter, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${closing ? 'aura-fade-out' : 'aura-fade-in'}`}
      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(8,12,22,0.92), rgba(2,6,23,0.98))', backdropFilter: 'blur(12px)' }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 aura-grid-bg opacity-40" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div
        className={`relative w-full max-w-lg ${mounted ? 'aura-scale-in' : 'opacity-0'}`}
        style={{ transform: mounted ? 'perspective(1200px) rotateX(0deg) scale(1)' : 'perspective(1200px) rotateX(8deg) scale(0.95)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="aura-glass-strong rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Logo orb */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl animate-pulse" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 aura-pulse-glow">
                <Cpu size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">Autonomous Unified Risk & Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold aura-gradient-text leading-tight">
              AURA
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Autonomous Unified Risk & Analytics Intelligence Platform
            </p>
          </div>

          {/* Credit badge */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="aura-glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-xs text-slate-500">Created with mastery by</span>
              <span className="text-sm font-semibold text-slate-200">Deepak</span>
            </div>

            <a
              href="mailto:thanigailakshmi2908@gmail.com"
              className="aura-glass rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-cyan-400/30 transition-colors group"
            >
              <Mail size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-slate-400">thanigailakshmi2908@gmail.com</span>
            </a>
          </div>

          {/* Enter button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleEnter}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
            >
              Enter Platform
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-600 mt-6">
            Multi-Model AI · 9 Agents · RAG · MLOps · Enterprise Security
          </p>
        </div>
      </div>
    </div>
  );
}
