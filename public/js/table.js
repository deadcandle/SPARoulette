const table = document.getElementById("table");

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
