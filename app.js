const express = require("express");
const { randomInt } = require("crypto");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { wait } = require("./utils");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

const Lobby = require("./models/Lobby");
const Player = require("./models/Player");

const lobby = new Lobby();

io.on("connection", (socket) => {
    const status = lobby.round == 0 ? 2 : 0;
    const newPlayer = new Player(socket.id, `Player_${randomInt(999, 9999)}`);
    newPlayer.status = status;

    lobby.addPlayer(newPlayer);

    socket.emit("getPlayers", lobby.players);
    socket.broadcast.emit("playerAdded", lobby.players, newPlayer);

    if (lobby.round === 0 && lobby.players.length >= 3) {
        lobby.startGame(io);
    }

    socket.on("getPlayers", (callback) => callback(lobby.players));

    socket.on("disconnecting", () => {
        lobby.removePlayer(newPlayer.id);
        socket.broadcast.emit("playerRemoved", lobby.players, newPlayer);
        lobby.resetGameIfNeeded(io);
    });
});

httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
});