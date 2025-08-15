const guideContents = document.querySelectorAll(".guide-content");
const guideButtons = document.querySelectorAll(".guide");

const params = new URLSearchParams(window.location.search);
const guideParam = params.get("guide");

let guide = "install-wiiu";
let guidePath = '/md/install-wiiu.md';
if (guideParam) {
    guide = guideParam;
    guidePath = `/md/${guide}.md`;
}

fetch(guidePath)
    .then(res => {
        if (!res.ok) throw new Error(`Guide "${guide} was not found`);
        
        const guideButton = document.getElementById(guide);
        if (guideButton) guideButton.classList.add("active");

        return res.text();
    })
    .then(text => {
        const html = marked.parse(text);
        document.getElementById("guide-contents").innerHTML = html;
    })