document.getElementById("like").addEventListener("click", like);
document.getElementById("unlike").addEventListener("click", removeLike);
document.getElementById("submit").addEventListener("click", submitReview);


function like() {
    let xhttp = new XMLHttpRequest();
    let artID = window.location.href;
    artID = artID.split("/");
    artID = artID[artID.length - 1]; // last element of array from split()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/artworks/" + artID;
        } else if(this.readyState == 4 && this.status == 403) {
            alert("You cannot like your own artwork!");
        }
    }
    xhttp.open("POST", "/artworks/" + artID, true);
    xhttp.send();
}

function removeLike() {
    let xhttp = new XMLHttpRequest();
    let artID = window.location.href;
    artID = artID.split("/");
    artID = artID[artID.length - 1]; // last element of array from split()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/artworks/" + artID;
        }
    }
    xhttp.open("PUT", "/unlike/" + artID, true);
    xhttp.send();
}

function submitReview() {
    let reviewText = document.getElementById("review").value;
    let xhttp = new XMLHttpRequest();
    let artID = window.location.href;
    artID = artID.split("/");
    artID = artID[artID.length - 1]; // last element of array from split()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/artworks/" + artID;
        } else if(this.readyState == 4 && this.status == 403) {
            alert("You cannot review your own artwork!");
        }
    }
    xhttp.open("POST", "/review/" + artID, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({review: reviewText}));
    
}