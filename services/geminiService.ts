import { GoogleGenAI, Type } from "@google/genai";
import { ActionItem, AgentPrompts, Email } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    // In a real app, handle this gracefully.
  }
  return new GoogleGenAI({ apiKey: apiKey! });
};

/**
 * Categorizes an email using Gemini Flash 2.5
 */
export const categorizeEmail = async (email: Email, prompt: string) => {
  const ai = getAI();
  const fullPrompt = `
    ${prompt}
    
    Subject: ${email.subject}
    From: ${email.fromName} <${email.fromEmail}>
    Body:
    ${email.body}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          },
          required: ['category', 'priority'],
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : { category: 'Uncategorized', priority: 'Low' };
  } catch (error) {
    console.error("Categorization failed", error);
    return { category: 'Error', priority: 'Low' };
  }
};

/**
 * Extracts action items
 */
export const extractActionItems = async (email: Email, prompt: string): Promise<ActionItem[]> => {
  const ai = getAI();
  const fullPrompt = `
    ${prompt}
    
    Email Content:
    ${email.body}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              dueDate: { type: Type.STRING, description: "ISO date or relative time description like 'Wednesday EOD'" },
              status: { type: Type.STRING, enum: ['pending', 'completed'] }
            },
            required: ['task', 'status']
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Action extraction failed", error);
    return [];
  }
};

/**
 * Drafts a reply
 */
export const draftReply = async (email: Email, prompt: string, extraContext?: string) => {
  const ai = getAI();
  const fullPrompt = `
    ${prompt}
    ${extraContext ? `Additional User Instruction: ${extraContext}` : ''}

    Original Email:
    From: ${email.fromName}
    Subject: ${email.subject}
    Body:
    ${email.body}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed in drafting
      contents: fullPrompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Drafting failed", error);
    return "Error generating draft.";
  }
};

/**
 * Chat with Email Context
 */
export const chatWithAgent = async (
  history: { role: string, parts: { text: string }[] }[],
  userMessage: string,
  currentEmail: Email | null,
  systemPersona: string
) => {
  const ai = getAI();
  
  // Inject current email context into the system instruction or first message if possible
  // For chat, we pass context in system instruction usually, or as part of the prompt.
  let contextString = "";
  if (currentEmail) {
    contextString = `
      CURRENT EMAIL CONTEXT:
      Subject: ${currentEmail.subject}
      From: ${currentEmail.fromName}
      Body: ${currentEmail.body}
    `;
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `${systemPersona}\n\n${contextString}`,
    },
    history: history,
  });

  const response = await chat.sendMessageStream({ message: userMessage });
  return response;
};
