import { NextResponse } from "next/server";
import { getGitHubData } from "@/lib/github";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { username } = await request.json();

  try {
    const data = await getGitHubData(username);

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Construct the "Readme" specific part of the prompt
    let readmeRoastInstruction = "";
    if (data.readme_exists) {
      readmeRoastInstruction = `
      **Profile Readme (What they wrote about themselves):** "${data.readme_snippet}..."
      **Instruction:** Read their Readme snippet. If it's full of emojis, badges, or "I'm a passionate developer", mock them for being generic. If it lists 50 technologies they "know", call them a liar.
      `;
    } else {
      readmeRoastInstruction = `
      **Profile Readme:** MISSING.
      **Instruction:** They don't have a Profile Readme (the special username/username repo). Roast them for having a boring, default profile. Tell them they have no personality.
      `;
    }

    // Combine into main prompt
    const prompt = `
      Roast this GitHub user.
      
      **Stats:**
      - Name: ${data.name}
      - Bio: "${data.bio}"
      - Followers: ${data.followers} (Following: ${data.following})
      - Favorite Language: ${data.favorite_language}
      - Total Stars: ${data.total_stars}
      - Last Active: ${data.last_active}
      
      ${readmeRoastInstruction}

      **General Instructions:**
      - If they have many repos but 0 stars, destroy them.
      - If their favorite language is HTML or CSS, tell them they aren't a real coder.
      - Keep it under 100 words. Be toxic and funny.
    `;

    const response  = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const roastText = response.text || "Failed to generate roast.";

    return NextResponse.json({ roast: roastText, data });

  } catch (error) {
    console.error("GitHub Roast Error:", error);
    return NextResponse.json({ error: "Failed to roast" }, { status: 500 });
  }
}