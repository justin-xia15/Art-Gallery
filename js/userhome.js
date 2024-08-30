document.getElementById("logout").addEventListener("click", logout);

function logout() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/";
        }
    }
    xhttp.open("GET", "/logout", true);
    xhttp.send();
}