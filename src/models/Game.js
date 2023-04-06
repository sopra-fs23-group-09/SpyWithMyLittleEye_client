/**
 * Game model
 */
class Game {
    constructor(data = {}) {
        this.id = null;
        this.timePerRound = null;
        this.currentRound = null;
        Object.assign(this, data);
    }
}
export default Game;