const theInput = document.getElementById("user-input");
const getButton = document.querySelector("main header .get-button");
const userData = document.querySelector("main .show-data");
const copyYear = document.querySelector("footer p .year");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(date) {
    let datesegments = date.split("T").shift().split("-");
    return `${datesegments[2]} ${months[datesegments[1] - 1]}, ${datesegments[0]}`;
}

function checkNull(type, text) {
    let p = document.createElement("p");
    let icon = document.createElement("img");
    let data;

    if (type === "location") {
        icon.src = "images/location-dot-solid.svg";
        icon.alt = "Location";
        data = document.createElement("span");
    } else if (type === "twitter") {
        icon.src = "images/twitter-brands.svg";
        icon.alt = "Twitter";
        data = document.createElement("a");
        data.href = `https://twitter.com/${text}`;
        data.target = "_blank";
    } else if (type === "company") {
        icon.src = "images/building-solid.svg";
        icon.alt = "Company";
        data = document.createElement("span");
    } else {
        icon.src = "images/link-solid.svg";
        icon.alt = "Blog";
        data = document.createElement("a");
        data.href = text || "";
        data.target = "_blank";
    }

    data.innerHTML = text || "Unavailable";

    if (data.innerHTML === "Unavailable") {
        p.className = "disabled";
    }

    p.appendChild(icon);
    p.appendChild(data);

    return p;
}

function getStats(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((user) => {
            let userStats = document.createElement("div");
            userStats.className = "user-stats";
            userData.appendChild(userStats);

            let userHeader = document.createElement("div");
            userHeader.className = "user-header";
            userStats.appendChild(userHeader);

            let userImage = document.createElement("img");
            userImage.className = "user-avatar";
            userImage.src = user.avatar_url;
            userImage.alt = user.name;
            userHeader.appendChild(userImage);

            let info = document.createElement("div");
            info.className = "info";
            userHeader.appendChild(info);

            let names = document.createElement("div");
            names.className = "names";
            info.appendChild(names);

            let userName = document.createElement("h3");
            userName.className = "user-name";
            userName.innerHTML = user.name || user.login;
            names.appendChild(userName);

            let userLogin = document.createElement("a");
            userLogin.className = "user-login-name";
            userLogin.href = user.html_url;
            userLogin.innerHTML = `@${user.login}`;
            names.appendChild(userLogin);

            let joinDate = document.createElement("p");
            joinDate.className = "join-date";
            joinDate.innerHTML = `Joined GitHub On ${formatDate(user.created_at)}`;
            info.appendChild(joinDate);

            let userBio = document.createElement("p");
            userBio.className = "user-bio";
            userBio.innerHTML = user.bio || `${user.name || user.login} doesn't have a bio`;
            userStats.appendChild(userBio);

            let stats = document.createElement("div");
            stats.className = "stats";
            userStats.appendChild(stats);

            let reposCount = document.createElement("a");
            reposCount.href = `https://github.com/${username}?tab=repositories`;
            reposCount.target = "_blank";
            reposCount.innerHTML = `<span>Repositories</span><span>${user.public_repos}</span>`;
            stats.appendChild(reposCount);

            let userFollowers = document.createElement("a");
            userFollowers.href = `https://github.com/${username}?tab=followers`;
            userFollowers.target = "_blank";
            userFollowers.innerHTML = `<span>Followers</span><span>${user.followers}</span>`;
            stats.appendChild(userFollowers);

            let userFollowing = document.createElement("a");
            userFollowing.href = `https://github.com/${username}?tab=following`;
            userFollowing.target = "_blank";
            userFollowing.innerHTML = `<span>Following</span><span>${user.following}</span>`;
            stats.appendChild(userFollowing);

            let links = document.createElement("div");
            links.className = "links";
            userStats.appendChild(links);

            links.appendChild(checkNull("location", user.location));
            links.appendChild(checkNull("twitter", user.twitter_username));
            links.appendChild(checkNull("company", user.company));
            links.appendChild(checkNull("blog", user.blog));

            let sectionTitle = document.createElement("h2");
            sectionTitle.innerHTML = `${user.name || user.login}'s Repositories`;
            userData.appendChild(sectionTitle);
        })
        .catch(() => {
            userData.innerHTML = `<span class="error">Sorry, User Is Not Found.</span>`;
        });
}

function getRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => response.json())
        .then((repositories) => {
            let userRepos = document.createElement("div");
            userRepos.className = "user-repos";
            userData.appendChild(userRepos);

            repositories.forEach((repo) => {
                let repoBox = document.createElement("div");
                repoBox.className = "repo-box";
                userRepos.appendChild(repoBox);

                let repoName = document.createElement("h2");
                repoName.className = "repo-name";
                repoName.innerHTML = repo.name;
                repoBox.appendChild(repoName);

                let datesHolder = document.createElement("div");
                datesHolder.className = "dates";
                repoBox.appendChild(datesHolder);

                let dateCreated = document.createElement("p");
                dateCreated.className = "repo-date";
                dateCreated.innerHTML = `<span>Created At:</span> ${formatDate(repo.created_at)}`;
                datesHolder.appendChild(dateCreated);

                let dateUpdated = document.createElement("p");
                dateUpdated.className = "repo-date";
                dateUpdated.innerHTML = `<span>Updated At:</span> ${formatDate(repo.pushed_at)}`;
                datesHolder.appendChild(dateUpdated);

                let spanHolder = document.createElement("div");
                spanHolder.className = "span-holder";
                repoBox.appendChild(spanHolder);

                let theUrl = document.createElement("a");
                theUrl.href = `https://github.com/${username}/${repo.name}`;
                theUrl.innerHTML = "Visit";
                theUrl.target = "_blank";
                spanHolder.appendChild(theUrl);

                let starsSpan = document.createElement("span");
                starsSpan.innerHTML = `Stars: ${repo.stargazers_count}`;
                spanHolder.appendChild(starsSpan);

                let language = document.createElement("span");
                language.innerHTML = `Language: ${repo.language || "Markdown"}`;
                spanHolder.appendChild(language);
            });
        })
        .catch(() => {
            userData.innerHTML = `<span class="error">Sorry, User Is Not Found.</span>`;
        });
}

function getFinalData(username) {
    userData.innerHTML = "";
    if (username === "") {
        userData.innerHTML = `<span class="error">Please Write Github Username.</span>`;
    } else {
        getStats(username);
        getRepos(username);
    }
}

getButton.addEventListener("click", () => getFinalData(theInput.value.trim()));
theInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getFinalData(theInput.value.trim());
});

window.addEventListener("load", () => {
    theInput.focus();
    getFinalData("PhilopaterHany");
});

copyYear.innerHTML = new Date().getFullYear();
