import GameView from './GameView.js';
import GameModel from './GameModel.js';
import Timer from '../Timer.js';
import { ELEMENTS } from '../constants.js';

export default class GameController {
  constructor(settings, exitGameCallback) {
    this.view = new GameView(settings.level.cards, settings.theme);
    this.model = new GameModel(settings.level);
    this.timer = new Timer();
    this.exitGameCallback = exitGameCallback;

    this.setUp();
  }

  setUp() {
    // add listeners and observers
    this.view.grid.addEventListener('click', this.onViewEvent.bind(this));
    this.model.deck.addCardStateObserver(this.view.updateCardView.bind(this.view));
    this.model.endGameSubscibers.subscribe(this.onEndGame.bind(this));
    this.timer.timeSubscribers.subscribe(this.view.updateTime.bind(this.view));
  }

  cleanUp() {
    this.timer.stop();
    this.view.cleanUp();
  }

  onStartGame() {
    this.timer.start();
  }

  onViewEvent(e) {
    if (!e.target.closest(ELEMENTS.CARD)) {
      return;
    }

    // TODO move to GameView interface
    // compute id of the selected card
    let cardId = e.target.closest(ELEMENTS.CARD).id;
    cardId = cardId.split('-').slice(-1)[0];
    cardId = parseInt(cardId, 10);
    this.model.selectCard(cardId);
  }

  onEndGame() {
    this.cleanUp();
    this.exitGameCallback(this.timer.delta);
  }
}
