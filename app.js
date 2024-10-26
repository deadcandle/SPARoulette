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

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration*1000);
    });
}

async function startCountdown(duration) {
    for (let i = duration; i > 0; i--) {
        io.emit("notify", `Starting in ${i}`);
        await wait(1);
    }
}

io.on("connection", (socket) => {
    const newPlayer = new Player(socket.id, randomInt(999999, 9999999));
    lobby.addPlayer(newPlayer);

    newPlayer.status = lobby.round == 0 ? 2 : 0;
    
    socket.emit("getPlayers", lobby.players);
    socket.broadcast.emit("playerAdded", lobby.players, newPlayer);

    if (lobby.round == 0) {
        if (lobby.players.length >= 3) {
            lobby.round = 1;
            io.emit("notify", "Game starting soon...");
            
            wait(1)
                .then(() => startCountdown(10))
                .then(() => {
                    io.emit("notify", "Game started");
                });
        }
    }

    socket.on("getPlayers", (callback) => {
        callback(lobby.players);
    });

    socket.on("disconnecting", () => {
        lobby.removePlayer(newPlayer.id);
        socket.broadcast.emit("playerRemoved", lobby.players, newPlayer)

        if (lobby.round !== 0 && lobby.getPlayingPlayers().length < 2) {
            // 1 player remaining; stop the game
            lobby.round = 0;
            io.emit("notify", "Game finished");
            wait(1)
                .then(() => {
                    lobby.resetGame();
                    io.emit("getPlayers", lobby.players);
                })
                .then(() => wait(1))
                .then(() => {
                    if (lobby.players.length >= 3) {
                        lobby.round = 1;
                        io.emit("notify", "Game starting soon...");
                        
                        wait(1)
                            .then(() => startCountdown(10))
                            .then(() => {
                                io.emit("notify", "Game started");
                            });
                    }
                })
        }
    });
});

httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
});