import { NextResponse } from "next/server";
import { getCSGOData } from "@/lib/csgo";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { steamId } = await request.json();

  try {
    const data = await getCSGOData(steamId);
    
    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (data.error === "PrivateProfile") return NextResponse.json({ error: "Private Profile" }, { status: 403 });

    const prompt = `
      Roast this CS:GO/CS2 player.
      
      Stats:
      - Hours Played: ${data.hours}
      - K/D Ratio: ${data.kd}
      - Headshot %: ${data.hs_percent}%
      - Total Wins: ${data.wins}
      - Accuracy: ${Math.round((data.shots_hit / data.shots_fired) * 100)}%

      Instructions:
      - If K/D < 1.0, tell them they are getting carried.
      - If HS% is low, tell them to aim for the head, not the toes.
      - If they have thousands of hours but bad stats, roast their wasted life.
      - Be aggressive (like a CS lobby). Under 100 words.
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