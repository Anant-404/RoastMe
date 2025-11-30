import { NextResponse } from "next/server";
import { getChessData } from "@/lib/chess";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { username } = await request.json();

  try {
    const data = await getChessData(username);

    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const prompt = `
      Roast this Chess.com player.
      
      Stats:
      - Username: ${data.username}
      - Rapid Rating: ${data.rapid_rating} (Best: ${data.best_rating})
      - Win Rate: ${data.win_rate}%
      - Puzzle Rating: ${data.puzzle_rating}
      - Joined Year: ${data.joined}

      Instructions:
      - If rating < 800, roast them for blundering queens.
      - If puzzle rating is low, tell them they lack vision.
      - If they've been a member for years but rating is low, destroy them.
      - Be toxic but funny. Under 100 words.
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