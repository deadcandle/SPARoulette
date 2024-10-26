const express = require("express");
const { randomInt } = require("crypto");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

const Lobby = require("./models/Lobby");
const Player = require("./models/Player");

const lobby = new Lobby();

io.on("connection", (socket) => {
    const newPlayer = new Player(socket.id, randomInt(999999, 9999999));
    lobby.addPlayer(newPlayer);
    
    socket.emit("getPlayers", lobby.players);
    socket.broadcast.emit("playerAdded", lobby.players, newPlayer);

    if (lobby.round == 0) {
        if (lobby.players.length >= 3) {
            lobby.round = 1;
            io.emit("notify", "Game starting soon...");
            setTimeout(() => {
                for (let i=10;i>0;i--) {
                    setTimeout(() => {
                        io.emit("notify", "Starting in " + i);
                    }, (10 - i) * 1000);
                }
            }, 3000);
        }
    }

    socket.on("getPlayers", (callback) => {
        callback(lobby.players);
    });

    socket.on("disconnecting", () => {
        lobby.removePlayer(newPlayer.id);
        socket.broadcast.emit("playerRemoved", lobby.players, newPlayer)
    });
});

httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
});