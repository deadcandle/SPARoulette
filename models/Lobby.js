const { wait } = require("../utils");

const TURN_TYPES = {
    LOAD: "loadGun",
    SHOOT: "spinOrShootGun"
}

class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
        this.countdown = false;
        this.bulletPosition;
        this.currentChamber = 1;
        this.chamberSize = 5;
        this.turnType = null;
    }

    getPlayingPlayers() {
        return this.players.filter(player => player.status !== 0);
    }

    getAlivePlayers() {
        return this.players.filter(player => player.status === 2);
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId, io) {
        this.players = this.players.filter(player => player.id !== playerId);
        this.turnType = TURN_TYPES.LOAD;

        this.nextTurn(io);
    }

    pullTrigger(spinBeforeShoot) {
        const bulletPosition = this.bulletPosition;
        const currentChamber = this.currentChamber;
        if (spinBeforeShoot) {
            this.currentChamber = Math.floor(Math.random()*this.chamberSize) + 1;
            return bulletPosition === currentChamber;
        }
        this.currentChamber = (currentChamber % this.chamberSize) + 1;
        return bulletPosition === currentChamber;
    }

    async nextTurn(io) {
        const round = this.round;
        const playing = this.getAlivePlayers();
    
        if (playing.length === 1) {
            io.emit("notify", playing[0].username + " won the game");
            this.round = 0;
            this.countdown = false;
            io.emit("gameEnded");
            this.scheduleSpectatorsToJoin(io);
            return;
        }
    
        let player = playing[round % playing.length];
        let angle = round * (360 / this.players.length);
        const timeToRespond = 1000 * 8;
    
        if (round === 1) {
            const index = Math.floor(Math.random() * playing.length);
            angle = index * (360 / this.players.length);
            player = playing[index];
    
            io.emit("tableSpin", angle);
            await wait(5);
            io.emit("notify", player.username + " will start");
            this.turnType = TURN_TYPES.LOAD;
        } else {
            io.emit("notify", player.username + " is receiving the gun");
        }
    
        this.turn = player;
        io.emit("moveGun", player.id);
        await wait(1);
    
        console.log("--------------------");
        console.log("Round: ", round);
        // console.log("Turn type: ", this.turnType);
        console.log("Current chamber: ", this.currentChamber);
        console.log("Bullet position: ", this.bulletPosition);
    
        io.to(player.id).timeout(timeToRespond).emit("turn", timeToRespond, this.turnType, async (err, responses) => {
            if (err) {
                // Handle timeout
                switch (this.turnType) {
                    case TURN_TYPES.SHOOT:
                        if (this.pullTrigger()) {
                            io.emit("playSound", "fire");
                            await wait(1);
                            io.emit("notify", player.username + " is dead, " + this.getAlivePlayers().length - 1 + " players remaining");
                            player.status = 1;
                            this.turnType = TURN_TYPES.LOAD;
                            io.emit("getPlayers", this.players);
                        } else {
                            this.turnType = TURN_TYPES.SHOOT;
                            io.emit("playSound", "click");
                            await wait(1);
                            io.emit("notify", player.username + " has survived");
                        }
                        await wait(1);
                        break;
                    case TURN_TYPES.LOAD:
                        this.bulletPosition = Math.floor(Math.random() * this.chamberSize) + 1;
                        io.emit("playSound", "spin");
                        await wait(1);
                        io.emit("notify", player.username + " loaded the gun");
                        this.turnType = TURN_TYPES.SHOOT;
                        await wait(1);
                        break;
                }
            } else {
                // Extract the actual response from the responses array
                const response = responses[0];
    
                switch (this.turnType) {
                    case TURN_TYPES.SHOOT:
                        if (response) {
                            io.emit("playSound", "spin");
                            io.emit("notify", player.username + " is spinning the gun");
                            await wait(1);
                            if (this.pullTrigger(true)) {
                                io.emit("playSound", "fire");
                                io.emit("notify", player.username + " is dead, " + this.getAlivePlayers().length - 1 + " players remaining");
                                player.status = 1;
                                this.turnType = TURN_TYPES.LOAD;
                                io.emit("getPlayers", this.players);
                            } else {
                                this.turnType = TURN_TYPES.SHOOT;
                                io.emit("playSound", "click");
                                io.emit("notify", player.username + " has survived");
                            }
                            await wait(1);
                        } else {
                            if (this.pullTrigger()) {
                                io.emit("playSound", "fire");
                                await wait(1);
                                io.emit("notify", player.username + " is dead, " + this.getAlivePlayers().length - 1 + " players remaining");
                                player.status = 1;
                                this.turnType = TURN_TYPES.LOAD;
                                io.emit("getPlayers", this.players);
                            } else {
                                this.turnType = TURN_TYPES.SHOOT;
                                io.emit("playSound", "click");
                                await wait(1);
                                io.emit("notify", player.username + " has survived");
                            }
                            await wait(1);
                        }
                        break;
                    case TURN_TYPES.LOAD:
                        this.bulletPosition = response + 1;
                        io.emit("playSound", "spin");
                        io.emit("notify", player.username + " loaded the gun");
                        this.turnType = TURN_TYPES.SHOOT;
                        await wait(1);
                        break;
                }
            }
            this.round++;
            this.nextTurn(io);
        });
    }
    
    async startCountdown(duration, io) {
        this.countdown = true;
    
        for (let i = duration; i > 0; i--) {
            if (this.getPlayingPlayers().length < 2) {
                this.countdown = false;
                return;
            }
    
            io.emit("playSound", "tick");
            io.emit("notify", `Starting in ${i}`);
            await wait(1);
        }
    
        this.countdown = false;
    }    

    async startGame(io) {
        if (this.getPlayingPlayers().length < 3 || this.countdown) return;
    
        this.round = 1;
        io.emit("playSound", "start");
        io.emit("notify", "Starting game soon...");
    
        await wait(1);
        await this.startCountdown(10, io);
    
        if (this.getPlayingPlayers().length >= 2) {
            io.emit("playSound", "boom");
            io.emit("notify", "Game started");
            this.nextTurn(io);
        } else {
            this.round = 0;
            io.emit("gameEnded");
        }
    }    

    async scheduleSpectatorsToJoin(io) {
        await wait(3);
        
        this.players.forEach(player => {
            player.status = 2;
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
    
            io.emit("notify", "Game ended, " + this.getAlivePlayers()[0].username + " won");
            io.emit("gameEnded");

            this.scheduleSpectatorsToJoin(io);
        }
    }    
}

module.exports = Lobby;
