import { drawPlayers } from "./table.js";
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