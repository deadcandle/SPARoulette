const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

const Player = require("./models/Player");
const Lobby = require("./models/Lobby");

const players = {};
const lobbies = {};

io.on("connection", (socket) => {
    const newPlayer = new Player(socket.id);
    players[socket.id] = newPlayer;

    console.log(players);

    socket.on("disconnecting", () => {
        delete players[socket.id];
    });
});

httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
});