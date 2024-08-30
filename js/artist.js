document.getElementById("follow").addEventListener("click", followArtist);
document.getElementById("unfollow").addEventListener("click", unfollowArtist);
let enrollBtns = document.getElementsByClassName("enroll");
for(let i = 0; i < enrollBtns.length; i++) {
    enrollBtns[i].addEventListener("click", enroll);
}

function followArtist() {
    let xhttp = new XMLHttpRequest();
    // extract artist name
    let artist = window.location.href;
    artist = artist.split("/");
    artist = artist[artist.length - 1]; // last element in array returned by split()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            
        }
    }
    xhttp.open("POST", "/artists/" + artist, true);
    //xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(artist);
}

function unfollowArtist() {
    let xhttp = new XMLHttpRequest();

    let artist = window.location.href;
    artist = artist.split("/");
    artist = artist[artist.length - 1]; // last element in array returned by split()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            
        }
    }
    xhttp.open("POST", "/unfollow/" + artist, true);
    xhttp.send(artist);
}

function enroll() {
    //let xhttp = new
}