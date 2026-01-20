
import { GoogleGenAI, Type } from "@google/genai";
import { Task, AISuggestion, QuadrantType } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeTasks(tasks: Task[]): Promise<AISuggestion[]> {
    if (tasks.length === 0) return [];

    const prompt = `
      Analyze these tasks from an Eisenhower Matrix productivity perspective:
      ${JSON.stringify(tasks.map(t => ({ id: t.id, name: t.name, quadrant: t.quadrant, dueDate: t.dueDate })))}

      Provide 2-3 specific suggestions:
      1. Check if any quadrant has > 5 tasks (Bloated).
      2. Group similar tasks by name/intent.
      3. Suggest relevant tags for untagged tasks.
      4. Alert if a due date is tomorrow but it's not in DO_NOW.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                message: { type: Type.STRING },
                taskId: { type: Type.STRING },
                targetQuadrant: { type: Type.STRING }
              },
              required: ['type', 'message']
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Analysis failed:", error);
      return [];
    }
  }
}
