document.getElementById("enroll").addEventListener("click", enroll);

function enroll() {
    // get workshop id
    let id = window.location.href;
    id = id.split("/");
    id = id[id.length - 1];
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            alert("Successfully registered for the workshop")
            window.location.href = "http://localhost:3000/workshops/" + id;
        }
    }
    xhttp.open("POST", "/workshop", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({workshopID: id}));
}