document.getElementById("homebtn").addEventListener("click", register);

function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            alert("Successfully registered!")
            window.location.href="http://localhost:3000/"; //redirect to login page
        } else if(this.readyState == 4 && this.status == 409) {
            alert("Username already exists");
        }

    }
    xhttp.open("POST", "/register", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({username: username, password: password}));
}