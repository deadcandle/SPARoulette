import { startBar, cancelBar } from "./bar.js";

const table = document.getElementById("table");
const cylinder = document.getElementById("cylinder");
const buttons = document.getElementById("buttons");
const fireButton = buttons.querySelector("#fire");
const spinButton = buttons.querySelector("#spinfire");

export function handleTurn(timeToRespond, action, callback) {
    startBar(timeToRespond / 1000).then(() => {
        table.style.filter = "none";
        cylinder.style.opacity = 0;
        buttons.style.opacity = 0;
        cancelBar();
    });

    if (action == "loadGun") {
        table.style.filter = "blur(5px)";
        cylinder.style.opacity = 1;

        const paths = cylinder.querySelectorAll("svg path:not(:last-child)");
        paths.forEach((path, index) => {
            path.onclick = null; // Remove any existing click listener
            path.addEventListener("click", () => {
                callback(index);
                table.style.filter = "none";
                cylinder.style.opacity = 0;
                cancelBar();
            }, { once: true }); // Only execute the event listener once
        });
    } else if (action == "spinOrShootGun") {
        buttons.style.opacity = 1;
        table.style.filter = "blur(5px)";

        // Remove existing listeners and add new ones
        fireButton.onclick = null;
        fireButton.addEventListener("click", () => {
            callback(false);
            buttons.style.opacity = 0;
            buttons.style.filter = "none";
            cancelBar();
        }, { once: true });

        spinButton.onclick = null;
        spinButton.addEventListener("click", () => {
            callback(true);
            buttons.style.opacity = 0;
            buttons.style.filter = "none";
            cancelBar();
        }, { once: true });
    }
}
