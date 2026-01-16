
import { GoogleGenAI, Type } from "@google/genai";
import { TelemetryPoint, AnomalyReport } from "../types";

export const analyzeTelemetryWithAI = async (
  satelliteName: string,
  telemetry: TelemetryPoint[]
): Promise<AnomalyReport | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As an AI Specialist for Satellite Operations, analyze the following telemetry batch from the satellite "${satelliteName}".
    Identify any subtle anomalies that a rule-based system might miss.
    
    Telemetry Data:
    ${JSON.stringify(telemetry.slice(-10))}

    Analyze for:
    1. Thermal runaway or unexpected gradients.
    2. Power bus instabilities.
    3. Attitude drift patterns.
    4. Communication degradation.
    
    If an anomaly is detected, provide a structured report. If everything is nominal, indicate that clearly.
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
            isAnomalyDetected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            subsystem: { type: Type.STRING },
            description: { type: Type.STRING },
            aiAnalysis: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ['isAnomalyDetected']
        }
      }
    });

    const result = JSON.parse(response.text);
    
    if (!result.isAnomalyDetected) return null;

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      severity: result.severity || 'Medium',
      subsystem: result.subsystem || 'Unknown',
      description: result.description || 'General anomaly detected.',
      aiAnalysis: result.aiAnalysis || 'Detailed reasoning pending.',
      suggestedAction: result.suggestedAction || 'Observe and wait.'
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};
