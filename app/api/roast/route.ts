import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getRoastData } from "@/lib/spotify";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch real data from Spotify
    const { topArtists, recentTracks } = await getRoastData(session.accessToken);

    // 2. Format data for the AI prompt
    const artistNames = topArtists.items.map((artist: any) => artist.name).join(", ");
    const trackNames = recentTracks.items.map((item: any) => item.track.name).join(", ");

    // 3. Construct the Roast Prompt
    const prompt = `
      You are a mean, sarcastic, and funny music critic. 
      Roast this user based on their Spotify listening history.
      
      Here is their data:
      - **Obsessions (Top Artists):** ${artistNames}
      - **Recently Caught Listening To:** ${trackNames}

      **Instructions:**
      - Be brutal but entertaining.
      - Make specific references to the artists they listen to.
      - Keep it under 100 words.
      - Don't hold back.
    `;

    // 4. Call Gemini
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const roastText = response.text || "Failed to generate roast.";

    return NextResponse.json({ 
      roast: roastText,
    });

  } catch (error) {
    console.error("Roast Error:", error);
    return NextResponse.json({ error: "Failed to generate roast" }, { status: 500 });
  }
}