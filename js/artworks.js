document.getElementById("search").addEventListener("click", getArt);
let resultDiv = document.getElementById("results");

function getArt() {
    let name = document.getElementById("name").value;
    let artist = document.getElementById("artist").value;
    let category = document.getElementById("category").value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.responseText);
            resultDiv.innerHTML = ""; // clear art from last query
            resultDiv.innerHTML += `<br>`;
            for(let i = 0; i < results.length; i++) {
                resultDiv.innerHTML += `<li><a href="/artworks/${results[i]._id}">${results[i].name}</a>`;
            }
        }
    }
    xhttp.open("GET", "/search" + `/?name=${name}&artist=${artist}&category=${category}`, true);
    //xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}