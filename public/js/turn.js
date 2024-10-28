import { startBar, cancelBar } from "./bar.js";

const cylinder = document.getElementById("cylinder");
const buttons = document.getElementById("buttons");
const fireButton = buttons.querySelector("#fire");
const spinButton = buttons.querySelector("#spinfire");

export function handleTurn(timeToRespond, action, callback) {
    startBar(timeToRespond / 1000).then(() => {
        buttons.style.opacity = 0;
        cancelBar();
    });

    if (action == "loadGun") {
        cylinder.style.opacity = 1;
        const paths = cylinder.querySelectorAll("svg path:not(:last-child)");
        paths.forEach((path, index) => {
            path.onclick = null; // Remove any existing click listener
            path.addEventListener("click", () => {
                callback(index);
                cylinder.style.opacity = 0;
                cancelBar();
            }, { once: true }); // Only execute the event listener once
        });
    } else if (action == "spinOrShootGun") {
        buttons.style.opacity = 1;

        // Remove existing listeners and add new ones
        fireButton.onclick = null;
        fireButton.addEventListener("click", () => {
            callback(false);
            buttons.style.opacity = 0;
            cancelBar();
        }, { once: true });

        spinButton.onclick = null;
        spinButton.addEventListener("click", () => {
            callback(true);
            buttons.style.opacity = 0;
            cancelBar();
        }, { once: true });
    }
}
