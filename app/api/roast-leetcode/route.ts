import { NextResponse } from "next/server";
import { getLeetCodeData } from "@/lib/leetcode";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { username } = await request.json();

  try {
    const data = await getLeetCodeData(username);
    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const prompt = `
      Roast this LeetCode user.
      
      Stats:
      - Solved: ${data.total_solved} (Easy: ${data.easy}, Medium: ${data.medium}, Hard: ${data.hard})
      - Acceptance Rate: ${data.acceptance_rate}%
      - Ranking: ${data.ranking}

      Instructions:
      - If they only solve Easy problems, call them a "Hello World developer".
      - If acceptance rate is low, mock their buggy code.
      - If total solved is low, tell them they'll never pass a FAANG interview.
      - Be mean. Under 100 words.
    `;

    const response  = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const roastText = response.text || "Failed to generate roast.";

    return NextResponse.json({ roast: roastText, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to roast" }, { status: 500 });
  }
}