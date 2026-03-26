import axios from 'axios';

const MODEL = "gpt-4o-mini";

export const callOpenAI = async (messages: { role: string, content: string }[]) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing. Please check your .env file.");
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional medical assistant. Provide accurate, helpful, and empathetic medical advice. Always recommend consulting a healthcare professional for diagnosis and treatment. Focus on health, symptoms, and potential causes based on medical knowledge."
          },
          ...messages
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Failed to get AI response");
  }
};
