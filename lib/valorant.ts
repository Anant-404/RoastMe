const BASE_URL = 'https://api.henrikdev.xyz/valorant';

export async function getValorantStats(name: string, tag: string, inputRegion: string = 'na') {
  console.log(`\n--- [VALORANT API START] Looking for: ${name}#${tag} ---`);

  try {
    const safeName = encodeURIComponent(name.trim());
    const safeTag = encodeURIComponent(tag.trim());

    // ---------------------------------------------------------
    // STEP 1: Auto-Detect Region (Fixes the "Player Not Found" issue)
    // ---------------------------------------------------------
    // We ignore the 'inputRegion' initially and ask the API: "Where is this user?"
    const accountUrl = `${BASE_URL}/v1/account/${safeName}/${safeTag}`;
    console.log(`[LOG] Checking Account: ${accountUrl}`);
    
    const accountRes = await fetch(accountUrl, {
      headers: { 'Authorization': process.env.VALORANT_API_KEY! },
      cache: 'no-store',
    });

    const accountData = await accountRes.json();

    if (accountData.status !== 200) {
      console.error(`[ERROR] Account lookup failed. Status: ${accountData.status}`, accountData);
      return null; // Player definitely doesn't exist
    }

    // THIS IS THE KEY FIX: Use the region the API tells us, not what the user guessed.
    const realRegion = accountData.data.region;
    console.log(`[SUCCESS] Found User! Real Region: ${realRegion.toUpperCase()} (Input was: ${inputRegion})`);

    // ---------------------------------------------------------
    // STEP 2: Fetch Rank & Matches using the REAL Region
    // ---------------------------------------------------------
    const mmrRes = await fetch(`${BASE_URL}/v1/mmr/${realRegion}/${safeName}/${safeTag}`, {
      headers: { 'Authorization': process.env.VALORANT_API_KEY! },
      cache: 'no-store', 
    });

    const matchRes = await fetch(`${BASE_URL}/v3/matches/${realRegion}/${safeName}/${safeTag}?size=5`, {
      headers: { 'Authorization': process.env.VALORANT_API_KEY! },
      cache: 'no-store', 
    });

    if (!mmrRes.ok || !matchRes.ok) {
      console.error(`[ERROR] Fetch failed. MMR Status: ${mmrRes.status}, Match Status: ${matchRes.status}`);
      return null;
    }

    const mmrData = await mmrRes.json();
    const matchData = await matchRes.json();

    // ---------------------------------------------------------
    // STEP 3: Process Matches with Crash Protection
    // ---------------------------------------------------------
    if (matchData.status !== 200 || !Array.isArray(matchData.data) || matchData.data.length === 0) {
      console.warn(`[WARN] No match history found.`);
      return null; 
    }

    const safeMatches = matchData.data.map((match: any, index: number) => {
      // GUARD CLAUSE: If match is corrupted, skip it immediately
      if (!match.metadata || !match.players || !match.players.all_players) {
        console.warn(`[WARN] Skipping Match #${index + 1} (Corrupted Data/Deathmatch)`);
        return null;
      }

      // Find the player
      const player = match.players.all_players.find(
        (p: any) => p.name.toLowerCase() === name.toLowerCase() && 
                   p.tag.toLowerCase() === tag.toLowerCase()
      );

      if (!player) {
        console.warn(`[WARN] Player not found in Match #${index + 1} (Bug?)`);
        return null;
      }

      const hsDenominator = (player.stats.headshots || 0) + (player.stats.bodyshots || 0) + (player.stats.legshots || 0);
      
      // Determine Win/Loss safely
      const teamColor = player.team?.toLowerCase(); // 'Red' or 'Blue'
      const winningTeam = match.metadata.teams?.red?.has_won ? 'red' : 'blue';
      const result = teamColor === winningTeam ? "Win" : "Loss";

      return {
        agent: player.character || "Unknown",
        kda: `${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}`,
        hs_percent: hsDenominator > 0 ? Math.round((player.stats.headshots / hsDenominator) * 100) : 0,
        result: result,
        map: match.metadata.map
      };
    }).filter((m: any) => m !== null); // Clean up the nulls

    console.log(`[SUCCESS] Processed ${safeMatches.length} valid matches.`);

    return {
      rank: mmrData.data?.currenttierpatched || "Unranked",
      elo: mmrData.data?.elo || 0,
      matches: safeMatches
    };

  } catch (error) {
    console.error("[CRITICAL ERROR] in getValorantStats:", error);
    return null;
  }
}