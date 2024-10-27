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
    
        for (let i = duration; i > 0; i--) {
            if (this.getPlayingPlayers().length < 2) {
                // io.emit("notify", "Not enough players. Countdown stopped.");
                this.countdown = false;
                return;
            }
    
            io.emit("notify", `Starting in ${i}`);
            await wait(1);
        }
    
        this.countdown = false;
    }    

    async startGame(io) {
        if (this.getPlayingPlayers().length < 3 || this.countdown) return;
    
        this.round = 1;
        io.emit("notify", "Starting game soon...");
    
        await this.startCountdown(10, io);
    
        if (this.getPlayingPlayers().length >= 2) {
            io.emit("notify", "Game started");
            // Proceed to game logic here
        } else {
            this.round = 0;
            io.emit("gameEnded");
        }
    }    

    scheduleSpectatorsToJoin(io) {
        setTimeout(() => {
            this.players.forEach(player => {
                if (player.status === 0) { // Spectator
                    player.status = 2; // Convert to playing
                }
            });
    
            io.emit("getPlayers", this.players);
    
            // Check if we now have enough players to start the game
            if (this.getPlayingPlayers().length >= 3 && this.round === 0 && !this.countdown) {
                this.startGame(io);
            }
        }, 5000);
    }    

    async resetGameIfNeeded(io) {
        if (this.round !== 0 && this.getPlayingPlayers().length < 2) {
            this.round = 0;
            this.countdown = false;
    
            io.emit("notify", "Game ended");
            io.emit("gameEnded");
    
            // Schedule spectators to become players after a delay
            this.scheduleSpectatorsToJoin(io);
        }
    }    
}

module.exports = Lobby;
