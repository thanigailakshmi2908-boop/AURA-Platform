import { useState } from 'react';
import {
  BookOpen, Upload, FileText, Search, Sparkles, Quote, CheckCircle2,
  Layers, Database, Filter,
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, ProgressBar } from '@/components/ui';
import { RAG_DOCS } from '@/lib/data';

export function RagView() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleSearch = () => {
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">RAG Knowledge System</h1>
        <p className="text-sm text-slate-500 mt-1">Document ingestion, vector search, and retrieval-augmented generation</p>
      </div>

      {/* Upload zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-all ${dragOver ? 'border-cyan-400/50 bg-cyan-500/5' : 'border-slate-700/50'}`}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 mb-3">
            <Upload size={28} className="text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Drag & drop documents to ingest</h3>
          <p className="text-xs text-slate-500 mt-1">Supports PDFs, policy manuals, research papers — auto-chunked and embedded</p>
          <Button variant="outline" className="mt-4" icon={FileText}>Browse Files</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document library */}
        <Card>
          <CardHeader title="Knowledge Base" subtitle={`${RAG_DOCS.length} documents indexed`} icon={BookOpen} />
          <div className="divide-y divide-slate-800/50">
            {RAG_DOCS.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/20 transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 shrink-0">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-200 truncate">{doc.name}</span>
                    <Badge color="slate" size="sm">{doc.type}</Badge>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{doc.size} · {doc.chunks} chunks</div>
                </div>
                {doc.status === 'indexed' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{(doc.confidence * 100).toFixed(0)}%</span>
                    <Badge color="green" size="sm"><CheckCircle2 size={10} /> indexed</Badge>
                  </div>
                ) : doc.status === 'processing' ? (
                  <Badge color="yellow" size="sm">processing</Badge>
                ) : (
                  <Badge color="slate" size="sm">queued</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Vector search preview */}
        <Card>
          <CardHeader title="Vector Search" subtitle="Hybrid search with reranking" icon={Search} />
          <div className="px-5 pb-5 space-y-4">
            <div className="flex items-center gap-2 aura-glass rounded-lg p-1.5">
              <Search size={16} className="text-slate-500 ml-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search the knowledge base..."
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none py-1.5"
              />
              <Button size="sm" onClick={handleSearch} icon={Sparkles}>Search</Button>
            </div>

            {!searched && (
              <div className="text-center py-8">
                <Layers size={32} className="text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Enter a query to see chunking, embeddings, and reranked results</p>
              </div>
            )}

            {searched && (
              <div className="space-y-3 aura-slide-up">
                {/* Pipeline stages */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['Chunk', 'Embed', 'Hybrid Search', 'Rerank', 'Cite'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5 aura-glass rounded-lg px-2 py-1">
                        <CheckCircle2 size={10} className="text-emerald-400" />
                        <span className="text-[10px] text-slate-400">{stage}</span>
                      </div>
                      {i < 4 && <span className="text-slate-700">→</span>}
                    </div>
                  ))}
                </div>

                {/* Results */}
                {[
                  { doc: 'Q3 Financial Report.pdf', chunk: 'Chunk 42/142', text: 'Revenue declined 12.4% in Q3 primarily due to reduced customer acquisition spend and a shift toward lower-margin product categories...', score: 0.94 },
                  { doc: 'Customer Churn Analysis.pdf', chunk: 'Chunk 87/201', text: 'High-value customers showing decreased engagement metrics correlated with support ticket sentiment decline of 22%...', score: 0.89 },
                  { doc: 'Data Governance Policy.pdf', chunk: 'Chunk 12/58', text: 'All financial reporting must include root-cause attribution and confidence intervals per compliance standard AURA-DC-2.1...', score: 0.81 },
                ].map((r, i) => (
                  <div key={i} className="aura-glass rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Quote size={12} className="text-cyan-400" />
                      <span className="text-xs font-medium text-slate-300">{r.doc}</span>
                      <Badge color="slate" size="sm">{r.chunk}</Badge>
                      <span className="ml-auto text-[10px] text-cyan-400">confidence: {(r.score * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">{r.text}</p>
                    <ProgressBar value={r.score * 100} color="cyan" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Embedding stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400"><Database size={18} /></div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Total Chunks</h3>
              <p className="text-[10px] text-slate-500">Across all documents</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">998</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400"><Layers size={18} /></div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Embedding Dim</h3>
              <p className="text-[10px] text-slate-500">Vector space</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">1,536</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><Filter size={18} /></div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Avg Confidence</h3>
              <p className="text-[10px] text-slate-500">Reranked retrieval</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">91.3%</p>
        </Card>
      </div>
    </div>
  );
}
