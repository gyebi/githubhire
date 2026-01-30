// githubApi.js
//or remove this import if fetchUserRepos is in the same file

export async function buildCandidateSignals(user) {
  if (!user || !user.login) {
    console.warn("Invalid user passed to buildCandidateSignals:", user);
    return null;
  }

  try {
    // 1. Fetch full GitHub profile
    const profileResponse = await fetch(
      `https://api.github.com/users/${user.login}`
    );
    const profile = await profileResponse.json();

    // 2. Fetch repositories
    const repos = await fetchUserRepos(user.login);

    // 3. Extract languages from repos
    const languagesSet = new Set();
    repos.forEach(repo => {
      if (repo.language) {
        languagesSet.add(repo.language);
      }
    });

    // 4. Calculate account age
    const createdYear = new Date(profile.created_at).getFullYear();
    const currentYear = new Date().getFullYear();
    const accountAgeYears = currentYear - createdYear;

    // 5. Build candidate signal object
    return {
      username: user.login,
      profileUrl: profile.html_url,
      avatar: profile.avatar_url,
      accountAgeYears,
      publicRepos: profile.public_repos || 0,
      followers: profile.followers || 0,
      languages: Array.from(languagesSet),
      lastRepoUpdate: repos[0]?.pushed_at || null
    };

  } catch (error) {
    console.error("Error building signals for:", user.login, error);
    return null;
  }
}



export async function fetchUserRepos(username) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!res.ok) {
      console.warn(`Repos fetch failed for ${username}`, res.status);
      return []; // 🔑 ALWAYS return array
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (err) {
    console.error(`Repo fetch error for ${username}`, err);
    return []; // 🔑 ALWAYS return array
  }
}



export function extractLanguagesFromRepos(repos) {
  const languageSet = new Set();

  repos.forEach(repo => {repo.language && 
    languageSet.add(repo.language)
});

  return Array.from(languageSet);

}

export async function enrichUserWithLanguages(user) {
  const repos = await fetchUserRepos(user.login); // ← comes from humanUsers
  const languages = extractLanguagesFromRepos(repos);

  return {
    ...user,
    languages
  };
}
