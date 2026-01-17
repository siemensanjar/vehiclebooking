
import { GoogleGenAI } from "@google/genai";
import { Vehicle } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLogisticsAdvice = async (prompt: string, vehicles: Vehicle[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Use string format for contents as per guidelines.
      contents: `You are a professional logistics assistant for TransPort Pro. 
          Current available vehicles: ${JSON.stringify(vehicles)}.
          User request: ${prompt}.
          Provide short, professional advice on which vehicle to choose or how to optimize the route.`,
      config: {
        temperature: 0.7,
      }
    });

    // Directly access the .text property from the response.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the logistics brain. Please try again later.";
  }
};
