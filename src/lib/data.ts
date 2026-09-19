export type IndustryKey =
  | 'business'
  | 'manufacturing'
  | 'logistics'
  | 'finance'
  | 'retail'
  | 'energy'
  | 'education';

export interface Industry {
  key: IndustryKey;
  label: string;
  icon: string;
  blurb: string;
  accent: string;
}

export const INDUSTRIES: Industry[] = [
  { key: 'business', label: 'Business Intelligence', icon: 'Building2', blurb: 'Sales, customer & inventory analytics', accent: '#22d3ee' },
  { key: 'manufacturing', label: 'Manufacturing', icon: 'Factory', blurb: 'Machine failure & predictive maintenance', accent: '#f59e0b' },
  { key: 'logistics', label: 'Logistics', icon: 'Truck', blurb: 'Demand, delivery & anomaly tracking', accent: '#10b981' },
  { key: 'finance', label: 'Finance', icon: 'Landmark', blurb: 'Transaction anomalies & forecasting', accent: '#3b82f6' },
  { key: 'retail', label: 'Retail', icon: 'ShoppingCart', blurb: 'Demand forecasting & customer analytics', accent: '#ec4899' },
  { key: 'energy', label: 'Energy', icon: 'Zap', blurb: 'Consumption forecasting & anomaly detection', accent: '#eab308' },
  { key: 'education', label: 'Education', icon: 'GraduationCap', blurb: 'Student performance analytics', accent: '#a78bfa' },
];

export interface KpiPoint { label: string; value: number; unit?: string; delta?: number; }

export interface SeriesPoint { x: string; y: number; }

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  status: 'idle' | 'running' | 'done' | 'error';
  description: string;
}

export const AGENTS: AgentDef[] = [
  { id: 'data', name: 'Data Agent', role: 'Ingestion & SQL', icon: 'Database', color: '#22d3ee', status: 'idle', description: 'Queries databases and parses ingestion pipelines.' },
  { id: 'analytics', name: 'Analytics Agent', role: 'Statistics', icon: 'Calculator', color: '#3b82f6', status: 'idle', description: 'Executes statistical processing & aggregations.' },
  { id: 'ml', name: 'ML Agent', role: 'Predictions', icon: 'BrainCircuit', color: '#a78bfa', status: 'idle', description: 'Selects algorithms and runs predictions.' },
  { id: 'research', name: 'Research Agent', role: 'RAG & Vector', icon: 'Search', color: '#10b981', status: 'idle', description: 'Handles vector search and RAG retrieval.' },
  { id: 'report', name: 'Report Agent', role: 'Synthesis', icon: 'FileText', color: '#f59e0b', status: 'idle', description: 'Synthesizes structured data reports.' },
  { id: 'viz', name: 'Visualization Agent', role: 'Charts', icon: 'BarChart3', color: '#ec4899', status: 'idle', description: 'Automatically generates chart types.' },
  { id: 'monitor', name: 'Monitoring Agent', role: 'Drift', icon: 'Activity', color: '#eab308', status: 'idle', description: 'Evaluates data drift and system errors.' },
  { id: 'security', name: 'Security Agent', role: 'PII & Injection', icon: 'ShieldCheck', color: '#ef4444', status: 'idle', description: 'Scans for prompt injections and PII risks.' },
  { id: 'orchestrator', name: 'Orchestrator', role: 'Workflow', icon: 'Cpu', color: '#06b6d4', status: 'idle', description: 'Controls overall workflow execution.' },
];

export interface CopilotExample {
  q: string;
  category: string;
}

export const COPILOT_EXAMPLES: CopilotExample[] = [
  { q: 'Why did sales fall this month?', category: 'Root Cause' },
  { q: 'Show me high-risk anomalies in the last 24 hours', category: 'Anomaly' },
  { q: 'Predict next quarter revenue outlook', category: 'Forecast' },
  { q: 'Which customers are likely to churn?', category: 'Predictive' },
  { q: 'What actions should I take to reduce risk?', category: 'Prescriptive' },
  { q: 'Summarize the latest compliance audit findings', category: 'RAG' },
];

export interface RagDoc {
  id: string;
  name: string;
  type: 'PDF' | 'Manual' | 'Paper' | 'Policy';
  size: string;
  chunks: number;
  status: 'indexed' | 'processing' | 'queued';
  confidence: number;
}

export const RAG_DOCS: RagDoc[] = [
  { id: 'd1', name: 'Q3 Financial Report.pdf', type: 'PDF', size: '2.4 MB', chunks: 142, status: 'indexed', confidence: 0.94 },
  { id: 'd2', name: 'Data Governance Policy.pdf', type: 'Policy', size: '880 KB', chunks: 58, status: 'indexed', confidence: 0.91 },
  { id: 'd3', name: 'Predictive Maintenance Manual.pdf', type: 'Manual', size: '5.1 MB', chunks: 310, status: 'indexed', confidence: 0.88 },
  { id: 'd4', name: 'Anomaly Detection Research.pdf', type: 'Paper', size: '1.2 MB', chunks: 87, status: 'processing', confidence: 0 },
  { id: 'd5', name: 'Customer Churn Analysis.pdf', type: 'PDF', size: '3.3 MB', chunks: 201, status: 'indexed', confidence: 0.92 },
];

export interface Pipeline {
  id: string;
  name: string;
  source: string;
  throughput: string;
  latency: string;
  health: 'healthy' | 'degraded' | 'down';
  records: string;
}

export const PIPELINES: Pipeline[] = [
  { id: 'p1', name: 'Sales Events Stream', source: 'Kafka · sales-events', throughput: '12.4K/s', latency: '42ms', health: 'healthy', records: '8.2M' },
  { id: 'p2', name: 'Customer CDC Pipeline', source: 'Postgres → Spark', throughput: '3.1K/s', latency: '120ms', health: 'healthy', records: '2.1M' },
  { id: 'p3', name: 'IoT Sensor Feed', source: 'MQTT → Kafka', throughput: '48.7K/s', latency: '18ms', health: 'degraded', records: '31M' },
  { id: 'p4', name: 'Transaction Stream', source: 'Kafka · tx-events', throughput: '8.9K/s', latency: '55ms', health: 'healthy', records: '5.4M' },
  { id: 'p5', name: 'Inventory Sync', source: 'S3 → Spark', throughput: '1.2K/s', latency: '340ms', health: 'down', records: '920K' },
];

export interface ModelRecord {
  id: string;
  name: string;
  type: 'Supervised' | 'Unsupervised' | 'Time-Series' | 'Ensemble';
  algorithm: string;
  accuracy: number;
  f1: number;
  status: 'production' | 'staging' | 'experiment';
  version: string;
}

export const MODELS: ModelRecord[] = [
  { id: 'm1', name: 'Sales Forecast XGBoost', type: 'Supervised', algorithm: 'XGBoost', accuracy: 0.94, f1: 0.91, status: 'production', version: 'v3.2.1' },
  { id: 'm2', name: 'Anomaly Detector IsolationForest', type: 'Unsupervised', algorithm: 'Isolation Forest', accuracy: 0.89, f1: 0.86, status: 'production', version: 'v2.0.4' },
  { id: 'm3', name: 'Churn Predictor LightGBM', type: 'Supervised', algorithm: 'LightGBM', accuracy: 0.87, f1: 0.83, status: 'staging', version: 'v1.4.0' },
  { id: 'm4', name: 'Demand ARIMA Forecast', type: 'Time-Series', algorithm: 'ARIMA', accuracy: 0.82, f1: 0.79, status: 'production', version: 'v1.1.2' },
  { id: 'm5', name: 'Fraud Ensemble XGB+RF', type: 'Ensemble', algorithm: 'XGBoost+RF', accuracy: 0.96, f1: 0.94, status: 'experiment', version: 'v0.9.0' },
  { id: 'm6', name: 'KMeans Sensor Clustering', type: 'Unsupervised', algorithm: 'K-Means', accuracy: 0.78, f1: 0.74, status: 'staging', version: 'v1.0.1' },
];

export interface AlertEvent {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  source: string;
  time: string;
}

export const ALERTS: AlertEvent[] = [
  { id: 'a1', severity: 'critical', title: 'Inventory Sync pipeline down', source: 'Pipeline Monitor', time: '2m ago' },
  { id: 'a2', severity: 'warning', title: 'Data drift detected on Sales Forecast model', source: 'MLOps Drift', time: '8m ago' },
  { id: 'a3', severity: 'warning', title: 'API latency above 500ms on /api/predict', source: 'Observability', time: '15m ago' },
  { id: 'a4', severity: 'info', title: 'AutoML experiment v0.9.0 completed', source: 'AutoML', time: '32m ago' },
  { id: 'a5', severity: 'critical', title: 'Prompt injection attempt blocked', source: 'Security Agent', time: '41m ago' },
  { id: 'a6', severity: 'info', title: 'RAG index rebuilt for 5 documents', source: 'Research Agent', time: '1h ago' },
  { id: 'a7', severity: 'warning', title: 'Token cost trending above daily budget', source: 'Cost Analyzer', time: '1h ago' },
];

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  sample: string;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  { method: 'POST', path: '/api/predict', description: 'Run inference with a deployed model', sample: '{ "model": "sales-forecast", "features": { ... } }' },
  { method: 'POST', path: '/api/chat', description: 'Send a natural-language query to the Copilot', sample: '{ "query": "Why did sales fall?", "industry": "business" }' },
  { method: 'POST', path: '/api/rag', description: 'Query the RAG knowledge base with vector search', sample: '{ "query": "compliance audit", "top_k": 5 }' },
  { method: 'GET', path: '/api/monitoring', description: 'Fetch live system metrics, drift, and latency', sample: '{ "window": "1h" }' },
];

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  time: string;
  ip: string;
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', user: 'deepak@aura.io', action: 'LOGIN', resource: 'auth', time: '09:42:11', ip: '10.0.1.24' },
  { id: 'l2', user: 'deepak@aura.io', action: 'QUERY', resource: '/api/chat', time: '09:43:05', ip: '10.0.1.24' },
  { id: 'l3', user: 'analyst@aura.io', action: 'EXPORT', resource: 'report-q3', time: '09:38:22', ip: '10.0.2.51' },
  { id: 'l4', user: 'system', action: 'RETRAIN', resource: 'model:sales-forecast', time: '09:30:00', ip: 'internal' },
  { id: 'l5', user: 'deepak@aura.io', action: 'DEPLOY', resource: 'model:fraud-ensemble', time: '09:15:44', ip: '10.0.1.24' },
];

export const ROLES = ['Admin', 'Analyst', 'Viewer', 'Data Engineer'];
export const PERMISSIONS = ['Overview', 'Copilot', 'Agents', 'RAG', 'Pipelines', 'ML Engine', 'XAI', 'AutoML', 'MLOps', 'Security', 'Reports', 'Alerts', 'API Portal'];

export interface GeminiModel {
  id: string;
  name: string;
  tier: string;
  desc: string;
  inputCost: number;
  outputCost: number;
  contextWindow: string;
  active: boolean;
}

export const GEMINI_MODELS: GeminiModel[] = [
  { id: 'flash', name: 'Gemini 3.6 Flash', tier: 'Fast Reasoning', desc: 'Ultra-fast reasoning, live token tracking, high-throughput data parsing.', inputCost: 0.075, outputCost: 0.30, contextWindow: '1M tokens', active: true },
  { id: 'lite', name: 'Gemini 3.5 Lite', tier: 'Cost-Efficient', desc: 'Cost-efficient utility tasks and low-latency structured output.', inputCost: 0.0375, outputCost: 0.15, contextWindow: '512K tokens', active: false },
  { id: 'pro', name: 'Gemini 3.1 Pro', tier: 'Deep Reasoning', desc: 'Deep multi-step agent reasoning, complex RAG synthesis, architecture planning.', inputCost: 1.25, outputCost: 5.00, contextWindow: '2M tokens', active: false },
];

export function rand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function makeSeries(seed: number, count: number, base: number, variance: number): SeriesPoint[] {
  const r = rand(seed);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: count }, (_, i) => ({
    x: months[i % 12] + (count > 12 ? ` ${Math.floor(i / 12) + 1}` : ''),
    y: Math.round(base + (r() - 0.4) * variance),
  }));
}
