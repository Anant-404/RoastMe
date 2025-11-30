export async function getLeetCodeData(username: string) {
  try {
    // Using the stable community wrapper for LeetCode GraphQL
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    const data = await res.json();

    if (data.status === "error" || data.message === "user does not exist") {
      return null;
    }

    return {
      username: username,
      total_solved: data.totalSolved,
      easy: data.easySolved,
      medium: data.mediumSolved,
      hard: data.hardSolved,
      ranking: data.ranking,
      acceptance_rate: data.acceptanceRate,
      contribution_points: data.contributionPoints
    };
  } catch (e) {
    console.error("LeetCode API Error:", e);
    return null;
  }
}