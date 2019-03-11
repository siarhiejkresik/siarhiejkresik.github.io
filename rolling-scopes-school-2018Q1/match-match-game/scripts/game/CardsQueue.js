import { ANIMATION_SPEED } from '../constants.js';

export default class OpenedCardsQueue {
  constructor(size) {
    this.size = size;
    this.blocked = false;
    this.cards = [];
  }

  get isEmpty() {
    return !!this.cards.length;
  }

  get isFull() {
    return this.size === this.cards.length;
  }

  get isOfDifferentTypes() {
    // TODO move type checking to card interface?
    if (this.cards.length < 2) {
      return false;
    }
    return this.cards[0].type !== this.cards.slice(-1)[0].type;
  }

  process(card) {
    this.add(card);
    this.block();

    if (this.isOfDifferentTypes) {
      setTimeout(() => {
        this.closeAll();
        this.clear();
      }, ANIMATION_SPEED);
      this.unblock();
      return;
    }

    if (this.isFull) {
      setTimeout(() => {
        this.disableAll();
        this.clear();
      }, ANIMATION_SPEED);
      this.unblock();
      return true;
    }

    this.unblock(0);
  }

  add(card) {
    card.open();
    this.cards.push(card);
  }

  clear() {
    this.cards = [];
  }

  disableAll() {
    this.cards.map(card => card.disable());
  }

  closeAll() {
    this.cards.map(card => card.close());
  }

  block() {
    this.blocked = true;
  }

  unblock(timeout = ANIMATION_SPEED) {
    setTimeout(() => {
      this.blocked = false;
    }, timeout);
  }
}
