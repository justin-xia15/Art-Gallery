document.getElementById("submit").addEventListener("click", submitArt);

function submitArt() {
    let name = document.getElementById("name").value;
    let year = document.getElementById("year").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 201) {
            alert("Successfully added artwork!")
        } else if(this.readyState == 4 && this.status == 401) {
            alert("You must be an artist to submit artwork");
        } else if(this.readyState == 4 && this.status == 400) {
            alert("An artwork with this name already exists");
        } 
    }
    xhttp.open("POST", "/addartwork", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({name: name, year: year, category: category, medium: medium, description: description, image: image}));

}