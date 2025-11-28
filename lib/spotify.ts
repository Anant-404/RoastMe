const SPOTIFY_ENDPOINT = 'https://api.spotify.com/v1/me';

export async function getRoastData(accessToken: string) {
  // 1. Get Top Artists (Short Term = last 4 weeks)
  // This shows what they are currently obsessed with.
  const topArtistsRes = await fetch(`${SPOTIFY_ENDPOINT}/top/artists?time_range=short_term&limit=5`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 2. Get Recently Played
  // This shows the weird stuff they listened to 10 minutes ago.
  const recentTracksRes = await fetch(`${SPOTIFY_ENDPOINT}/player/recently-played?limit=10`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const topArtists = await topArtistsRes.json();
  const recentTracks = await recentTracksRes.json();

  return {
    topArtists,
    recentTracks
  };
}