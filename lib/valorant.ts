const BASE_URL = 'https://api.henrikdev.xyz/valorant';

export async function getValorantStats(name: string, tag: string, region: string = 'na') {
  // 1. Fetch Account MMR (Rank)
  const safeName = encodeURIComponent(name);
  const safeTag = encodeURIComponent(tag);

  const mmrRes = await fetch(`${BASE_URL}/v1/mmr/${region}/${safeName}/${safeTag}`, {
    headers: { 'Authorization': process.env.VALORANT_API_KEY! },
    cache: 'no-store', // avoid oversized Next data cache write
  });

  // 2. Fetch Last 5 Matches
  const matchRes = await fetch(`${BASE_URL}/v3/matches/${region}/${safeName}/${safeTag}?size=5`, {
    headers: { 'Authorization': process.env.VALORANT_API_KEY! },
    cache: 'no-store', // avoid oversized Next data cache write
  });

  if (!mmrRes.ok || !matchRes.ok) {
    return null;
  }

  const mmrData = await mmrRes.json();
  const matchData = await matchRes.json();

  if (matchData.status !== 200 || !Array.isArray(matchData.data) || matchData.data.length === 0) {
    return null; // Player not found or private
  }

  return {
    rank: mmrData.data?.currenttierpatched || "Unranked",
    elo: mmrData.data?.elo || 0,
    matches: matchData.data.map((match: any) => {
      // Find the player in the match to get their specific stats
      const player = match.players.all_players.find(
        (p: any) => p.name.toLowerCase() === name.toLowerCase() && 
                   p.tag.toLowerCase() === tag.toLowerCase()
      );
      const hsDenominator = (player?.stats.headshots || 0) + (player?.stats.bodyshots || 0) + (player?.stats.legshots || 0);
      const isRedTeam = Array.isArray(match.teams?.red?.players) && match.teams.red.players.some(
        (p: any) => p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase()
      );
      const didRedWin = match.teams?.red?.has_won ?? false;
      const didBlueWin = match.teams?.blue?.has_won ?? false;
      const result = isRedTeam ? (didRedWin ? "Win" : "Loss") : didBlueWin ? "Win" : "Loss";
      return {
        agent: player?.character || "Unknown",
        kda: `${player?.stats.kills}/${player?.stats.deaths}/${player?.stats.assists}`,
        hs_percent: hsDenominator > 0 ? Math.round((player?.stats.headshots / hsDenominator) * 100) : 0,
        result,
        map: match.metadata.map
      };
    })
  };
}
