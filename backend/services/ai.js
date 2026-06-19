import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-pro';

export async function filterTrend(trend) {
  try {
    const prompt = `
    Analyze this trend:
    Title: ${trend.trend_name}
    Description: ${trend.description}

    Rule: Only pass trends that can logically tie back to Kenyan business operations, personal finance, workplace culture, or regulatory changes (e.g., KRA, eTIMS, eCitizen updates). Discard purely entertainment or non-niche sports gossip.
    
    Return a valid JSON object EXACTLY like this:
    { "is_relevant": true|false, "reason": "brief reason why" }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    const result = JSON.parse(text);
    return result.is_relevant;
  } catch (error) {
    console.error("AI Filtration Error:", error);
    return false; // Safely discard if AI fails
  }
}

export async function generateBrief(trend) {
  try {
    const prompt = `
    You are the Lead Content Strategist for Kuzana, Kenya's premier SME accelerator. Your audience consists of pragmatic Kenyan brick-and-mortar founders. They despise vague startup buzzwords.
    
    Analyze this trend: ${trend.trend_name} - ${trend.description || 'No detailed description.'}.
    
    Generate a structured content brief as a JSON object containing exactly these fields:
    {
      "hook": "A highly captivating, pattern-interrupting opening line contextualized for a Kenyan business owner.",
      "angle": "How this trend directly connects to an operational business lesson (e.g., cash flow, customer retention, compliance).",
      "script": "A 45-second line-by-line video script structured with [Visual Directions] and [Audio Script / Voiceover].",
      "remix_template": "A quick breakdown of how an ordinary business (like an agribusiness or retail store) can easily replicate this format."
    }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate brief via AI");
  }
}
