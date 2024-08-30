document.getElementById("submit").addEventListener("click", addWorkshop);

function addWorkshop() {
    let name = document.getElementById("name").value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 201) {
            alert("Successfully added workshop!");
        } else if(this.readyState == 4 && this.status == 401) {
            alert("You must be an artist to create a workshop");
        }
    }
    xhttp.open("POST", "/addworkshop", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({name: name}));
}