export async function getChessData(username: string) {
  try {
    // 1. Get Public Profile
    const profileRes = await fetch(`https://api.chess.com/pub/player/${username}`);
    if (profileRes.status === 404) return null;
    const profile = await profileRes.json();

    // 2. Get Stats
    const statsRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
    const stats = await statsRes.json();

    const rapid = stats.chess_rapid || {};
    const totalGames = (rapid.record?.win || 0) + (rapid.record?.loss || 0) + (rapid.record?.draw || 0);
    const winRate = totalGames > 0 ? Math.round(((rapid.record?.win || 0) / totalGames) * 100) : 0;

    return {
      username: profile.username,
      avatar: profile.avatar,
      rapid_rating: rapid.last?.rating || "Unranked",
      best_rating: rapid.best?.rating || "Unranked",
      win_rate: winRate,
      puzzle_rating: stats.tactics?.highest?.rating || "No brain",
      is_verified: profile.verified || false,
      joined: new Date(profile.joined * 1000).getFullYear(),
    };
  } catch (e) {
    console.error("Chess API Error:", e);
    return null;
  }
}