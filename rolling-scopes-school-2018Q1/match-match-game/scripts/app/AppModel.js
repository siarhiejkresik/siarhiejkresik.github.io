import AppData from './AppData.js';
import { DIFFICULTIES, RECORDS_TABLE_SIZE } from '../constants.js';

// TODO observer pattern for player, difficulty, card theme changes

export default class AppModel {
  constructor() {
    this.db = new AppData();
    this.player = null;
    this.difficulty = null;
    this.cardTheme = null;
    this.setUp();
  }

  setUp() {
    // set the last player to the current player
    this.resetToDefault();
    const player = this.db.getLastPlayer();
    if (!player) {
      return;
    }
    this.setPlayer([player.firstname, player.lastname]);
  }

  resetToDefault() {
    this.player = null;
    this.difficulty = DIFFICULTIES.EASY;
    this.cardTheme = 0;
  }

  setPlayer(playerInfo) {
    // get a player from database or create a new one
    let player = this.db.getPlayerByName(...playerInfo);
    if (!player) {
      player = this.db.addNewPlayer(...playerInfo);
    }

    // remember a player if that is not an anonimous
    if (!this.isAnonimousPlayer(player)) {
      this.db.setLastPlayer(player);
    }

    this.player = player;
    // set player's preferences to the model
    if (this.player.difficulty) {
      this.difficulty = this.player.difficulty;
    }
    if (this.player.back) {
      this.cardTheme = this.player.back;
    }
  }

  unSetPlayer() {
    this.db.clearLastPlayer();
    this.resetToDefault();
  }

  setDifficulty(difficulty) {
    if (!this.isAnonimousPlayer(this.player)) {
      this.player.difficulty = difficulty;
      this.db.saveToStorage();
    }
    this.difficulty = difficulty;
  }

  setCardTheme(cardThemeIndex) {
    if (!this.isAnonimousPlayer(this.player)) {
      this.player.back = cardThemeIndex;
      this.db.saveToStorage();
    }
    this.cardTheme = cardThemeIndex;
  }

  // TODO implement RecordsTable class
  checkForRecord(gameResult) {
    const result = {
      id: this.player.id,
      time: gameResult
    };
    const records = this.db.getRecords(this.difficulty);

    // if there are no records yet
    if (!records.length) {
      records.push(result);
      this.db.saveToStorage();
      return 1; // first place
    }

    const i = records.findIndex(record => result.time < record.time);
    if (i === -1) {
      // result time is greater than all times in records

      if (records.length < RECORDS_TABLE_SIZE) {
        // record table is not full

        records.push(result);
        this.db.saveToStorage();
        return records.length;
      } else {
        // record table is full

        return;
      }
    } else {
      // there are records with time greater than result time

      records.splice(i, 0, result);
      if (records.length > RECORDS_TABLE_SIZE) {
        records.pop();
      }
      this.db.saveToStorage();
      return i + 1; // place = index + 1
    }
  }

  isAnonimousPlayer(player) {
    return !player.firstname && !player.lastname;
  }
}
