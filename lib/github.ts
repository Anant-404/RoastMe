export async function getGitHubData(username: string) {
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  // 1. Fetch Profile & Repos (Parallel for speed)
  const [userRes, repoRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers }),
    // This Fetch is special: It asks for the "Profile Readme" specifically
    fetch(`https://api.github.com/repos/${username}/${username}/readme`, {
      headers: { 
        ...headers, 
        // THIS HEADER IS MAGIC: It tells GitHub "Just give me the raw text, don't give me JSON"
        Accept: "application/vnd.github.raw" 
      }
    })
  ]);

  if (!userRes.ok) return null; // User not found

  const user = await userRes.json();
  const repos = await repoRes.json();
  
  // Check if README exists (200 OK) or not (404 Not Found)
  let readmeContent = null;
  if (readmeRes.ok) {
    const text = await readmeRes.text();
    // Cut it to 500 chars so we don't blow up the AI token limit
    readmeContent = text.slice(0, 500).replace(/(\r\n|\n|\r)/gm, " "); 
  }

  // Calculate Roast Stats (Same as before)
  const languages: Record<string, number> = {};
  let totalStars = 0;
  let lastActive = "Never";

  repos.forEach((repo: any) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
    totalStars += repo.stargazers_count;
  });

  const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const favoriteLanguage = sortedLanguages.length > 0 ? sortedLanguages[0][0] : "Unknown";

  if (repos.length > 0) {
    lastActive = new Date(repos[0].updated_at).toLocaleDateString();
  }

  return {
    name: user.name || user.login,
    bio: user.bio || "No bio",
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    company: user.company || "Unemployed",
    location: user.location || "Earth",
    favorite_language: favoriteLanguage,
    total_stars: totalStars,
    last_active: lastActive,
    repo_names: repos.slice(0, 3).map((r: any) => r.name),
    // NEW: Pass the readme status
    readme_exists: !!readmeContent,
    readme_snippet: readmeContent || "None"
  };
}