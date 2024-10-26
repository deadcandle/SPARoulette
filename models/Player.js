class Player {
    constructor(id, username = "Player", money = 0) {
        this.id = id;
        this.username = username;
        this.money = money;
        this.status = 0; // spectating, dead, playing
    }
}

module.exports = Player;