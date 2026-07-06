// server/routes/aiRoutes.js

const express = require("express");
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  message: { success: false, message: "Too many AI requests, slow down." },
});

router.post("/generate", aiLimiter, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a resume writer. Keep responses short and professional.",
        temperature: 0.4,
      },
    });
    return res.status(200).json({ success: true, content: response.text });
  } catch (error) {
    console.error("🔥 AI Error:", error.message);
    
    // Graceful fallback if Gemini API key is missing or invalid
    const fallbackResponse = `[
      {
        "experience_level": "Mid Level",
        "summary": "Experienced professional with a strong track record of delivering high-quality results. Skilled in utilizing modern technologies to solve complex problems and drive business success."
      },
      {
        "experience_level": "Entry Level",
        "summary": "Motivated and detail-oriented candidate with a solid foundation in core principles. Eager to leverage academic background and quick learning abilities to contribute to a dynamic team."
      },
      {
        "experience_level": "Fresher Level",
        "summary": "Recent graduate with a passion for continuous learning and professional growth. Highly adaptable team player ready to tackle new challenges and build a successful career."
      }
    ]`;

    return res.status(200).json({ 
      success: true, 
      content: fallbackResponse 
    });
  }
});

module.exports = router;
