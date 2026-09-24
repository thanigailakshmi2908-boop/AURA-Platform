export interface GeminiModel {
  id: string;
  name: string;
  tier: string;
  desc: string;
  inputCost: string;
  outputCost: string;
  context: string;
  active: boolean;
  color: string;
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gpt-oss-120b',
    name: 'GPT-OSS 120B',
    tier: 'Ultra Reasoning',
    desc: 'High-throughput reasoning, complex multi-agent orchestration, and deep enterprise metrics.',
    inputCost: '$0.05/M tokens',
    outputCost: '$0.2/M tokens',
    context: '128K tokens',
    active: true,
    color: 'cyan'
  },
  {
    id: 'gpt-oss-20b',
    name: 'GPT-OSS 20B',
    tier: 'Cost-Efficient',
    desc: 'Rapid utility tasks, low-latency structured financial data parsing, and HR optimization.',
    inputCost: '$0.02/M tokens',
    outputCost: '$0.08/M tokens',
    context: '64K tokens',
    active: false,
    color: 'green'
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    tier: 'Deep Backup',
    desc: 'Robust quantitative analytics fallback and risk modeling pipeline support.',
    inputCost: '$0.07/M tokens',
    outputCost: '$0.25/M tokens',
    context: '128K tokens',
    active: false,
    color: 'purple'
  }
];
