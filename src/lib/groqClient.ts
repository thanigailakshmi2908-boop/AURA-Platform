// src/lib/groqClient.ts

export async function callGroqAI(prompt: string, systemContext?: string): Promise<string> {
  const apiKey = localStorage.getItem('VITE_GROQ_API_KEY') || localStorage.getItem('groq_api_key') || '';

  if (!apiKey) {
    throw new Error('Groq API Key is missing. Please go to AI Settings, paste your key, and click Save.');
  }

  const defaultSystemPrompt = `You are AURA, an elite enterprise risk, big data, RAG knowledge, and ML analytics multi-agent system. 
Provide deep, comprehensive, highly professional, data-backed analytical answers with rigorous technical detail, concrete metrics, clear structure, and deep insights.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Universal stable Groq model endpoint
        messages: [
          { role: 'system', content: systemContext || defaultSystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else {
      throw new Error(data.error?.message || 'Invalid response received from Groq API backend.');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect to Groq cloud API.');
  }
}
