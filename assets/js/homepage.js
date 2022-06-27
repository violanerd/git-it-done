var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event){
    event.preventDefault();
  
    var username = nameInputEl.value.trim();
    
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }

}

var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else { // this is a 404 error
            alert("Error: Github User Not Found");
        }
    })
    // this is chained to the end of the .then method line 27
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });  
}

var displayRepos = function (repos, searchTerm) {
    if (repos.length === 0) {
        repoContainerEl.textContent="No repositories found."
        return;
    }
    
    // clear old content
    repoContainerEl.textContent= "" //this container is a div
    repoSearchTerm.textContent = searchTerm; //this container is a span
    for (var i = 0; i <repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // creat a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repositroy name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        repoEl.appendChild(statusEl);
        // append container to the dome
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
