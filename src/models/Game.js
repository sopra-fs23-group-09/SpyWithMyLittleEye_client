/**
 * Game model
 */
class Game {
    constructor(data = {}) {
        this.id = null;
        this.currentRound = null;
        Object.assign(this, data);
    }
}
export default Game;