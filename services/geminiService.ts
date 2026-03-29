import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PredictionResult } from "../types";

// ✅ FIXED ENV VARIABLE (ONLY THIS WORKS IN VITE)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ SAFE INIT
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function predictReliabilityScore(
  frequency: number,
  accuracy: number,
  delayHours: number,
  feedback: number
): Promise<PredictionResult> {

  // ✅ SAFETY CHECK (VERY IMPORTANT)
  if (!ai) {
    console.warn("No API key → using fallback");

    const fallbackScore = (accuracy * 0.6) + (feedback * 0.4);

    return {
      score: fallbackScore,
      reasoning: "Fallback (no API key)",
      incentiveTier: fallbackScore > 0.8 ? 'High' : fallbackScore > 0.5 ? 'Medium' : 'Low'
    };
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict reliability score (0-1) for a retail shop based on behavior:

        - Update Frequency: ${frequency}
        - Past Accuracy: ${accuracy}
        - Update Delay: ${delayHours}
        - Customer Feedback: ${feedback}

        Return ONLY JSON:
        { "score": number, "reasoning": string, "incentiveTier": "High|Medium|Low|None" }`,

      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            incentiveTier: { type: Type.STRING }
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "{}";

    let result: PredictionResult;

    try {
      result = JSON.parse(jsonStr);
    } catch {
      throw new Error("JSON parse failed");
    }

    return result;

  } catch (error) {
    console.error("Reliability Prediction Error:", error);

    const fallbackScore = (accuracy * 0.6) + (feedback * 0.4);

    return {
      score: fallbackScore,
      reasoning: "Computed using fallback",
      incentiveTier: fallbackScore > 0.8 ? 'High' : fallbackScore > 0.5 ? 'Medium' : 'Low'
    };
  }
}
