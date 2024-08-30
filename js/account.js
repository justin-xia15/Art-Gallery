document.getElementById("switch").addEventListener("click", switchAccount);
removeBtns = document.getElementsByClassName("remove");

// for(let i = 0; i < removeBtns.length; i++) { // add function to remove review ofr each of the user's reviews
//     removeBtns[i].addEventListener("click", removeReview);
// }

function switchAccount() {
    let username = document.getElementById("username").innerHTML;
    username = username.substring(10); // username
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/account";
        } else if(this.readyState == 4 && this.status == 401) {
            let addArt = "You must add an artwork before switching to an Artist account";
            if(confirm(addArt))
                window.location.href = "http://localhost:3000/addartwork"; // user confirms and is redirected to add artwork page
            else
                return; // user cancels
        }
    }
    xhttp.open("PUT", "/account", true);
    xhttp.send();
}

// function removeReview() {
//     let artID = 

//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if(this.readyState == 4 && this.status == 200) {

//         }
//     }
//     //xhttp.open("PUT", "/review/" + )
// }