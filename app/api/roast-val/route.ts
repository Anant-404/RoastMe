import { NextResponse } from "next/server";
import { getValorantStats } from "@/lib/valorant";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { name, tag, region } = await request.json(); // e.g., "TenZ", "001", "na"

  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key missing." }, { status: 500 });
    }

    const data = await getValorantStats(name, tag, region);

    if (!data) {
      return NextResponse.json({ error: "Player not found. Is their profile private?" }, { status: 404 });
    }

    if (!data.matches?.length) {
      return NextResponse.json({ error: "No recent matches to roast." }, { status: 404 });
    }

    // Construct the prompt for Gemini
    const prompt = `
      Roast this Valorant player based on their recent performance.
      
      **Player Data:**
      - **Rank:** ${data.rank} (ELO: ${data.elo})
      - **Recent Matches:**
      ${data.matches.map((m: any) => 
        `- Map: ${m.map}, Agent: ${m.agent}, K/D: ${m.kda}, HS%: ${m.hs_percent}%, Result: ${m.result}`
      ).join('\n')}

      **Roast Instructions:**
      - If they are low rank (Iron-Gold), mock their aim.
      - If they instalock duelists (Jett/Reyna) and go negative, destroy them.
      - Keep it under 100 words. Be toxic but funny (like a typical Valorant teammate).
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const roastText = response.text || "Failed to generate roast.";

    return NextResponse.json({ roast: roastText, data });

  } catch (error) {
    console.error("Valorant roast error:", error);
    return NextResponse.json({ error: "Failed to roast." }, { status: 500 });
  }
}
