class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }
}

module.exports = Lobby;