import { GoogleGenAI, Type } from "@google/genai";
import { StatType } from "../types";
import { FALLBACK_TASKS } from "../constants";

// Helper to get a random item if API fails
const getFallbackTask = () => {
  const task = FALLBACK_TASKS[Math.floor(Math.random() * FALLBACK_TASKS.length)];
  return {
    title: task.title,
    description: task.description,
    requirements: {
      primaryStat: task.primary,
      primaryValue: task.val1,
      secondaryStat: task.secondary,
      secondaryValue: task.val2
    },
    difficultyLevel: task.difficulty as 'Easy' | 'Medium' | 'Hard' | 'Extreme',
    timeToExpire: 45,
    duration: 10
  };
};

let genAI: GoogleGenAI | null = null;

// Initialize safely
try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize Gemini Client", e);
}

export const generateRandomTask = async () => {
  if (!genAI) {
    // specific check to avoid spamming warnings if key is missing
    return getFallbackTask();
  }

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a unique, creative superhero mission scenario. 
      It should be a crisis needing intervention. 
      Provide a title, a short description, and the required stats (Intelligence, Agility, Fearlessness, Durability, Charisma) to solve it.
      Also determine a difficulty level and appropriate time parameters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short, punchy title of the crisis" },
            description: { type: Type.STRING, description: "1-2 sentences describing the threat" },
            primaryStat: { type: Type.STRING, enum: Object.values(StatType) },
            primaryValue: { type: Type.INTEGER, description: "Value between 30 and 90" },
            secondaryStat: { type: Type.STRING, enum: Object.values(StatType) },
            secondaryValue: { type: Type.INTEGER, description: "Value between 20 and 70" },
            difficultyLevel: { type: Type.STRING, enum: ["Easy", "Medium", "Hard", "Extreme"] },
            timeToExpire: { type: Type.INTEGER, description: "Seconds before mission disappears (30-90)" },
            duration: { type: Type.INTEGER, description: "Seconds to complete mission (5-20)" }
          },
          required: ["title", "description", "primaryStat", "primaryValue", "difficultyLevel", "timeToExpire", "duration"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        title: data.title,
        description: data.description,
        requirements: {
          primaryStat: data.primaryStat as StatType,
          primaryValue: data.primaryValue,
          secondaryStat: data.secondaryStat as StatType,
          secondaryValue: data.secondaryValue
        },
        difficultyLevel: data.difficultyLevel,
        timeToExpire: data.timeToExpire,
        duration: data.duration
      };
    }
    return getFallbackTask();

  } catch (error: any) {
    // Handle Rate Limits Gracefully to improve UX
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        console.warn("Gemini API Quota Exceeded. Switching to fallback mission data.");
    } else {
        console.error("Error generating task with Gemini:", error);
    }
    return getFallbackTask();
  }
};