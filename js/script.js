const theInput = document.querySelector(".get-repos input");
const getButton = document.querySelector(".get-button");
const reposData = document.querySelector(".show-data");

getButton.addEventListener("click", getRepos);
theInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        reposData.innerHTML = "";
        getStats();
        getRepos();
    }
});
function getStats() {
    if (theInput.value == "") {
        reposData.innerHTML = `<span class="error">Please Write Github Username.</span>`;
    } else {
        fetch(`https://api.github.com/users/${theInput.value}`)
            .then((response) => response.json())
            .then((user) => {
                let mainDiv = document.createElement("div");
                mainDiv.className = "stats-box";

                let userImage = document.createElement("img");
                userImage.src = user.avatar_url;
                userImage.alt = user.name;
                mainDiv.appendChild(userImage);

                let names = document.createElement("div");
                names.className = "names";
                mainDiv.appendChild(names);

                let userName = document.createElement("h3");
                userName.innerHTML = user.name;
                names.appendChild(userName);

                let userLogin = document.createElement("a");
                userLogin.href = user.html_url;
                userLogin.innerHTML = `@${user.login}`;
                names.appendChild(userLogin);

                let userBio = document.createElement("p");
                userBio.innerHTML = user.bio || "No Bio";
                names.appendChild(userBio);

                let stats = document.createElement("div");
                stats.className = "stats";
                mainDiv.appendChild(stats);

                let reposCount = document.createElement("p");
                reposCount.innerHTML = `<a href=https://github.com/${theInput.value}?tab=repositories target="_blank">Repositories</a><span>${user.public_repos}</span>`;
                stats.appendChild(reposCount);
                let userFollowers = document.createElement("p");
                userFollowers.innerHTML = `<a href=https://github.com/${theInput.value}?tab=followers target="_blank">Followers</a><span>${user.followers}</span>`;
                stats.appendChild(userFollowers);
                let userFollowing = document.createElement("p");
                userFollowing.innerHTML = `<a href=https://github.com/${theInput.value}?tab=following target="_blank">Following</a><span>${user.following}</span>`;
                stats.appendChild(userFollowing);

                let links = document.createElement("div");
                links.className = "links";
                mainDiv.appendChild(links);

                if (user.location) {
                    let userLocation = document.createElement("p");
                    userLocation.innerHTML = `<img src="images/location-dot-solid.svg" alt="Location" /><span>${user.location}</span>`;
                    links.appendChild(userLocation);
                }

                if (user.twitter_username) {
                    let twitterUserName = document.createElement("p");
                    twitterUserName.innerHTML = `<img src="images/twitter-brands.svg" alt="Twitter" /><a href=https://twitter.com/${user.twitter_username} target="_blank">${user.twitter_username}</a>`;
                    links.appendChild(twitterUserName);
                }

                if (user.blog) {
                    let userBlog = document.createElement("p");
                    userBlog.innerHTML = `<img src="images/link-solid.svg" alt="Link" /><a href=${user.blog} target="_blank">${user.blog}</a>`;
                    links.appendChild(userBlog);
                }

                if (user.company) {
                    let userCompany = document.createElement("p");
                    userCompany.innerHTML = `<img src="images/building-solid.svg" alt="Company" /><span>${user.company}</span>`;
                    links.appendChild(userCompany);
                }

                reposData.appendChild(mainDiv);
            })
            .catch(() => {
                reposData.innerHTML = `<span class="error">Sorry, User Is Not Found.</span>`;
            });
    }
}

function getRepos() {
    if (theInput.value == "") {
        reposData.innerHTML = `<span class="error">Please Write Github Username.</span>`;
    } else {
        fetch(`https://api.github.com/users/${theInput.value}/repos`)
            .then((response) => response.json())
            .then((repositories) => {
                repositories.forEach((repo) => {
                    let mainDiv = document.createElement("div");
                    mainDiv.className = "repo-box";

                    let repoName = document.createElement("h2");
                    repoName.className = "repo-name";
                    repoName.innerHTML = repo.name;
                    mainDiv.appendChild(repoName);

                    let dateCreated = document.createElement("p");
                    dateCreated.className = "repo-date";
                    dateCreated.innerHTML = `<span>Created At:</span> ${new Date(
                        repo.created_at
                    ).toLocaleString()}`;
                    mainDiv.appendChild(dateCreated);

                    let dateUpdated = document.createElement("p");
                    dateUpdated.className = "repo-date";
                    dateUpdated.innerHTML = `<span>Last Updated At:</span> ${new Date(
                        repo.pushed_at
                    ).toLocaleString()}`;
                    mainDiv.appendChild(dateUpdated);

                    let spanHolder = document.createElement("div");
                    spanHolder.className = "span-holder";
                    mainDiv.appendChild(spanHolder);

                    let theUrl = document.createElement("a");
                    theUrl.href = `https://github.com/${theInput.value}/${repo.name}`;
                    theUrl.innerHTML = "Visit";
                    theUrl.target = "_blank";
                    spanHolder.appendChild(theUrl);

                    let starsSpan = document.createElement("span");
                    starsSpan.innerHTML = `Stars: ${repo.stargazers_count}`;
                    spanHolder.appendChild(starsSpan);

                    let language = document.createElement("span");
                    language.innerHTML = `Language: ${
                        repo.language || "Markdown"
                    }`;
                    spanHolder.appendChild(language);

                    let watchers = document.createElement("span");
                    watchers.innerHTML = `Watchers: ${repo.watchers}`;
                    spanHolder.appendChild(watchers);

                    reposData.appendChild(mainDiv);
                });
            })
            .catch(() => {
                reposData.innerHTML = `<span class="error">Sorry, User Is Not Found.</span>`;
            });
    }
}
