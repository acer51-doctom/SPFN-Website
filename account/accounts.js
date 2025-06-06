async function generateToken(creds) {
    const response = await fetch("https://account.spfn.net/api/v2/oauth2/generate_token", {
        method: "GET",
        headers: {
            "Authorization": `Basic ${creds}`,
        }
    })
    if (!response.ok) throw new Error("Network Response was not okay when Generating Token");
    
    const data = await response.json();

    sessionStorage.setItem("authToken", data["token"])
    sessionStorage.setItem("authExpires", data["expiry"])
}

document.getElementById("login").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = await document.getElementById("username").value;
    const password = await document.getElementById("password").value;

    const credentials = btoa(`${username} ${password}`);

    let expiry = sessionStorage.getItem("authExpires");
    let token = sessionStorage.getItem("authToken");
    if (expiry) {
        if (!token) {
            console.log("No token found - Generating new token")
            await generateToken(credentials); // Generate Token and Save to Session Storage
        }
    } else {
        console.log("No token found - Generating new token")
        await generateToken(credentials);
    }

    const response = await fetch("https://account.spfn.net/api/v2/users/@me/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) throw new Error("Network Response was not okay when requesting Profile")
    
    const data = await response.json();

    console.log(data)

    // Success - Display user data
    document.getElementById("display-name").textContent = data["mii"]["name"];
    document.getElementById("sfid").textContent = `SFID: ${data["user_id"]}`;

    document.getElementById("email").innerHTML = `<strong>Email: </strong>${data["email"]["address"]}`;
    document.getElementById("dob").innerHTML = `<strong>Date of Birth: </strong>${data["birth_date"]}`;
    document.getElementById("tz").innerHTML = `<strong>Timezone: </strong>${data["tz_name"]}`;
    document.getElementById("region").innerHTML = `<strong>Country/Region: </strong>${data["country"]}`;

    document.getElementById("login").style.display = "none";
    document.getElementById("user-info").style.display = "flex";
})