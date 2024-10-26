const { wait } = require("../utils");

class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
        this.countdown = false;
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

    async startCountdown(duration, io) {
        this.countdown = true;

        await wait(1);

        for (let i = duration; i > 0; i--) {
            io.emit("notify", `Starting in ${i}`);
            await wait(1);

            if (this.getPlayingPlayers().length < 2) {
                io.emit("notify", "Game finished"); // Gebruik "Game finished" melding hier
                this.countdown = false;
                this.round = 0;
                return;
            }
        }
        this.countdown = false;
        io.emit("notify", "Game started");
    }

    startGame(io) {
        if (this.getPlayingPlayers().length < 2 || this.countdown) return;
        this.round = 1;
        io.emit("notify", "Starting game soon...");
        return this.startCountdown(10, io);
    }

    async resetGameIfNeeded(io) {
        if (this.round !== 0 && this.getPlayingPlayers().length < 2) {
            this.round = 0;
            this.countdown = false;
            
            this.resetGame();
            io.emit("getPlayers", this.players);

            if (this.players.length >= 3) {
                await wait(3);
                this.startGame(io);
            }
        }
    }
}

module.exports = Lobby;
