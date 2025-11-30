import { NextResponse } from "next/server";
import { getGenshinData } from "@/lib/genshin";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  const { uid } = await request.json();

  try {
    const data = await getGenshinData(uid);

    if (!data) return NextResponse.json({ error: "UID not found or private." }, { status: 404 });

    const charDetails = data.characters.map((c: any) => 
      `- ${c.name} (Lv ${c.level}): Crit Rate ${c.critRate}%, Crit DMG ${c.critDmg}%`
    ).join("\n");

    const prompt = `
      Roast this Genshin Impact player.
      
      Profile:
      - Name: ${data.nickname} (AR ${data.level})
      - Abyss Progress: ${data.abyss}
      - Signature: "${data.signature}"
      
      Showcase Characters:
      ${charDetails}

      Instructions:
      - If they haven't cleared Abyss 12-3, call them casual.
      - Roast their "Crit Ratio" (ideally 1:2). If they have 5% Crit Rate, destroy them.
      - Mock their character choices if they aren't meta.
      - Be funny, anime-style insults allowed. Under 100 words.
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