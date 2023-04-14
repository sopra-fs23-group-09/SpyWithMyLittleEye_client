/**
 * Round model
 */
class Round {
    constructor(data = {}) {
        this.id = null;
        this.currentSpier = null;
        this.googleMapsCoordinate = null;
        this.keyword = null;
        this.guesses = null;
        this.hints = null;
        this.timePerRound = null;
        this.startTime = null;
        this.currentRound = null;
        this.amountOfRounds = null;
        Object.assign(this, data);
    }
}
export default Round;