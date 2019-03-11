import AppView from './AppView.js';
import AppModel from './AppModel.js';
import GameController from '../game/GameController.js';
import {
  CONTROLS,
  DIFFICULTIES,
  LEVELS,
  LOGIN_FORM,
  PLAYER,
  ELEMENTS
} from '../constants.js';

export default class AppController {
  constructor() {
    this.view = new AppView();
    this.model = new AppModel();
    this.game = null;
    this.setUp();
  }

  setUp() {
    // add listeners
    // card theme carousel
    this.view.carousel.addEventListener('click', this.onCardThemeSet.bind(this));
    // buttons
    this.view.difficultyButtons.forEach(btn =>
      btn.addEventListener('click', this.onDifficultySet.bind(this))
    );

    const startButtons = document.querySelectorAll(CONTROLS.PLAY);
    startButtons.forEach(btn => btn.addEventListener('click', this.onPlay.bind(this)));

    const nextButton = document.querySelector(CONTROLS.NEXT);
    nextButton.addEventListener('click', this.view.showLogIn.bind(this.view));

    const logoutButton = document.querySelector(CONTROLS.LOGOUT);
    logoutButton.addEventListener('click', this.onLogOut.bind(this));
    // buttons binded to view
    const toMenuButton = document.querySelector(CONTROLS.RETURN);
    toMenuButton.addEventListener('click', this.view.showMenu.bind(this.view));

    const exitToMenuButton = document.querySelector(CONTROLS.EXIT);
    exitToMenuButton.addEventListener('click', this.onExitToMenu.bind(this));
    // login form
    const loginForm = document.getElementById(LOGIN_FORM);
    loginForm.addEventListener('submit', this.onLogIn.bind(this));
  }

  run() {
    if (!this.model.player) {
      this.view.showWelcome();
    } else {
      this.view.setPlayerNames(this.model.player);
      this.view.toggleDifficulty(this.model.difficulty);
      this.view.toggleCardTheme(this.model.cardTheme);
      this.view.showMenu();
    }
  }

  onLogIn(e) {
    e.preventDefault(); // prevent form action
    const playerInfo = [
      document.getElementById(PLAYER.FIRSTNAME).value,
      document.getElementById(PLAYER.LASTNAME).value,
      document.getElementById(PLAYER.EMAIL).value
    ];
    this.model.setPlayer(playerInfo);
    this.view.setPlayerNames(this.model.player);
    this.view.toggleDifficulty(this.model.difficulty);
    this.view.toggleCardTheme(this.model.cardTheme);
    this.view.showMenu();
  }

  onLogOut() {
    this.model.unSetPlayer();
    this.view.unSetPlayerNames();
    this.view.toggleDifficulty(this.model.difficulty);
    this.view.toggleCardTheme(this.model.cardTheme);
    this.view.showWelcome();
  }

  onGameEnd(gameResult) {
    this.game = null;
    const place = this.model.checkForRecord(gameResult);
    this.view.showGameEnd(gameResult, place);
  }

  onPlay() {
    const settings = {
      level: LEVELS[this.model.difficulty],
      theme: this.model.cardTheme
    };
    this.game = new GameController(settings, this.onGameEnd.bind(this));
    this.view.showGame();
    this.game.onStartGame();
  }

  onExitToMenu() {
    this.game.cleanUp();
    this.game = null;
    this.view.showMenu();
  }

  onDifficultySet(e) {
    if (e.target.classList.contains(this.model.difficulty)) {
      return;
    }

    // TODO rewrite
    let difficulty;
    for (let difficulty_ of Object.values(DIFFICULTIES)) {
      if (e.target.classList.contains(difficulty_)) {
        difficulty = difficulty_;
        break;
      }
    }
    this.model.setDifficulty(difficulty);
    this.view.toggleDifficulty(difficulty);
  }

  onCardThemeSet(e) {
    const card = e.target.closest(ELEMENTS.CARD);
    if (!card) {
      return;
    }
    const cards = e.currentTarget.querySelectorAll(ELEMENTS.CARD);
    const cardThemeIndex = [...cards].indexOf(card);
    this.model.setCardTheme(cardThemeIndex);
    this.view.toggleCardTheme(cardThemeIndex);
  }
}
