// Base URLs for different APIs
export const API_CONFIG = {
  // Groq API Configuration (Primary)
  GROQ_API_URL: import.meta.env.VITE_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions",
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || "",
  
  // Google Gemini API Configuration (backup)
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",
  
  // OpenAI API Configuration (backup)
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "",
  
  MODEL: "llama-3.3-70b-versatile",
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.3
};

