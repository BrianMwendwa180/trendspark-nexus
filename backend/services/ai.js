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
    { 
      "is_relevant": true|false, 
      "reason": "brief reason why",
      "what_is_happening": "Brief explanation of the trend",
      "why_it_is_spreading": "Brief explanation of why it is going viral",
      "estimated_lifespan": "e.g., 24 hours, 3 days, 2 weeks"
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
    console.error("AI Filtration Error:", error);
    // Fallback if AI rate-limited
    return {
      is_relevant: true,
      reason: "Fallback due to AI rate limit",
      what_is_happening: trend.description || "Trending topic on " + trend.source,
      why_it_is_spreading: "High engagement from users.",
      estimated_lifespan: "24 hours"
    };
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
    // Fallback if AI quota exceeded
    return {
      hook: "Did you know this trend could change how you run your business in Kenya?",
      angle: "Focus on how operational efficiency is more important than hype.",
      script: "[0:00-0:10] Hook delivery with energy.\n[0:10-0:30] Explain the core concept and how it impacts revenue.\n[0:30-0:45] Call to action to follow Kuzana for more tips.",
      remix_template: "Use a simple direct-to-camera format or a green screen with a relevant news article in the background."
    };
  }
}
