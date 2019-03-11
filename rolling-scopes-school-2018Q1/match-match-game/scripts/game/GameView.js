import { timeMSToMMSS } from '../utils.js';
import { CARD_STATE, CARD_THEMES, CARD_TEMPLATE, ELEMENTS } from '../constants.js';

// TODO get rid of string literals (card-, front)

export default class GameView {
  constructor(size, cardTheme = 0) {
    this.timer = document.querySelector(ELEMENTS.TIMER);
    this.grid = document.querySelector(ELEMENTS.GRID);
    this.renderGrid(size, cardTheme);
  }

  renderGrid(size, cardTheme) {
    // add cards to grid
    for (let i = 0; i < size; i++) {
      let card = CARD_TEMPLATE(CARD_THEMES[cardTheme]);
      card = document.createRange().createContextualFragment(card);
      this.grid.appendChild(card);
      this.grid.lastChild.id = `card-${i}`;
    }
  }

  updateCardView(id, state, type) {
    const selector = `#card-${id}`;
    let card = this.grid.querySelector(selector);

    if (state === CARD_STATE.OPENED) {
      card.querySelector('.front').innerHTML = type;
      this.openCard(card);
      //
    } else if (state === CARD_STATE.CLOSED) {
      card.querySelector('.front').innerHTML = null;
      this.closeCard(card);
      //
    } else if (state === CARD_STATE.DISABLED) {
      this.disableCard(card);
      //
    } else {
      throw new Error('unknown card state!');
    }
  }

  updateTime(time) {
    this.timer.innerHTML = timeMSToMMSS(time);
  }

  openCard(card) {
    card.classList.add(CARD_STATE.OPENED);
  }

  closeCard(card) {
    card.classList.remove(CARD_STATE.OPENED);
  }

  disableCard(card) {
    card.classList.add(CARD_STATE.DISABLED);
  }

  cleanUp() {
    this.grid.innerHTML = null; // removes all cards
    this.grid.outerHTML = this.grid.outerHTML; // removes all listeners
  }
}
