document.getElementById("homebtn").addEventListener("click", login);

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href="http://localhost:3000/";
        } else if(this.readyState == 4 && this.status == 401) {
            alert("Unable to log in");
        } 
    }
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({username: username, password: password}));
}

