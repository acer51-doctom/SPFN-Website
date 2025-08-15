async function requestFestInfo() {
    // DO NOT USE THIS - USE ROUTE https://boss-info.spfn.net/api/v2/fest-info
    const response = await fetch("https://account.spfn.net/api/v2/fest-info", { // ROUTE NOT IMPLEMENTED
        method: "GET"
    })

    if (!response.ok) return;

    /*
    {
        "active",
        "a-name",
        "a-hex",
        "b-name",
        "b-hex",
        "start",
        "end"
    }
    */

    const data = await response.json()

    return data;
}

window.onload = async function() {
    // Verify Fest Information
    let data = localStorage.getItem("fest-info");
    if (data) { // Fest data previously stored
        const end = new Date(data["end"] + "Z")
        const now = new Date()
        if (end < now) { // Fest is over - Remove and check for new fest
            localStorage.removeItem("fest-info");

            data = await requestFestInfo();

            if (data) {
                localStorage.setItem("fest-info", data);
            }
        } else { // Fest is either Upcoming or Active - Update active state
            const start = new Date(data["start"] + "Z");
            const active = start > now && end < now;
            if (data["active"] != active) {
                data["active"] = active;
                localStorage.setItem("fest-data", data);
            }
        }
    } else { // No saved data - Check for any
        data = await requestFestInfo();

        if (data) {
            localStorage.setItem("fest-info", data);
        }
    }



    if (data) { // Active or Upcoming Fest Found
        document.getElementById("splatfest-notfound").style.display = "none";

        let festTitle = `<strong style="background-color: ${data["a-hex"]};">${data["a-name"]}</strong> vs. <strong style="background-color: ${data["b-hex"]};">${data["b-name"]}</strong>`;
        document.getElementById("splatfest-title").innerHTML = festTitle;


        let start = new Date(data["start"] + "Z");
        let startStr = `<strong>Starts: </strong>${start.toLocaleString()}`;
        document.getElementById("splatfest-starts").innerHTML = startStr;

        let end = new Date(data["end"] + "Z");
        let endStr = `<strong>Ends: </strong>${end.toLocaleString()}`;
        document.getElementById("splatfest-ends").innerHTML = endStr;

        let now = new Date();
        if (start > now && end < now) { // Fest is Active
            console.log("Active fest found!")
            
        } else { // Fest is Upcoming
            console.log("Upcoming fest found!")
        }
    } else { // No fest
        document.getElementById("splatfest-info").style.display = "none";
        console.log("No fests currently planned or active")
    }
}