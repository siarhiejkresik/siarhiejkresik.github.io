import { DB_KEY, DEFAULT_DB } from '../constants.js';

export default class AppData {
  constructor() {
    this._storage = new LocalStorage();
    this.data = this._storage.load();
  }

  addNewPlayer(firstname = '', lastname = '', email = '') {
    const id = this.data.players.length + 1;
    const player = {
      id: id,
      firstname: firstname,
      lastname: lastname,
      email: email
    };
    this.data.players.push(player);
    this.saveToStorage();
    return player;
  }

  getPlayerByName(firstname, lastname) {
    let player = this.data.players.find(
      player => player.firstname === firstname && player.lastname === lastname
    );
    return player;
  }

  getPlayerById(id) {
    return this.data.players.find(player => player.id === id);
  }

  getLastPlayer() {
    const id = this.data.lastPlayerId;
    return this.getPlayerById(id);
  }

  setLastPlayer(player) {
    this.data.lastPlayerId = player.id;
    this.saveToStorage();
  }

  clearLastPlayer() {
    this.data.lastPlayerId = null;
    this.saveToStorage();
  }

  getRecords(difficulty) {
    // create fields if not exist
    if (!this.data.records) {
      this.data.records = {};
    }
    if (!this.data.records[difficulty]) {
      this.data.records[difficulty] = [];
      this.saveToStorage();
    }

    return this.data.records[difficulty];
  }

  // for testing only
  clearRecords(difficulty) {
    if (!difficulty) {
      delete this.data.records;
    } else {
      delete this.data.records.difficulty;
    }
    this.saveToStorage();
  }

  saveToStorage() {
    this._storage.save(this.data);
  }
}

class LocalStorage {
  constructor(key = DB_KEY) {
    this._key = key;
  }

  load() {
    let db = localStorage.getItem(this._key);
    if (!db) {
      db = DEFAULT_DB;
      this.save(db);
      return db;
    }
    return JSON.parse(db);
  }

  save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  }
}
