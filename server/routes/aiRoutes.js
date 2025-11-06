// server/routes/aiRoutes.js

const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",   // ✅ Free model
        messages: [
          { role: "system", content: "You are a resume writer. Keep response short and professional." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.4,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      content: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("🔥 AI Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "AI generation failed",
      error: error.message,
    });
  }
});

module.exports = router;
