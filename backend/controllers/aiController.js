import dotenv from "dotenv";
dotenv.config();
console.log("Loaded .env keys:", Object.keys(process.env));

import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

console.log("Gemini key:", process.env.GEMINI_API_KEY ? "Loaded " : "Missing ");
console.log("Gemini model:", MODEL_NAME);

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured - using fallback AI responses only");
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error("Failed to initialize GoogleGenerativeAI instance:", err);
    return null;
  }
};

const buildModel = () => {
  const genAI = getAI();
  if (!genAI) return null;
  try {
    return genAI.getGenerativeModel({ model: MODEL_NAME });
  } catch (err) {
    console.error("Failed to build Gemini model:", err);
    return null;
  }
};

export const listModels = async (req, res) => {
  try {
    const genAI = getAI();
    if (!genAI) {
      return res.status(200).json({
        models: [],
        message: "Gemini not configured. Set GEMINI_API_KEY and GEMINI_MODEL to enable dynamic models list.",
      });
    }
    const models = await genAI.listModels();
    res.json({ models: models.map((m) => ({ name: m.name, supportedMethods: m.supportedGenerationMethods })) });
  } catch (err) {
    console.error("Error listing models:", err);
    res.status(200).json({
      models: [],
      message: "Could not list models. Using fallback behavior.",
      error: err.message,
    });
  }
};

export const symptomCheck = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ message: "Symptoms required" });
    }

    const model = buildModel();

    if (!model) {
      const basicText = `You reported the following symptoms: ${
        Array.isArray(symptoms) ? symptoms.join(", ") : symptoms
      }.

This app's advanced AI assistant is not configured right now, but here are some general guidelines:
- If your symptoms are severe, sudden, or getting worse, please seek medical help immediately.
- For persistent or worrying symptoms, consult a qualified healthcare professional.
- Use rest, hydration, and healthy nutrition to support your recovery.

Disclaimer: This is not professional medical advice.`;

      return res.json({ result: basicText });
    }

    const prompt = `You are a medical assistant. A user reports the following symptoms: ${
      Array.isArray(symptoms) ? symptoms.join(", ") : symptoms
    }. Provide a brief assessment and suggest whether they should see a doctor. Keep it concise (3-4 sentences). Disclaimer: This is not professional medical advice.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("Gemini symptomCheck error:", err);
    const fallback = "We could not contact the AI service at the moment. If your symptoms are severe or you feel unwell, please seek medical help. This is not professional medical advice.";
    res.json({ result: fallback });
  }
};

export const nutritionPlan = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ message: "Preferences required" });
    }

    const model = buildModel();

    if (!model) {
      const basicPlan = `Here is a simple example daily meal plan based on your preferences (${JSON.stringify(
        preferences
      )}):

- Breakfast: Oatmeal with fruit and a source of protein (e.g., yogurt, nuts, or eggs).
- Lunch: Balanced plate with vegetables, whole grains (like brown rice or quinoa), and lean protein (beans, fish, or chicken).
- Snack: A piece of fruit, nuts, or yogurt.
- Dinner: Mixed vegetables, a whole grain, and a healthy protein source.

Adjust portions and ingredients to your dietary needs and any medical advice you have received.`;

      return res.json({ plan: basicPlan });
    }

    const prompt = `You are a nutrition expert. Based on these user preferences: ${JSON.stringify(
      preferences
    )}, create a simple daily meal plan that includes breakfast, lunch, dinner, and one snack.

Return the plan as short plain text paragraphs, one for each meal, in this order: Breakfast, Lunch, Snack, Dinner.
Do NOT add any separate "Activity" section or exercise recommendations.
Do NOT use markdown (no bullets, asterisks, or bold headings). Just simple sentences that are easy to read.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ plan: text });
  } catch (err) {
    console.error("Gemini nutritionPlan error:", err);
    const fallbackPlan = "We could not contact the AI service. As a general guide, aim for balanced meals with vegetables, whole grains, and lean protein, and limit sugary drinks and highly processed foods.";
    res.json({ plan: fallbackPlan });
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
    
    try {
      console.log("2. Building Gemini model (if available)...");
      const model = buildModel();

      if (!model) {
        const fallbackReply = `Hi! Thanks for reaching out. The advanced AI assistant is not fully configured right now, but here are some general wellness tips:

- Try to keep a regular sleep schedule and give yourself time to rest.
- Stay hydrated and include fruits, vegetables, and whole grains in your meals.
- Take short breaks to move, stretch, or breathe deeply during the day.

If you have serious health concerns, please speak with a healthcare professional.`;
        console.log("Gemini model not available - returning fallback reply");
        return res.json({ reply: fallbackReply });
      }

      const prompt = `You are Carevia AI, a friendly health and wellness assistant for a healthcare app.

The user says: "${message}".

Your goals:
- Give clear, supportive information about health, symptoms, wellness, or treatments.
- You MAY briefly explain possible causes, common conditions, lifestyle factors, and typical treatment options in general terms.
- Highlight important warning signs where the user should seek urgent or in-person medical care.
- Always stay within general information. DO NOT claim to give a diagnosis or prescribe specific medication or exact doses.
- Keep the tone calm, non-judgmental, and encouraging.

Important safety instructions:
- End with a SHORT disclaimer like: "This is general information, not a diagnosis. Please speak to a doctor or other healthcare professional for personal advice."

Respond in 2-3 concise sentences total (including the disclaimer).`;
      
      console.log("3. Sending prompt to Gemini:", prompt);
      
      const result = await model.generateContent(prompt);
      console.log("4. Received response from Gemini");
      
      const text = result.response.text();
      console.log("5. Extracted text from response");
      
      console.log("6. Sending success response");
      return res.json({ reply: text });
      
    } catch (apiError) {
      console.error('Gemini API Error:', {
        name: apiError.name,
        message: apiError.message,
        stack: apiError.stack,
        response: apiError.response?.data || 'No response data',
        status: apiError.response?.status || 'No status code'
      });

      const safeReply = `I had trouble contacting the AI service just now, but here are some general suggestions:

- Take a moment to notice how you feel physically and emotionally.
- Consider a short walk, stretch, or breathing exercise to reset.
- Reach out to a friend, family member, or professional if you need support.

If anything feels urgent or worrying about your health, please contact a healthcare professional.`;
      return res.json({ reply: safeReply });
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
    
    const genericReply = "Something went wrong while processing your request, but you can try again in a moment. If you have any serious health concerns, please consult a healthcare professional.";
    return res.json({ reply: genericReply });
  }
};
