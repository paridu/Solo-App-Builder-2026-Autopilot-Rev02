
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function brainstormIdea(userIdea: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an Industrial AI Architect specializing in Smart Manufacturing (Industry 4.0).
    Brainstorm and refine this idea: "${userIdea}". 
    Focus on how to solve 7 Waste (TIMWOOD) or 5M1E using AI/ML/DL/RL.
    Explain the impact on OEE (Overall Equipment Effectiveness) and business value.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          refinedName: { type: Type.STRING },
          formula: { type: Type.STRING, description: "X (Industrial Pain) -> Y (AI Solution) -> Z (Factory ROI)" },
          slcBreakdown: { type: Type.STRING },
          marketVerdict: { type: Type.STRING },
          threeDayMvpPlan: {
             type: Type.ARRAY,
             items: { type: Type.STRING }
          }
        },
        required: ["refinedName", "formula", "slcBreakdown", "marketVerdict", "threeDayMvpPlan"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
}

export async function executeAutopilotTask(idea: string, task: string, phase: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are a World-Class Industrial AI Engineer and Smart Factory Architect.
    Project: "${idea}"
    Phase: ${phase}
    Task: ${task}
    
    CRITICAL INSTRUCTIONS:
    1. Output high-quality, PRODUCTION-READY code for industrial environments.
    2. Focus on VERCEL-READY structure with support for IoT Data Ingestion.
    3. Use Industrial Standards (OEE calculation, PLC Bridge logic, Computer Vision snippets).
    4. At the very beginning of your response, specify the "FILE_PATH" for this content if applicable.
    
    Format:
    FILE_PATH: [the/suggested/path/filename.ext]
    ---CONTENT---
    [Your full source code or documentation here]`,
  });

  return response.text;
}

export async function generateSpeech(text: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: `คุณคือหัวหน้าสถาปนิกที่กำลังรายงานสถานะการทำงานของเหล่า AI Agent ในสนามจริง. 
          จงเล่าเรื่องราวว่าตอนนี้ 'Autopilot Agent' กำลังลงมือทำอะไรอยู่สำหรับงาน: ${text}. 
          เช่น 'ตอนนี้ Agent ฝ่ายโครงสร้างกำลังวางสายไฟดิจิทัลและเชื่อมต่อฐานข้อมูล OEE เพื่อให้โรงงานของคุณมีหัวใจที่เต้นเป็นจังหวะข้อมูล...' 
          เน้นความตื่นเต้น เห็นภาพความเคลื่อนไหวของหุ่นยนต์และอัลกอริทึม เป็นภาษาไทยที่น่าฟังและต่อเนื่อง (ความยาว 2-3 ประโยค)` 
        }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return {
      audio: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data,
      text: response.text // เก็บข้อความที่บรรยายไว้แสดงบน UI ด้วย
    };
  } catch (error) {
    console.error("TTS generation failed", error);
    return null;
  }
}
