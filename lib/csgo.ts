const STEAM_KEY = process.env.STEAM_API_KEY;

export async function getCSGOData(steamIdInput: string) {
  try {
    // 1. Resolve Vanity URL if needed (e.g. "shroud")
    let steamId = steamIdInput;
    if (isNaN(Number(steamId))) {
      const resolveRes = await fetch(
        `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_KEY}&vanityurl=${steamId}`
      );
      const resolveData = await resolveRes.json();
      if (resolveData.response.success !== 1) return null;
      steamId = resolveData.response.steamid;
    }

    // 2. Fetch User Stats for CS:GO (App ID: 730)
    const statsRes = await fetch(
      `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${STEAM_KEY}&steamid=${steamId}`
    );
    
    if (statsRes.status === 403) return { error: "PrivateProfile" };
    if (statsRes.status !== 200) return null;

    const data = await statsRes.json();
    const stats = data.playerstats.stats;

    // Helper to find stat value
    const getStat = (name: string) => stats.find((s: any) => s.name === name)?.value || 0;

    const kills = getStat('total_kills');
    const deaths = getStat('total_deaths');
    const timePlayed = Math.round(getStat('total_time_played') / 3600);
    const wins = getStat('total_wins');
    const headshots = getStat('total_kills_headshot');
    
    const kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills;
    const hsPercentage = kills > 0 ? Math.round((headshots / kills) * 100) : 0;

    return {
      username: steamId, // We could fetch real name with GetPlayerSummaries if we wanted
      hours: timePlayed,
      kd: kd,
      wins: wins,
      hs_percent: hsPercentage,
      shots_fired: getStat('total_shots_fired'),
      shots_hit: getStat('total_shots_hit')
    };

  } catch (e) {
    console.error("CSGO API Error:", e);
    return null;
  }
}