class Lobby {
    constructor() {
        this.players = [];
        this.turn = null;
        this.round = 0;
    }

    getPlayingPlayers() {
        const playing = [];
        this.players.forEach(player => {
            if (player.status == 2) {
                playing.push(player);
            }
        });
        return playing;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }
}

module.exports = Lobby;