console.log("Script loaded");

//const searchBtn = document.getElementById("searchBtn");

// Inputs
//const languageSelect = document.getElementById("language");
//const countrySelect = document.getElementById("country");
//const searchInput = document.getElementById("q");

//const resultsGrid = document.querySelector(".results-grid");

const getUserBtn = document.getElementById("gitUser");
const resultsDiv = document.getElementById("results");



async function handleSearch() {
  // 1. Read values from UI
  //const language = languageSelect.value;
  //const country = countrySelect.value;
  //const keyword = searchInput.value.trim();
   
  const language = "Javascript";
  const country = "Ghana";

  console.log("Language:", language);
  console.log("Country:", country);
  //console.log("Keyword:", keyword);
/*
  // 2. Build GitHub search query
  let queryParts = [];

  if (keyword) {
    queryParts.push(keyword);
  }

  if (language) {
    queryParts.push(`language:${language}`);
  }

  if (country) {
    queryParts.push(`location:${country}`);
  }
*/
  //const query = queryParts.join(" ");
  const query = `language:Javascript location:Ghana`;

  console.log("Final GitHub query:", query);

  // 3. Call GitHub API
  const url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=10`;

  console.log("Request URL:", url);

  //resultsGrid.innerHTML = "";

resultsDiv.innerHTML= "";

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("GitHub search results:", data);
    console.log("First user:", data.items[0]);
    
   // renderCandidates(data.items);
   const users = data.items; 
   const humanUsers = users.filter(user => user.type === "User");
   





humanUsers.forEach(user =>{
    const card = document.createElement("div")
    card.className = "user-card";

    //const p = document.createElement("p")
    //p.textContent = user.login
    card.innerHTML = `
    
    <img src = "${user.avatar_url}" alt = "${user.login} />

    <div class = "user-info">

    <h3> ${user.login}</h3>
    <a href = "${user.html_url}" target = "_blank"> View GitHub </a>

    </div>
    `

    resultsDiv.appendChild(card);
});


  } catch (error) {
    console.error("GitHub API error:", error);
    resultsDiv.innerHTML = "<p> failed to load </p>";
  }


}
 

//handleSearch();
getUserBtn.addEventListener("click", handleSearch);











/*
async function fetchFullProfile(username) {
  const url = `https://api.github.com/users/${username}`;

  try {
    const response = await fetch(url);
    const profile = await response.json();

    return profile;

  } catch (error) {
    console.error("Failed to fetch profile for:", username, error);
    return null;
  }
}


async function enrichUsers(users) {
  //const enrichedUsers = [];
    const humanUsers = data.items.filter(user => user.type === "User");
    const enrichedUsers = await enrichUsers(humanUsers);

  for (const user of users) {
    console.log("Enriching:", user.login);

    const profile = await fetchFullProfile(user.login);

    if (!profile) continue;

    const enrichedUser = {
      username: profile.login,
      name: profile.name,
      avatar: profile.avatar_url,
      location: profile.location,
      followers: profile.followers,
      publicRepos: profile.public_repos,
      bio: profile.bio,
      blog: profile.blog,
      githubUrl: profile.html_url,
      accountCreated: profile.created_at
    };

    enrichedUsers.push(enrichedUser);
  }

  console.log("Enriched users:", enrichedUsers);
  return enrichedUsers;
}


/*
function renderCandidates(users) {
  resultsGrid.innerHTML = "";

  if (!users || users.length === 0) {
    resultsGrid.innerHTML = "<p>No candidates found.</p>";
    return;
  }

  users.forEach(user => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card-top">
        <img class="avatar" src="${user.avatar_url}" alt="${user.login}" />

        <div class="who">
          <h3>${user.login}</h3>
          <p class="muted">GitHub User</p>
        </div>

        <div class="score">
          <span class="score-num">--</span>
          <span class="score-label">Talent Score</span>
        </div>
      </div>

      <div class="card-actions">
        <a class="btn btn-ghost"
           href="${user.html_url}"
           target="_blank"
           rel="noopener">
           View GitHub
        </a>

        <button class="btn btn-primary" type="button">
          Shortlist
        </button>
      </div>
    `;

    resultsGrid.appendChild(card);
  });
}
*/