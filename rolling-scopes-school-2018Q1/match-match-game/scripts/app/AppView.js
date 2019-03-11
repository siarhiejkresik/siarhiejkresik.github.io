import { CARD_THEMES, DIFFICULTY_BUTTONS, ELEMENTS, STATES, VIEWS } from '../constants.js';

import { timeMSToMMSS } from '../utils.js';

export default class AppView {
  constructor() {
    this.difficultyButtons = document.querySelectorAll(Object.values(DIFFICULTY_BUTTONS));
    this.carousel = document.querySelector(ELEMENTS.CAROUSEL);
    this.setUp();
  }

  setUp() {
    // render card theme carousel
    CARD_THEMES.forEach(cardTheme => {
      let card = document.createElement('div');
      card.classList.add('card');
      card.classList.add(cardTheme);
      this.carousel.appendChild(card);
    });
  }

  showWelcome() {
    this._switchToView(VIEWS.WELCOME);
  }

  showLogIn() {
    this._switchToView(VIEWS.LOGIN);
  }

  showMenu() {
    this._switchToView(VIEWS.MENU);
  }

  showGame() {
    this._switchToView(VIEWS.GAME);
  }

  showGameEnd(gameResult, place) {
    const view = document.querySelector(VIEWS.RESULT);
    view.querySelector(ELEMENTS.TIME).innerHTML = timeMSToMMSS(gameResult);
    if (place) {
      view.querySelector(ELEMENTS.PLACE).innerHTML = place;
      view.querySelector(ELEMENTS.RECORD).classList.remove(STATES.HIDDEN);
    } else {
      view.querySelector(ELEMENTS.RECORD).classList.add(STATES.HIDDEN);
    }

    this._switchToView(VIEWS.RESULT);
  }

  toggleDifficulty(difficulty) {
    // toggle buttons
    this.difficultyButtons.forEach(button => {
      if (button.classList.contains(difficulty)) {
        button.classList.add(STATES.SELECTED);
      } else {
        button.classList.remove(STATES.SELECTED);
      }
    });

    // set difficulty value
    document
      .querySelectorAll(ELEMENTS.DIFFICULTY)
      .forEach(element => (element.innerHTML = difficulty));
  }

  toggleCardTheme(cardThemeIndex) {
    const cards = this.carousel.querySelectorAll(ELEMENTS.CARD);
    cards.forEach((card, i) => {
      if (i === cardThemeIndex) {
        card.classList.add(STATES.SELECTED);
      } else {
        card.classList.remove(STATES.SELECTED);
      }
    });
  }

  setPlayerNames(player) {
    const firstnames = document.querySelectorAll(ELEMENTS.FIRSTNAME);
    const lastnames = document.querySelectorAll(ELEMENTS.LASTNAME);
    firstnames.forEach(node => (node.innerHTML = player.firstname));
    lastnames.forEach(node => (node.innerHTML = player.lastname));
  }

  unSetPlayerNames() {
    this.setPlayerNames({
      firstname: '',
      lastname: ''
    });
  }

  _switchToView(view) {
    this._hideAllViews();
    this._showView(view);
  }

  _hideAllViews() {
    Object.values(VIEWS).forEach(view => document.querySelector(view).classList.add(STATES.HIDDEN));
  }

  _showView(view) {
    document.querySelector(view).classList.remove(STATES.HIDDEN);
  }
}
