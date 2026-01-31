console.log("Script loaded");

import { fetchUserRepos, enrichUserWithLanguages } from "./githubApi.js";
//import { buildAllCandidateSignals } from "./githubApi.js";


//score weights 
const score_weights = {
  languageMatch: 40,
  frameworkMatch: 25,
  experience: 20,
  activity: 15
};


//countries of the world 

export const countries = [
  { name: "Afghanistan", code: "AF" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "Andorra", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bolivia", code: "BO" },
  { name: "Botswana", code: "BW" },
  { name: "Brazil", code: "BR" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Costa Rica", code: "CR" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Greece", code: "GR" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Ireland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Japan", code: "JP" },
  { name: "Kenya", code: "KE" },
  { name: "Luxembourg", code: "LU" },
  { name: "Malaysia", code: "MY" },
  { name: "Mexico", code: "MX" },
  { name: "Morocco", code: "MA" },
  { name: "Netherlands", code: "NL" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nigeria", code: "NG" },
  { name: "Norway", code: "NO" },
  { name: "Pakistan", code: "PK" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Singapore", code: "SG" },
  { name: "South Africa", code: "ZA" },
  { name: "South Korea", code: "KR" },
  { name: "Spain", code: "ES" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Tanzania", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Turkey", code: "TR" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" }
];





//well known frameworks 
const known_frameworks = [
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "Spring",
  "Laravel"
];

const known_languages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart"
];





//const searchBtn = document.getElementById("searchBtn");

// Inputs

const countryInput = document.getElementById("country");
const suggestionsBox = document.getElementById("countrySuggestions");
const countryError = document.getElementById("countryError");


let selectedCountry = null;

countryInput.addEventListener("input", () => {
  const value = countryInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";
  selectedCountry = null;

  if (!value) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  const matches = countries.filter(c =>
    c.name.toLowerCase().startsWith(value)
  );

  if (matches.length === 0) {
    suggestionsBox.classList.add("hidden");
    return;
  }

  matches.forEach(country => {
    const li = document.createElement("li");
    li.textContent = country.name;

    li.addEventListener("click", () => {
      countryInput.value = country.name;
      selectedCountry = country.name;
      suggestionsBox.classList.add("hidden");
      countryError.classList.add("hidden");
    });

    suggestionsBox.appendChild(li);
  });

  suggestionsBox.classList.remove("hidden");
});

/*
function validateCountry() {
  if (!selectedCountry) {
    countryError.classList.remove("hidden");
    return false;
  }
  return true;
}

searchBtn.addEventListener("click", () => {
  if (!validateCountry()) return;

  console.log("Searching for country:", selectedCountry);
  // proceed with GitHub search
});
*/

const languageInput = document.getElementById("language");
const recordsInput = document.getElementById("num-records");
//const searchInput = document.getElementById("q");

//const resultsGrid = document.querySelector(".results-grid");

const getUserBtn = document.getElementById("gitUser");
const resultsDiv = document.getElementById("results");
const loadMore = document.getElementById("loadMore");

let currentPage = 1; 

async function handleSearch(isLoadMore = false) {
  
    //controls pagination
    if(!isLoadMore){
        currentPage = 1;
        resultsDiv.innerHTML = "";
    }

  
    // 1. Read values from UI
   const country = countryInput.value.trim();
   const language = languageInput.value.trim();
   const results_per_page = Number(recordsInput.value);
  
  //const keyword = searchInput.value.trim();


  // 2. Build GitHub search query
  let queryParts = [];

  /*
  if (keyword) {
    queryParts.push(keyword);
  }
*/
  if (language) {
    queryParts.push(`language:${language}`);
  }

  if (country) {
    queryParts.push(`location:${country}`);
  }

  const query = queryParts.join(" ");
  //const query = `language:${language} location:${country}`;

  console.log("Final GitHub query:", query);

  // 3. Call GitHub API
  const url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${results_per_page}&page=${currentPage}`;

  console.log("Request URL:", url);

  //resultsGrid.innerHTML = "";

//resultsDiv.innerHTML= "";

 
    const response = await fetch(url);
    const data = await response.json();

    console.log("GitHub search results:", data);
    console.log("First user:", data.items[0]);
   
    
   // renderCandidates(data.items);
   const allUsers = data.items || []; 
   const humanUsers = allUsers.filter(user => user.type === "User");
   
   

 const enrichedUsers = await Promise.all(
  humanUsers.map(user => enrichUser(user))
);

    console.log(enrichedUsers[0].languages);
    console.log(enrichedUsers[0].frameworks);
/*
const enrichedUsers = await Promise.all(
  humanUsers.map(user => enrichUserWithFrameworks(user))
);
*/

let currentUsers = enrichedUsers; 

  // Collect checked languages
  const selectedLanguage = Array.from(
    document.querySelectorAll(
      '.job-panel input[type="checkbox"]:checked'
    )
  )
  /*
    .filter(cb =>
      ["JavaScript", "Python", "Java", "Kotlin", "PHP", "Go"].includes(cb.value)
    )
      */
    .map(cb => cb.value);

  // Collect checked frameworks
  const selectedFramework = Array.from(
    document.querySelectorAll(
      '.job-panel input[type="checkbox"]:checked'
    )
  )
  /*
    .filter(cb =>
      ["React", "Node", "Django", "Spring", "Android", "Firebase"].includes(cb.value)
    )*/
    .map(cb => cb.value);


//const selectedLanguage = "TypeScript"; // temporary hardcoded for now

if (selectedLanguage) {
  currentUsers = currentUsers.filter(user =>
    user.languages.includes(selectedLanguage)
  );
}

//const selectedFramework = "React"; // temporary hardcoded for now

if (selectedFramework) {
  currentUsers = currentUsers.filter(user =>
    user.frameworks.includes(selectedFramework)
  );
}



async function enrichUser(user) {
  const repos = await fetchUserRepos(user.login);

  const languages = extractLanguagesFromRepos(repos);
  const frameworks = extractFrameworksFromRepos(repos);
  const repoCount = repos.length;
  const lastActiveAt = getLastActivityDate(repos)

  return {
    ...user,
    languages,     // ✅ always exists
    frameworks,     // ✅ always exists
    repoCount, 
    lastActiveAt
  };
}

const scoredUsers = enrichedUsers.map(user => ({
  ...user,
  totalScore: calculateTotalScore(user, selectedLanguages, selectedFrameworks)
}));

const rankedUsers = scoredUsers.sort((a, b) => b.totalScore - a.totalScore);

console.log("enrichedUsers ready:", enrichedUsers.length);

//console.log(enrichedUsers)
//console.log(enrichedUsers[0]);

console.table(
  scoredUsers.map(u => ({
    user: u.login,
    repoCount: u.repoCount,
    experienceScore: calculateExperienceScore(u),
    total: u.totalScore
  }))
);

//console.log(rankedUsers.map(u => ({ user: u.login, totalScore: u.totalScore })));

renderUsers(rankedUsers);

}

function renderUsers(users) {
  resultsDiv.innerHTML = "";

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <div class="card-header">
        <img src="${user.avatar_url}" alt="${user.login}" />
        <div>
          <h3>${user.login}</h3>
          <span class="score-badge">Ranking: ${user.totalScore}</span>
        </div>
      </div>

      <div class="card-section">
        <strong>Languages:</strong>
        <div class="pill-group">
          ${user.languages.map(l => `<span class="pill">${l}</span>`).join("")}
        </div>
      </div>

      <div class="card-section">
        <strong>Frameworks:</strong>
        <div class="pill-group">
          ${user.frameworks.map(f => `<span class="pill framework">${f}</span>`).join("")}
        </div>
      </div>

      <div class="card-meta">
        <span>📦 Repos: ${user.repoCount}</span>
        <span>⏱ Last active: ${formatDate(user.lastActiveAt)}</span>
      </div>

      <a class="profile-link" href="${user.html_url}" target="_blank">
        View GitHub →
      </a>
    `;

    resultsDiv.appendChild(card);
  });
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
}

function extractFrameworksFromRepos(repos) {
  const frameworkSet = new Set();

  repos.forEach(repo => {
    const searchableText = `
      ${repo.name || ""}
      ${repo.description || ""}
      ${(repo.topics || []).join(" ")}
    `.toLowerCase();

    known_frameworks.forEach(framework => {
      if (searchableText.includes(framework.toLowerCase())) {
        frameworkSet.add(framework);
      }
    });
  });

  return Array.from(frameworkSet);
}


function extractLanguagesFromRepos(repos) {
  const languageSet = new Set();

  repos.forEach(repo => {
    if (!repo.language) return;

    known_languages.forEach(lang => {
      if (repo.language.toLowerCase() === lang.toLowerCase()) {
        languageSet.add(lang);
      }
    });
  });

  return Array.from(languageSet);
}


//handleSearch();
getUserBtn.addEventListener("click", () => handleSearch(false));

loadMore.addEventListener("click", () =>{

    currentPage++;
    handleSearch(true);

})



// scoring ...checkboxes  

const selectedLanguages = ["JavaScript", "TypeScript"];
const selectedFrameworks = ["React"];


//languages
function calculateLanguageScore(user, selectedLanguages) {
  if (!selectedLanguages.length) return 0;

  const matches = selectedLanguages.filter(lang =>
    user.languages.includes(lang)
  );

  return (matches.length / selectedLanguages.length) * score_weights.languageMatch;
}


//frameworks 
function calculateFrameworkScore(user, selectedFrameworks) {
  if (!selectedFrameworks.length) return 0;

  const matches = selectedFrameworks.filter(fw =>
    user.frameworks.includes(fw)
  );

  return (matches.length / selectedFrameworks.length) * score_weights.frameworkMatch;
}


function calculateExperienceScore(user) {
  const repoCount =
  user.public_repos ??
  user.repoCount ??
  0;

  if (repoCount >= 11) return score_weights.experience;
  if (repoCount >= 6) return score_weights.experience * 0.75;
  if (repoCount >= 3) return score_weights.experience * 0.5;
  return score_weights.experience * 0.25;
}

function getLastActivityDate(repos) {
  if (!repos.length) return null;

  return repos
    .map(repo => new Date(repo.updated_at))
    .sort((a, b) => b - a)[0];
}

function calculateActivityScore(user) {
  if (!user.lastActiveAt) return 0;

  const daysAgo =
    (Date.now() - new Date(user.lastActiveAt)) / (1000 * 60 * 60 * 24);

  if (daysAgo <= 30) return score_weights.activity *1;
  if (daysAgo <= 90) return score_weights.activity * 0.66;
  if (daysAgo <= 180) return score_weights.activity * 0.33;
  return 0;
}


function calculateTotalScore(user, selectedLanguages, selectedFrameworks) {
  const languageScore = calculateLanguageScore(user, selectedLanguages);
  const frameworkScore = calculateFrameworkScore(user, selectedFrameworks);

  const experienceScore = calculateExperienceScore(user);
  const activityScore = calculateActivityScore(user);

  return Math.round(
    languageScore +
    frameworkScore +
    experienceScore +
    activityScore
  );
}



