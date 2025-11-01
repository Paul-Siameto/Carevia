import { GoogleGenerativeAI } from "@google/generative-ai";

// Set to true to use mock responses (for testing without valid API key)
const USE_MOCK = !process.env.GEMINI_API_KEY || process.env.USE_MOCK_AI === 'true';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Mock responses for testing
const mockResponses = {
  symptom: (symptoms) => `Based on your symptoms (${symptoms}), it could be related to stress, fatigue, or a minor infection. If symptoms persist for more than 3 days or worsen, please consult a healthcare professional. Stay hydrated and get plenty of rest. *This is not professional medical advice.*`,
  
  nutrition: (prefs) => `**Daily Meal Plan**\n\n**Breakfast:** Oatmeal with berries and nuts\n**Lunch:** Grilled chicken salad with mixed greens and olive oil\n**Dinner:** Baked salmon with quinoa and steamed vegetables\n**Snack:** Greek yogurt with honey or a handful of almonds\n\nThis plan is balanced and includes protein, healthy fats, and fiber. Adjust portions based on your activity level.`,
  
  chat: (message) => {
    const tips = [
      "Remember to drink at least 8 glasses of water daily! Staying hydrated supports energy and focus.",
      "Try to get 7-8 hours of quality sleep each night. It's essential for physical and mental recovery.",
      "Take short breaks every hour if you're working at a desk. A quick walk can boost circulation and mood.",
      "Practice deep breathing for 5 minutes daily. It reduces stress and improves mental clarity.",
      "Include colorful vegetables in your meals. Different colors provide different nutrients your body needs."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
};

// Diagnostic endpoint to list available models
export const listModels = async (req, res) => {
  try {
    const genAI = getAI();
    const models = await genAI.listModels();
    res.json({ models: models.map(m => ({ name: m.name, supportedMethods: m.supportedGenerationMethods })) });
  } catch (err) {
    console.error("Error listing models:", err);
    res.status(500).json({ message: "Could not list models", error: err.message });
  }
};

export const symptomCheck = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ message: "Symptoms required" });
    
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a medical assistant. A user reports the following symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}. Provide a brief assessment and suggest whether they should see a doctor. Keep it concise (3-4 sentences). Disclaimer: This is not professional medical advice.`;
    
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
    if (!preferences) return res.status(400).json({ message: "Preferences required" });
    
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a nutrition expert. Based on these user preferences: ${JSON.stringify(preferences)}, create a simple daily meal plan (breakfast, lunch, dinner, snack). Keep it concise and healthy.`;
    
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
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });
    
    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are Carevia AI, a friendly health and wellness assistant. The user says: "${message}". Respond helpfully and concisely (2-3 sentences). Focus on general wellness, healthy habits, mental health tips, or encouragement.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini chatReply error:", err);
    const helpMsg = "Check that GEMINI_API_KEY in .env is valid. Get one at https://aistudio.google.com/apikey";
    res.status(500).json({ message: "AI service unavailable", error: err.message, help: helpMsg });
  }
};



