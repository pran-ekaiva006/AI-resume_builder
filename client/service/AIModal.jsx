// import axios from "axios";

// const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
// const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// const MODEL = "cognitivecomputations/dolphin3.0-r1-mistral-24b:free";

// export const AIchatSession = {
//   sendMessage: async (prompt, { format = "html" } = {}) => {
//     try {
//       const isJsonRequest = format === "json";

//       const systemPrompt = isJsonRequest
//         ? "You are an API that responds ONLY with a raw JSON array like [\"item1\", \"item2\"]. Do NOT use markdown, HTML, or comments. No ```json or explanations. Only the JSON array."
//         : "You are an AI assistant that generates resume bullet points in clean HTML using <ul><li> tags. Do not return JSON or markdown.";

//       const response = await axios.post(
//         OPENROUTER_API_URL,
//         {
//           model: MODEL,
//           messages: [
//             {
//               role: "system",
//               content: systemPrompt
//             },
//             {
//               role: "user",
//               content: prompt
//             }
//           ],
//           max_tokens: 1024,
//           temperature: 0.3,
//         },
//         {
//           headers: {
//             "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//             "HTTP-Referer": window.location.origin,
//             "X-Title": "AI Resume Builder"
//           }
//         }
//       );

//       let content = response.data?.choices?.[0]?.message?.content || "";
//       content = content.trim();

//       if (isJsonRequest) {
//         content = content.replace(/```json\n?|```/g, "").trim();

//         const jsonMatch = content.match(/$begin:math:display$[\\s\\S]*$end:math:display$/);
//         if (jsonMatch) {
//           content = jsonMatch[0];
//         }

//         try {
//           JSON.parse(content);
//         } catch (err) {
//           console.error("⚠️ JSON parse failed — raw content:", content);
//           throw new Error("AI did not return valid JSON. Try again.");
//         }
//       } else {
//         content = content
//           .replace(/```html\n?|\n?```/g, "")
//           .replace(/```/g, "")
//           .trim();

//         if (!content.startsWith("<ul>")) {
//           content = `<ul>${content
//             .split('\n')
//             .filter(line => line.trim())
//             .map(line => `<li>${line.trim().replace(/^[•\-\*]\s*/, '')}</li>`)
//             .join('')}</ul>`;
//         }
//       }

//       return {
//         response: {
//           text: async () => content
//         }
//       };

//     } catch (error) {
//       const raw = error.response?.data || error.message;
//       console.error("🔥 AI API Error:", raw);
//       throw new Error("Failed to generate content from AI.");
//     }
//   }
// };