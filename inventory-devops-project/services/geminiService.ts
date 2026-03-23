
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PredictionResult } from "../types";

// Use platform-provided key or local Vite environment variable
const apiKey = process.env.API_KEY || import.meta.env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function predictReliabilityScore(
  frequency: number,
  accuracy: number,
  delayHours: number,
  feedback: number
): Promise<PredictionResult> {
  try {
    // Generate content with recommended model and schema configuration.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict reliability score (0-1) for a retail shop based on behavior:
        - Update Frequency: ${frequency} updates/week
        - Past Accuracy: ${accuracy} (0-1)
        - Update Delay: ${delayHours} hours since last stock change
        - Customer Feedback: ${feedback} (0-1)
        
        Return a JSON object with 'score' (number), 'reasoning' (string), and 'incentiveTier' (string: 'High', 'Medium', 'Low', 'None').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            incentiveTier: { type: Type.STRING }
          },
          propertyOrdering: ["score", "reasoning", "incentiveTier"]
        }
      },
    });

    // Access .text property directly (not a method).
    const jsonStr = response.text?.trim() || "{}";
    const result = JSON.parse(jsonStr);
    return result as PredictionResult;
  } catch (error) {
    console.error("Reliability Prediction Error:", error);
    // Fallback logic if API fails
    const fallbackScore = (accuracy * 0.6) + (feedback * 0.4);
    return {
      score: fallbackScore,
      reasoning: "Computed using heuristic fallback.",
      incentiveTier: fallbackScore > 0.8 ? 'High' : fallbackScore > 0.5 ? 'Medium' : 'Low'
    };
  }
}
