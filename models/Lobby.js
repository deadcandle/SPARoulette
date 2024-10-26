const { startCountdown, wait } = require("../utils");

class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
    }

    resetGame() {
        this.players.forEach(player => {
            player.status = 2;
        });
    }

    getPlayingPlayers() {
        return this.players.filter(player => player.status === 2);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    startGame(io) {
        this.round = 1;
        io.emit("notify", "Starting game soon...");
        return startCountdown(10, io).then(() => io.emit("notify", "Game started"));
    }

    async resetGameIfNeeded(io) {
        if (this.round !== 0 && this.getPlayingPlayers().length < 2) {
            this.round = 0;
            io.emit("notify", "Game finished");
            this.resetGame();
            io.emit("getPlayers", this.players);

            if (this.players.length >= 3) {
                await wait(3);
                return this.startGame(io);
            }
        }
        return Promise.resolve();
    }
}

module.exports = Lobby;