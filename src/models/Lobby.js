/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.accessCode = null;
    this.users = null;
    this.full = null;
    this.rounds = null;
    Object.assign(this, data);
  }
}
export default Lobby;

