const requestAddr = "https://account.spfn.net/api/v2/oauth2/generate_token"

document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const credentials = btoa(`${username} ${password}`);

    fetch(requestAddr, {
        method: "GET",
        headers: {
            "Authorization": credentials,
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Network Response was not okay");
        return response.json();
    })
    .then(data => { // Success - Hide Form and Show Info on Screen
        document.getElementById("username").value = `SFID: ${data["username"]}`

        document.getElementById("email").value = data["email"];
        document.getElementById("dob").value = data["birthdate"];
        document.getElementById("tz").value = data["timezone"];
        document.getElementById("region").value = data["region"];

        document.getElementById("login").style.display = "none";
        document.getElementById("user-info").style.display = "flex";
    })
})