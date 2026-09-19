import { type ReactNode, useEffect, useRef, useState } from 'react';

// ── Card ───────────────────────────────────────────────────
export function Card({
  children,
  className = '',
  glow = false,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={`aura-glass rounded-2xl ${hover ? 'transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/5' : ''} ${glow ? 'aura-pulse-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action }: { title: string; subtitle?: string; icon?: any; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between p-5 pb-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: any;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20',
    ghost: 'text-slate-300 hover:bg-slate-800/50',
    outline: 'border border-slate-700 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-400',
    danger: 'bg-red-500/90 text-white hover:bg-red-500',
    success: 'bg-emerald-500/90 text-white hover:bg-emerald-500',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ children, color = 'slate', size = 'md' }: { children: ReactNode; color?: 'slate' | 'cyan' | 'green' | 'yellow' | 'red' | 'blue' | 'purple'; size?: 'sm' | 'md' }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors[color]} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      {children}
    </span>
  );
}

// ── ProgressBar ────────────────────────────────────────────
export function ProgressBar({ value, color = 'cyan', animated = false }: { value: number; color?: 'cyan' | 'green' | 'yellow' | 'red' | 'blue' | 'purple'; animated?: boolean }) {
  const colors: Record<string, string> = {
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-emerald-500 to-teal-500',
    yellow: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-violet-500 to-purple-500',
  };
  return (
    <div className="h-2 w-full rounded-full bg-slate-800/60 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color]} ${animated ? 'aura-shimmer' : ''} transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${checked ? 'left-4' : 'left-0.5'}`} />
      </button>
      {label && <span className="text-xs text-slate-400">{label}</span>}
    </label>
  );
}

// ── Skeleton ───────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`aura-shimmer rounded-lg ${className}`} />;
}

// ── Tooltip ────────────────────────────────────────────────
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 border border-slate-700 z-50 aura-fade-in">
          {label}
        </div>
      )}
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────
export function StatCard({ label, value, unit, delta, icon: Icon, color = 'cyan' }: { label: string; value: string | number; unit?: string; delta?: number; icon?: any; color?: 'cyan' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' }) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    green: 'text-emerald-400 bg-emerald-500/10',
    yellow: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-violet-400 bg-violet-500/10',
  };
  return (
    <Card hover className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {Icon && <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[color]}`}><Icon size={16} /></div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={delta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
          <span className="text-slate-600">vs last period</span>
        </div>
      )}
    </Card>
  );
}

// ── LineChart (SVG) ────────────────────────────────────────
export function LineChart({ data, color = '#22d3ee', height = 160, showDots = true }: { data: { x: string; y: number }[]; color?: string; height?: number; showDots?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const w = width;
  const h = height;
  const pad = 30;
  if (data.length === 0) return null;
  const ys = data.map((d) => d.y);
  const max = Math.max(...ys) * 1.1;
  const min = Math.min(...ys) * 0.9;
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1 || 1);
  const points = data.map((d, i) => ({ x: pad + i * stepX, y: h - pad - ((d.y - min) / range) * (h - pad * 2) }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;
  return (
    <div ref={containerRef} className="w-full" style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad} y1={pad + t * (h - pad * 2)} x2={w - pad} y2={pad + t * (h - pad * 2)} stroke="#1e293b" strokeWidth="0.5" />
        ))}
        <path d={areaD} fill={`url(#grad-${color.slice(1)})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {showDots && points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />)}
        {data.map((d, i) => (
          <text key={i} x={pad + i * stepX} y={h - 8} textAnchor="middle" fontSize="9" fill="#64748b">{d.x}</text>
        ))}
      </svg>
    </div>
  );
}

// ── BarChart (SVG) ─────────────────────────────────────────
export function BarChart({ data, color = '#22d3ee', height = 160, horizontal = false }: { data: { label: string; value: number }[]; color?: string; height?: number; horizontal?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (horizontal) {
    return (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-24 truncate">{d.label}</span>
            <div className="flex-1 h-5 rounded bg-slate-800/60 overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-cyan-500/80 to-blue-500/80 aura-bar-grow flex items-center justify-end pr-2" style={{ width: `${(d.value / max) * 100}%`, animationDelay: `${i * 0.08}s` }}>
                <span className="text-[10px] font-semibold text-white">{d.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t bg-gradient-to-t from-cyan-600/60 to-cyan-400/80 aura-bar-grow" style={{ height: `${(d.value / max) * (height - 24)}px`, animationDelay: `${i * 0.06}s` }} />
          <span className="text-[10px] text-slate-500 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── DonutChart (SVG) ───────────────────────────────────────
export function DonutChart({ data, size = 140 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * 2 * Math.PI * r;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${2 * Math.PI * r - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
          offset += dash;
          return seg;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#e2e8f0">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#64748b">Total</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="text-slate-400">{d.label}</span>
            <span className="text-slate-600 ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sparkline ──────────────────────────────────────────────
export function Sparkline({ data, color = '#22d3ee', height = 40, width = 100 }: { data: number[]; color?: string; height?: number; width?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, children, className = '' }: { open: boolean; onClose: () => void; children: ReactNode; className?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 aura-fade-in" style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className={`aura-scale-in ${className}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Drawer ─────────────────────────────────────────────────
export function Drawer({ open, onClose, children, title, icon: Icon, width = 480 }: { open: boolean; onClose: () => void; children: ReactNode; title: string; icon?: any; width?: number }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 aura-fade-in" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-50 aura-glass-strong aura-slide-in-right overflow-y-auto" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {Icon && <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400"><Icon size={18} /></div>}
            <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </>
  );
}

// ── TypingIndicator ────────────────────────────────────────
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-cyan-400" style={{ animation: `aura-typing 1.4s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

// ── AnimatedCounter ────────────────────────────────────────
export function AnimatedCounter({ value, duration = 800, format }: { value: number; duration?: number; format?: (v: number) => string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const startVal = display;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + (value - startVal) * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{format ? format(display) : Math.round(display)}</span>;
}
