import { NextResponse } from "next/server";
import { getSteamData } from "@/lib/steam";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    const { steamInput } = await request.json(); // User input (URL or ID)

    try {
        const data = await getSteamData(steamInput);

        if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (data.error === "PrivateProfile") {
            return NextResponse.json({
                error: "This profile is Private. Tell them to set 'Game Details' to Public!"
            }, { status: 403 });
        }

        // Construct Prompt
        const prompt = `
      Roast this Steam user based on their gaming history.
      
      **User Stats:**
      - **Name:** ${data.username}
      - **Total Wasted Life:** ${data.total_playtime_hours} hours
      - **Pile of Shame (Unplayed games):** ${data.pile_of_shame_count} games bought but never played.
      
      **Top 10 Most Played Games:**
      ${data.top_games.slice(0, 10).map((g: any) => `- ${g.name}: ${g.hours} hours`).join('\n')}

      **Instructions:**
      - Mock them for their top game (especially if it's Dota 2, CS2, or an idle game).
      - Make fun of the money they wasted on unplayed games.
      - If they have over 5000 hours, tell them to touch grass.
      - Keep it under 400 words. Be toxic.
    `;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const roastText = response.text || "Failed to generate roast.";

            return NextResponse.json({ 
            roast: roastText,
        });
    } catch (error) {
        console.error("Steam Roast Error:", error);
        return NextResponse.json({ error: "Failed to roast" }, { status: 500 });
    }
}