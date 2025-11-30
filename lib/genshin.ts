import { GENSHIN_CHAR_MAP } from "./genshin_chars";

export async function getGenshinData(uid: string) {
  try {
    console.log(`[Genshin] Fetching data for UID: ${uid}`);

    const res = await fetch(`https://enka.network/api/uid/${uid}`, {
      next: { revalidate: 60 }, // Cache user data for 1 minute
      headers: {
        "User-Agent": "roastme-bot/1.0 (https://github.com/)",
        Accept: "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("[Genshin] UID not found.");
      return null;
    }
    
    if (!res.ok) {
      console.error(`[Genshin] API Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const raw = await res.text();
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("[Genshin] Failed to parse JSON from Enka response.");
      return null;
    }

    const player = data.playerInfo;

    if (!player) return null;

    // Parse the 8 characters currently in their "Showcase"
    const characters = Array.isArray(data.avatarInfoList) ? data.avatarInfoList.map((char: any) => {
      const flatStats = char.fightPropMap;
      const charId = String(char.avatarId);
      
      // Lookup name from our local file
      const name = GENSHIN_CHAR_MAP[charId] || `Unknown (ID: ${charId})`;
      
      return {
        name: name,
        level: char.propMap['4001']?.val || 0, // Prop 4001 is Level
        // Stat keys: 20=CritRate, 22=CritDMG, 2000=MaxHP, 2001=Atk, 2002=Def
        critRate: flatStats['20'] ? (flatStats['20'] * 100).toFixed(1) : "0.0",
        critDmg: flatStats['22'] ? (flatStats['22'] * 100).toFixed(1) : "0.0",
        maxHp: Math.round(flatStats['2000'] || 0),
        atk: Math.round(flatStats['2001'] || 0),
        def: Math.round(flatStats['2002'] || 0),
        er: flatStats['23'] ? (flatStats['23'] * 100).toFixed(1) : "100.0",
      };
    }) : [];

    return {
      nickname: player.nickname,
      level: player.level,
      worldLevel: player.worldLevel,
      signature: player.signature || "No signature",
      achievements: player.finishAchievementNum || 0,
      abyss: player.towerFloorIndex ? `${player.towerFloorIndex}-${player.towerLevelIndex}` : "Has not touched Abyss",
      characters: characters
    };

  } catch (e) {
    console.error("[Genshin] System Error:", e);
    return null;
  }
}
