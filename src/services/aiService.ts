const OPENROUTER_KEYS = [
  import.meta.env.VITE_OPENROUTER_KEY_1,
  import.meta.env.VITE_OPENROUTER_KEY_2,
  import.meta.env.VITE_OPENROUTER_KEY_3,
].filter(Boolean);

export interface DailyThought {
  text: string;
  author: string;
  date: string;
}

export const fetchDailyThought = async (): Promise<DailyThought> => {
  const prompt = `Generate a short, powerful, and unique motivational thought for today. 
  The theme should rotate between: study, humanity, life, fitness, love, success, and discipline.
  Provide the result in a mixture of English and Hindi (Hinglish/Bilingual) that feels natural and inspiring.
  Return only a JSON object with two fields: "text" and "author".
  Example: { "text": "Continuous improvement is better than delayed perfection. Aaj ka din aapka hai, use it well.", "author": "Mark Twain / Ancient Wisdom" }`;

  let lastError = null;

  for (const key of OPENROUTER_KEYS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://timewise-planner.app",
          "X-Title": "TimeWise Planner",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { "role": "user", "content": prompt }
          ],
          "response_format": { "type": "json_object" }
        })
      });

      if (!response.ok) throw new Error(`API failed with status ${response.status}`);

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      
      return {
        text: content.text,
        author: content.author,
        date: new Date().toISOString().split('T')[0]
      };
    } catch (err) {
      console.error("OpenRouter API Key failed, trying next...", err);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI keys failed");
};
