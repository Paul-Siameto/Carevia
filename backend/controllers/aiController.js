import dotenv from "dotenv";
dotenv.config();
console.log("Loaded .env keys:", Object.keys(process.env));

import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

console.log("Gemini key:", process.env.GEMINI_API_KEY ? "Loaded " : "Missing ");
console.log("Gemini model:", MODEL_NAME);

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

const buildModel = () => {
  const genAI = getAI();
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

export const listModels = async (req, res) => {
  try {
    const genAI = getAI();
    const models = await genAI.listModels();
    res.json({ models: models.map((m) => ({ name: m.name, supportedMethods: m.supportedGenerationMethods })) });
  } catch (err) {
    console.error("Error listing models:", err);
    res.status(500).json({ message: "Could not list models", error: err.message });
  }
};

export const symptomCheck = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ message: "Symptoms required" });
    }

    const model = buildModel();
    const prompt = `You are a medical assistant. A user reports the following symptoms: ${
      Array.isArray(symptoms) ? symptoms.join(", ") : symptoms
    }. Provide a brief assessment and suggest whether they should see a doctor. Keep it concise (3-4 sentences). Disclaimer: This is not professional medical advice.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("Gemini symptomCheck error:", err);
    const helpMsg = "Check that GEMINI_API_KEY in .env is valid. Get one at https://aistudio.google.com/apikey";
    res.status(500).json({ message: "AI service unavailable", error: err.message, help: helpMsg });
  }
};

export const nutritionPlan = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ message: "Preferences required" });
    }

    const model = buildModel();
    const prompt = `You are a nutrition expert. Based on these user preferences: ${JSON.stringify(
      preferences
    )}, create a simple daily meal plan (breakfast, lunch, dinner, snack). Keep it concise and healthy.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ plan: text });
  } catch (err) {
    console.error("Gemini nutritionPlan error:", err);
    const helpMsg = "Check that GEMINI_API_KEY in .env is valid. Get one at https://aistudio.google.com/apikey";
    res.status(500).json({ message: "AI service unavailable", error: err.message, help: helpMsg });
  }
};

export const chatReply = async (req, res) => {
  console.log('Starting chatReply handler');
  
  try {
    console.log('Request body:', req.body);
    
    const { message } = req.body;
    if (!message) {
      console.log('No message provided in request');
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("1. Received chat request with message:", message);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      const errorMsg = 'GEMINI_API_KEY is not configured in .env file';
      console.error(errorMsg);
      return res.status(500).json({ 
        message: "Configuration error",
        error: errorMsg,
        help: "Please set GEMINI_API_KEY in your .env file"
      });
    }
    
    console.log("2. API Key is configured");
    
    try {
      console.log("3. Building Gemini model...");
      const model = buildModel();
      
      const prompt = `You are Carevia AI, a friendly health and wellness assistant. The user says: "${message}". Respond helpfully and concisely (2-3 sentences). Focus on general wellness, healthy habits, mental health tips, or encouragement.`;
      
      console.log("4. Sending prompt to Gemini:", prompt);
      
      const result = await model.generateContent(prompt);
      console.log("5. Received response from Gemini");
      
      const text = result.response.text();
      console.log("6. Extracted text from response");
      
      console.log("7. Sending success response");
      return res.json({ reply: text });
      
    } catch (apiError) {
      console.error('Gemini API Error:', {
        name: apiError.name,
        message: apiError.message,
        stack: apiError.stack,
        response: apiError.response?.data || 'No response data',
        status: apiError.response?.status || 'No status code'
      });
      
      return res.status(500).json({
        message: "Error communicating with Gemini API",
        error: apiError.message,
        details: process.env.NODE_ENV === 'development' ? {
          name: apiError.name,
          status: apiError.response?.status,
          response: apiError.response?.data
        } : undefined
      });
    }
    
  } catch (error) {
    console.error('Unexpected error in chatReply:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.response && {
        response: {
          status: error.response.status,
          data: error.response.data
        }
      })
    });
    
    return res.status(500).json({
      message: "An unexpected error occurred",
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          name: error.name,
          stack: error.stack
        }
      })
    });
  }
};
