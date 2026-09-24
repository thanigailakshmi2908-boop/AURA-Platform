import Groq from 'groq-sdk';

export interface AnalysisOptions {
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';
  targetAudience?: 'entrepreneur' | 'hr' | 'general';
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

  // Retrieve API key from environmental variables or local browser storage fallback
  const apiKey = 
    import.meta.env.VITE_GROQ_API_KEY || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('VITE_GROQ_API_KEY') || 
    localStorage.getItem('groq_api_key') || 
    localStorage.getItem('VITE_GEMINI_API_KEY');

  if (!apiKey) {
    return "Configuration Error: Groq API Key is missing. Please open your app Settings panel, paste your Groq key, and save.";
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  // High-performance primary and fallback model stack (GPT OSS 120B -> GPT OSS 20B -> Llama 3.3)
  const modelsToTry = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'llama-3.3-70b-versatile'
  ];

  let systemPrompt = `You are AURA, an elite 9-agent enterprise analytics engine. All financial calculations, metrics, and budget evaluations must explicitly use the selected currency symbol: ${currency}. Provide deep, exhaustive, A-Z analytical breakdowns with exact quantitative metrics, root-cause diagnostics, structural trends, and clear action items.`;

  if (targetAudience === 'entrepreneur') {
    systemPrompt += ` Focus intensely on scaling, financial burn rates, runway analysis, customer acquisition cost (CAC), lifetime value (LTV), revenue optimization, and risk mitigation framed in ${currency}.`;
  } else if (targetAudience === 'hr') {
    systemPrompt += ` Focus intensely on workforce optimization, turnover dynamics, employee productivity metrics, compensation structuring, talent pipeline blockages, and engagement metrics calculated in ${currency}.`;
  }

  for (const modelName of modelsToTry) {
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
      console.warn(`Model ${modelName} encountered an error, rolling over to backup model...`, error);
    }
  }

  return "Error: All AI inference endpoints are currently busy or unavailable. Please check your Groq API rate limits or network connection.";
}

