import Groq from 'groq-sdk';

export interface AnalysisOptions {
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';
  targetAudience?: 'entrepreneur' | 'hr' | 'general';
  modelOverride?: string; // Captures selection from your UI settings (e.g., "Gemini 3.6 Flash")
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥'
};

export async function executeAuraAnalysis(
  userPrompt: string, 
  options: AnalysisOptions = {}
): Promise<string> {
  const currency = options.currency || 'USD';
  const targetAudience = options.targetAudience || 'general';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  // Secure API key retrieval from environment variables or browser localStorage fallbacks
  const apiKey = 
    import.meta.env.VITE_GROQ_API_KEY || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('VITE_GROQ_API_KEY') || 
    localStorage.getItem('groq_api_key') || 
    localStorage.getItem('VITE_GEMINI_API_KEY') ||
    localStorage.getItem('gemini_api_key');

  if (!apiKey) {
    return "Configuration Error: API Key is missing. Please open your app's Settings panel, paste your Groq API key, and click Save.";
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  // Map UI model selections or default to high-performance GPT OSS models with failovers
  let primaryModel = 'openai/gpt-oss-120b';
  const selectedUIModel = options.modelOverride || localStorage.getItem('aura_selected_model') || '';
  
  if (selectedUIModel.toLowerCase().includes('lite') || selectedUIModel.toLowerCase().includes('3.5')) {
    primaryModel = 'openai/gpt-oss-20b';
  } else if (selectedUIModel.toLowerCase().includes('pro') || selectedUIModel.toLowerCase().includes('3.1')) {
    primaryModel = 'llama-3.3-70b-versatile';
  }

  const modelsToTry = [
    primaryModel,
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'llama-3.3-70b-versatile'
  ];

  let systemPrompt = `You are AURA, an elite 9-agent enterprise analytics engine (Orchestrator, Data Agent, Analytics, ML Agent, Research, Security). All financial metrics, burn rates, capital evaluations, and budget insights must natively leverage the selected currency symbol: ${currencySymbol} (${currency}). Provide deep, exhaustive, A-Z analytical breakdowns including exact quantitative numbers, root-cause diagnostics, structural trends, and clear prescriptive action items.`;

  if (targetAudience === 'entrepreneur') {
    systemPrompt += ` Focus intensely on business growth and scaling: analyze financial runway, burn velocity, customer acquisition cost (CAC), lifetime value (LTV), revenue optimization, and risk frameworks evaluated in ${currency}.`;
  } else if (targetAudience === 'hr') {
    systemPrompt += ` Focus intensely on workforce optimization and people operations: analyze employee retention metrics, attrition risks, productivity indexes, compensation benchmarking, and talent pipeline health calculated in ${currency}.`;
  }

  // Deduplicate model list to prevent redundant loops
  const uniqueModels = Array.from(new Set(modelsToTry));

  for (const modelName of uniqueModels) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 3072,
      });

      if (completion.choices && completion.choices[0]?.message?.content) {
        return completion.choices[0].message.content;
      }
    } catch (error) {
      console.warn(`Model ${modelName} encountered an error, falling back to backup model...`, error);
    }
  }

  return "Error: All AI inference endpoints are currently busy or unavailable. Please check your network connection or API rate limits.";
}
