import { drawPlayers, tableSpin, moveGun } from "./table.js";
import { notify } from "./notification.js";

const socket = io();

socket.on("getPlayers", (players) => { drawPlayers(players); });
socket.on("playerAdded", (players, player) => {
    drawPlayers(players);
    notify("<b>"+player.username + "</b> has joined the game");
});
socket.on("playerRemoved", (players, player) => {
    drawPlayers(players);
    notify("<b>"+player.username + "</b> has left the game");
});
socket.on("notify", (message) => { notify(message); });
socket.on("tableSpin", (angle) => { tableSpin(angle); });
socket.on("moveGun", (playerid) => { moveGun(playerid); })

socket.on("turn", (timeToRespond, options, callback) => {
    // callback("spin");
});