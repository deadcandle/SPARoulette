const clickSound = new Audio("/sounds/click.mp3");
const fireSound = new Audio("/sounds/fire.mp3");
const spinSound = new Audio("/sounds/spin.mp3");
const boomSound = new Audio("/sounds/boom.mp3");
const startSound = new Audio("/sounds/start.mp3");
const tickSound = new Audio("/sounds/tick.mp3");

export function playSound(sound) {
    switch (sound) {
        case "click":
            clickSound.play();
            break;
        case "fire":
            fireSound.play();
            break;
        case "spin":
            spinSound.play();
            break;
        case "boom":
            boomSound.play();
            break;
        case "start":
            startSound.play();
            break;
        case "tick":
            tickSound.play();
            break;
    }
}