const table = document.getElementById("table");
const gun = document.getElementById("gun");

function clearTable() {
    const chairs = table.querySelectorAll(".chair");
    chairs.forEach(chair => chair.remove());
}

export function drawPlayers(players) {
    clearTable();
    
    const totalPlayers = players.length;
    
    players.forEach((player, i) => {
        const chair = document.createElement("div");
        const hand = document.createElement("div");
        const display = document.createElement("div");

        chair.className = "chair";
        chair.id = player.id
        chair.style.transform = `rotate(${i * (360 / totalPlayers)}deg) translateX(20vw)`;

        if (player.status == 0) { // spectating
            chair.style.opacity = .25;
        } else if (player.status == 1) { // dead
            chair.style.backgroundColor = "red";
        }

        display.className = "display";
        display.innerHTML = player.username;
        display.style.transform = `rotate(-${i * (360 / totalPlayers)}deg)`;

        hand.className = "hand";

        chair.appendChild(hand);
        chair.appendChild(display);
        table.appendChild(chair);
    });
}

export function tableSpin(angle) {
    gun.style.left = table.getBoundingClientRect().x + table.getBoundingClientRect().width/2 + "px";
    gun.style.top = table.getBoundingClientRect().y + table.getBoundingClientRect().height/2 + "px";
    gun.style.transform = `rotate(calc(${angle}deg)) translate(-50%, -50%)`;
}

export function moveGun(playerid) {
    const hand = table.querySelector("#" + playerid).querySelector(".hand");
    gun.style.left = hand.getBoundingClientRect().x + hand.getBoundingClientRect().width/2 + "px";
    gun.style.top = hand.getBoundingClientRect().y + hand.getBoundingClientRect().height/2 + "px";
}