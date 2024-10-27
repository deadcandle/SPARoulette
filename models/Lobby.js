const { wait } = require("../utils");

class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
        this.countdown = false;
        this.bulletPosition = null;
        this.currentChamber = 1;
        this.chamberSize = 5;
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

    async scheduleSpectatorsToJoin(io) {
        await wait(3);
        
        this.players.forEach(player => {
            if (player.status === 0) {
                player.status = 2;
            }
        });

        io.emit("getPlayers", this.players);

        if (this.getPlayingPlayers().length >= 3 && this.round === 0 && !this.countdown) {
            this.startGame(io);
        }
    }    

    async resetGameIfNeeded(io) {
        if (this.round !== 0 && this.getPlayingPlayers().length < 2) {
            this.round = 0;
            this.countdown = false;
    
            io.emit("notify", "Game ended");
            io.emit("gameEnded");

            this.scheduleSpectatorsToJoin(io);
        }
    }    
}

module.exports = Lobby;
