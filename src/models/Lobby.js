/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.accessCode = null;
    this.hostId = null;
    this.amountRounds = null;
    this.playerNames = null;
    Object.assign(this, data);
  }
}
export default Lobby;

