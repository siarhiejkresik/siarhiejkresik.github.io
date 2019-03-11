import Observable from '../Observable.js';
import { CARD_STATE } from '../constants.js';

export default class Card {
  constructor(id, type) {
    this.id = id;
    this.type = type;
    this._state = CARD_STATE.CLOSED;

    this.stateObservers = new Observable();
  }

  get isClosed() {
    return this._state === CARD_STATE.CLOSED;
  }

  open() {
    this._state = CARD_STATE.OPENED;
    this._stateChangeNotify();
  }

  close() {
    this._state = CARD_STATE.CLOSED;
    this._stateChangeNotify();
  }

  disable() {
    this._state = CARD_STATE.DISABLED;
    this._stateChangeNotify();
  }

  _stateChangeNotify() {
    this.stateObservers.notify(this.id, this._state, this.type);
  }
}
