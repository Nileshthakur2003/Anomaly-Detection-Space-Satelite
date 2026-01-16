
import { GoogleGenAI, Type } from "@google/genai";
import { TelemetryPoint, AnomalyReport } from "../types/index";

export const analyzeTelemetryWithAI = async (
  satelliteName: string,
  telemetry: TelemetryPoint[]
): Promise<AnomalyReport | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Context: Satellite Mission Control.
    Analyze the last 20 telemetry events for "${satelliteName}".
    Telemetry JSON: ${JSON.stringify(telemetry.slice(-20))}

    Look for:
    - Non-linear thermal spikes.
    - Signal-to-noise ratio degradation.
    - Attitude stabilization jitter.
    
    Return a detailed anomaly report if any subtle patterns suggest failure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAnomaly: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            subsystem: { type: Type.STRING },
            description: { type: Type.STRING },
            aiAnalysis: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ['isAnomaly']
        }
      }
    });

    const result = JSON.parse(response.text);
    if (!result.isAnomaly) return null;

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      severity: result.severity,
      subsystem: result.subsystem,
      description: result.description,
      aiAnalysis: result.aiAnalysis,
      suggestedAction: result.suggestedAction
    };
  } catch (error) {
    console.error("AI Node Error:", error);
    return null;
  }
};
