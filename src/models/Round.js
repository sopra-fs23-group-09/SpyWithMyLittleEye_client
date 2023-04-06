/**
 * Round model
 */
class Round {
    constructor(data = {}) {
        this.id = null;
        this.currentSpier = null;
        this.googleMapsCoordinate = null;
        this.guesses = null;
        this.hints = null;
        this.timePerRound = null;
        this.startTime = null;
        Object.assign(this, data);
    }
}
export default Round;