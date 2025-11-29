const STEAM_KEY = process.env.STEAM_API_KEY;

export async function getSteamData(input: string) {
    // 1. Resolve the Steam ID (Handle URLs or raw IDs)
    let steamId = input;

    // If user pasted a full URL, extract the ID or Username
    if (input.includes("steamcommunity.com")) {
        const urlParts = input.split('/');
        const idIndex = urlParts.indexOf('id');
        const profilesIndex = urlParts.indexOf('profiles');

        if (idIndex !== -1) steamId = urlParts[idIndex + 1]; // It's a custom name (e.g. /id/shroud)
        else if (profilesIndex !== -1) steamId = urlParts[profilesIndex + 1]; // It's already an ID (e.g. /profiles/7656...)
    }

    // If it's not a number, it's a "Vanity URL", so we must resolve it
    if (isNaN(Number(steamId))) {
        const resolveRes = await fetch(
            `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_KEY}&vanityurl=${steamId}`
        );
        const resolveData = await resolveRes.json();

        if (resolveData.response.success !== 1) {
            return null; // User not found
        }
        steamId = resolveData.response.steamid;
    }

    // 2. Fetch Player Summary (Avatar, Name)
    const summaryRes = await fetch(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamId}`
    );
    const summaryData = await summaryRes.json();
    const player = summaryData.response.players[0];

    // 3. Fetch Owned Games (The Roast Material)
    const gamesRes = await fetch(
        `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`
    );
    const gamesData = await gamesRes.json();

    // If game_count is undefined, their profile is PRIVATE
    if (!gamesData.response || !gamesData.response.game_count) {
        return { error: "PrivateProfile" };
    }

    // Sort games by playtime (descending)
    const sortedGames = gamesData.response.games.sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);

    return {
        username: player.personaname,
        avatar: player.avatarfull,
        total_playtime_hours: Math.round(sortedGames.reduce((acc: number, game: any) => acc + game.playtime_forever, 0) / 60),
        top_games: sortedGames.slice(0, 10).map((g: any) => ({
            name: g.name,
            hours: Math.round(g.playtime_forever / 60)
        })),
        // Pile of shame: Games they own but never played (playtime < 10 mins)
        pile_of_shame_count: gamesData.response.games.filter((g: any) => g.playtime_forever < 10).length
    };
}