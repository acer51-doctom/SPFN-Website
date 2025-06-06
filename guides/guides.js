const guideContents = document.querySelectorAll(".guide-content");
const guideButtons = document.querySelectorAll(".guide");

function changeGuide(newID) {
    guideContents.forEach(content => {
        if (content.id == newID) {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    })

    guideButtons.forEach(button => {
        let gid = button.id.slice(1);
        if (gid == newID) {
            button.classList.add("active");
        } else {
            if (button.classList.contains("active")) {
                button.classList.remove("active");
            }
        }
    })
}