import { startBar } from "./bar.js";

const cylinder = document.getElementById("cylinder");

export function handleTurn(timeToRespond, action, callback) {
    startBar(timeToRespond).then(() => { return; });
    if (action == "loadGun") {
        cylinder.style.opacity = 1;
        const paths = cylinder.querySelectorAll("svg path:not(:last-child)");
        paths.forEach((path, index) => {
            path.addEventListener("click", () => {
                callback(index);
                cylinder.style.opacity = 0;
            });
        });
    }
}