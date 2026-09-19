import { useState } from 'react';
import { FileText, Download, FileType, Table, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, Badge, Button, Toggle, ProgressBar } from '@/components/ui';

export function ReportsView() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [sections, setSections] = useState({
    summary: true,
    kpis: true,
    anomalies: true,
    predictions: true,
    recommendations: true,
    appendix: false,
  });

  const generate = () => {
    setGenerating(true);
    setGenerated(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenerated(true);
          return 100;
        }
        return p + 4;
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Automated Report Generator</h1>
        <p className="text-sm text-slate-500 mt-1">One-click executive summary builder with export</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader title="Report Configuration" subtitle="Select sections and format" icon={FileText} />
          <div className="px-5 pb-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Include Sections</p>
              <div className="space-y-3">
                {Object.entries(sections).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Toggle checked={val} onChange={(v) => setSections(s => ({ ...s, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-3">Export Format</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  <FileType size={16} /> PDF
                </button>
                <button className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium aura-glass text-slate-400 hover:text-slate-200">
                  <Table size={16} /> Excel
                </button>
              </div>
            </div>

            <Button onClick={generate} disabled={generating} icon={Sparkles} className="w-full justify-center">
              {generating ? `Generating... ${progress}%` : 'Generate Report'}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2">
          <CardHeader title="Report Preview" subtitle="Executive Summary — Q3 2026" icon={FileText}
            action={generated ? <Button size="sm" icon={Download}>Download</Button> : undefined}
          />
          <div className="px-5 pb-5">
            {generating && (
              <div className="space-y-3">
                <ProgressBar value={progress} color="cyan" animated />
                <div className="space-y-2">
                  {['Compiling KPIs', 'Generating charts', 'Running root-cause analysis', 'Formatting document'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      {progress > (i + 1) * 25 ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Clock size={12} className="text-slate-600" />}
                      <span className={progress > (i + 1) * 25 ? 'text-slate-300' : 'text-slate-600'}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!generating && !generated && (
              <div className="text-center py-12">
                <FileText size={40} className="text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Configure sections and click "Generate Report"</p>
              </div>
            )}

            {generated && (
              <div className="space-y-4 aura-slide-up">
                {sections.summary && (
                  <div className="aura-glass rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-200 mb-2">Executive Summary</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Q3 2026 showed a 12.4% revenue decline driven primarily by reduced customer acquisition spend and a shift toward lower-margin product categories. The platform's 9-agent workflow identified 142 anomalies and delivered 4 prescriptive recommendations. Risk score improved by 5.2 points to 38/100. Model accuracy held at 94.2% with one model requiring retraining due to data drift.
                    </p>
                  </div>
                )}
                {sections.kpis && (
                  <div className="aura-glass rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-200 mb-3">Key Performance Indicators</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[{ l: 'Revenue', v: '$2.41M', d: '-12.4%' }, { l: 'Risk Score', v: '38/100', d: '+5.2' }, { l: 'Anomalies', v: '142', d: '+8.7%' }, { l: 'Accuracy', v: '94.2%', d: '+2.1%' }].map(k => (
                        <div key={k.l} className="text-center">
                          <p className="text-[10px] text-slate-500">{k.l}</p>
                          <p className="text-sm font-bold text-slate-200 mt-1">{k.v}</p>
                          <p className={`text-[10px] ${k.d.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>{k.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sections.anomalies && (
                  <div className="aura-glass rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-200 mb-2">Anomaly Summary</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      12 critical anomalies detected: transaction velocity spikes (3.2x normal), geographic anomalies from inactive regions, and 12 transactions exceeding the 99th percentile. IoT sensor drift on pipeline p3 correlated with anomaly clusters.
                    </p>
                  </div>
                )}
                {sections.predictions && (
                  <div className="aura-glass rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-200 mb-2">Predictive Outlook</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Q4 revenue projected at $2.68M (+5.8%), confidence interval ±4.2%. Churn risk projected at 6.1% monthly without intervention, representing $340K in potential lost revenue.
                    </p>
                  </div>
                )}
                {sections.recommendations && (
                  <div className="aura-glass rounded-lg p-4">
                    <h3 className="text-sm font-bold text-slate-200 mb-2">Recommendations</h3>
                    <ol className="space-y-1.5 text-xs text-slate-400">
                      <li>1. Restore marketing budget to $1.2M/month (projected ROI: 3.2x)</li>
                      <li>2. Launch retention program for top 20% accounts</li>
                      <li>3. Rebalance inventory toward higher-margin categories</li>
                      <li>4. Deploy competitive price-matching on top 50 SKUs</li>
                    </ol>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <Badge color="green"><CheckCircle2 size={10} /> Report Ready</Badge>
                  <span className="text-[10px] text-slate-600">Generated by AURA · 9 agents · Gemini 3.6 Flash</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Report history */}
      <Card>
        <CardHeader title="Report History" subtitle="Previously generated reports" icon={Clock} />
        <div className="divide-y divide-slate-800/50">
          {[
            { name: 'Q3 2026 Executive Summary', date: 'Sep 18, 2026', size: '2.4 MB', format: 'PDF' },
            { name: 'Anomaly Detection Weekly', date: 'Sep 15, 2026', size: '1.1 MB', format: 'PDF' },
            { name: 'ML Model Performance Q3', date: 'Sep 10, 2026', size: '3.8 MB', format: 'Excel' },
            { name: 'Compliance Audit Report', date: 'Sep 01, 2026', size: '5.2 MB', format: 'PDF' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                {r.format === 'PDF' ? <FileType size={16} /> : <Table size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-200">{r.name}</span>
                <div className="text-[10px] text-slate-500">{r.date} · {r.size}</div>
              </div>
              <Badge color="slate" size="sm">{r.format}</Badge>
              <Button size="sm" variant="ghost" icon={Download}>Download</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
