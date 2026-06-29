// server/routes/aiRoutes.js

const express = require("express");
const rateLimit = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,
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
        maxOutputTokens: 500,
        temperature: 0.4,
      },
    });
    return res.status(200).json({ success: true, content: response.text });
  } catch (error) {
    console.error("🔥 AI Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "AI generation failed",
      error: error.message,
    });
  }
});

module.exports = router;
