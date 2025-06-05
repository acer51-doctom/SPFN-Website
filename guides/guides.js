const guideContents = document.querySelectorAll(".guide-content");

function changeGuide(newID) {
    guideContents.forEach(content => {
        if (content.id == newID) {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    })
}