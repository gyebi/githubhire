export async function fetchUserRepos(username) {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const response = await fetch(url);
  return await response.json();
}

export function extractLanguagesFromRepos(repos) {
  const set = new Set();
  repos.forEach(r => r.language && set.add(r.language));
  return Array.from(set);
}

export async function buildCandidateSignals(user) {
  const profileRes = await fetch(`https://api.github.com/users/${user.login}`);
  const profile = await profileRes.json();

  const repos = await fetchUserRepos(user.login);

  return {
    username: user.login,
    accountAgeYears: calculateAccountAgeYears(profile.created_at),
    publicRepos: profile.public_repos,
    followers: profile.followers,
    languages: extractLanguagesFromRepos(repos),
    lastUpdated: repos[0]?.pushed_at || null
  };
}

function calculateAccountAgeYears(createdAt) {
  return Math.floor(
    (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 365)
  );
}


/* 
export async function fetchUserRepos(username) {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch repos for", username, error);
    return [];
  }
}

function extractLanguagesFromRepos(repos) {
  const languageSet = new Set();

  repos.forEach(repo => {
    if (repo.language) languageSet.add(repo.language);
  });

  return Array.from(languageSet);
}
 


 export async function buildCandidateSignals(user) {
  // Fetch full profile
  const profileResponse = await fetch(
    `https://api.github.com/users/${user.login}`
  );
  const profile = await profileResponse.json();

   //const signals = [];

  //for (const user of users) {
    console.log("Processing user:", user.login);

  // Fetch repos
  const repos = await fetchUserRepos(user.login);

  const candidateSignals = {
    username: user.login,
    accountAgeYears: calculateAccountAgeYears(profile.created_at),
    publicRepos: profile.public_repos,
    followers: profile.followers,
    languages: extractLanguagesFromRepos(repos),
    lastUpdated: repos[0]?.pushed_at || null
  };

  return candidateSignals;
  }


function calculateAccountAgeYears(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffMs = now - createdDate;
  const years = diffMs / (1000 * 60 * 60 * 24 * 365);

  return Math.floor(years);
}

*/