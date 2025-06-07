function loginError(message, code = null) {
    let errorStr;
    if (code) {
        errorStr = `Status code ${code}: ${message}`;
    } else {
        errorStr = message;
    }

    document.getElementById("error-text").textContent = errorStr;

    document.getElementById("login-error").style.display = "block";
}

async function generateToken(username, password) {
    const credentials = btoa(`${username} ${password}`);

    const response = await fetch("https://account.spfn.net/api/v2/oauth2/generatetoken", {
        method: "GET",
        headers: {
            "Authorization": `Basic ${credentials}`,
        }
    })
    if (!response.ok) {
        if (response.status == 400) { // Invalid Login
            loginError("Invalid SFID or Password");
        } else {
            loginError(await response.text(), response.status);
        }

        throw new Error("Network Response was not okay when Generating Token");
    };
    
    const data = await response.json();

    sessionStorage.setItem("authToken", data["token"])

    const expiry = data["expiry"].slice(0, 19) + "Z"
    sessionStorage.setItem("authExpires", expiry)
    return data["token"];
}

function updateUserDataDisplay(data) {
    document.getElementById("display-name").textContent = data["mii"]["name"];
    document.getElementById("sfid").textContent = `SFID: ${data["user_id"]}`;

    document.getElementById("email").innerHTML = `<strong>Email: </strong>${data["email"]["address"]}`;
    document.getElementById("dob").innerHTML = `<strong>Date of Birth: </strong>${data["birth_date"]}`;

    let createdAt = new Date(data["create_date"] + "Z");
    document.getElementById("created-at").innerHTML = `<strong>Created: </strong>${createdAt.toLocaleString()}`

    document.getElementById("tz").innerHTML = `<strong>Timezone: </strong>${data["tz_name"]}`;
    document.getElementById("region").innerHTML = `<strong>Country/Region: </strong>${data["country"]}`;

    document.getElementById("login").style.display = "none";
    document.getElementById("user-info").style.display = "flex";
}

function logOut() {
    document.getElementById("login-error").style.display = "none";

    sessionStorage.clear();
    document.getElementById("user-info").style.display = "none";
    document.getElementById("login").style.display = "flex";
}

document.getElementById("login").addEventListener("submit", async function(event) {
    event.preventDefault();

    document.getElementById("login-error").style.display = "none";

    const username = await document.getElementById("username").value;
    const password = await document.getElementById("password").value;

    let token = sessionStorage.getItem("authToken");

    let expiryStr = sessionStorage.getItem("authExpires");
    if (expiryStr) { // Expiry exists so token should exist
        let expiry = new Date(expiryStr);
        if (expiry < new Date()) {
            console.log("Token Expired - Generating new token")
            token = await generateToken(username, password); // Generate Token and Save to Session Storage
        } else if (!token) {
            console.log("Expiry found but no token wtf? - Generating new token")
            token = await generateToken(username, password); // Generate Token and Save to Session Storage
        } else {
            console.log("Expiry is less than the current Date() and there is a token")
        }
    } else {
        console.log("No expiry found - Generating new token")
        token = await generateToken(username, password); // Generate Token and Save to Session Storage
    }

    document.getElementById("password").value = "";

    const response = await fetch("https://account.spfn.net/api/v2/users/@me/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
        loginError(await response.text(), response.status);
        throw new Error("Network Response was not okay when requesting Profile");
    }
    
    const data = await response.json();

    // Success - Display user data
    updateUserDataDisplay(data);
})



// Check if there is an active login
window.onload = async function() {
    let expiryStr = sessionStorage.getItem("authExpires");
    if (expiryStr) {
        console.log("Expiry found")
        let expiry = new Date(expiryStr);

        if (expiry > new Date()) { // Hasn't expired - Get user data
            console.log("Not expired - Requesting data")
            let token = sessionStorage.getItem("authToken");

            const response = await fetch("https://account.spfn.net/api/v2/users/@me/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error("Network Response was not okay when requesting Profile")
        
            const data = await response.json();

            updateUserDataDisplay(data);
            document.getElementById("loading-screen").style.display = "none";
        
        } else { // Has expired - Prompt user to log back in
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("login").style.display = "block";

            loginError("Login expired - Please log in again")
        }
    } else { // User has never logged in for this session
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("login").style.display = "block";
    }
}