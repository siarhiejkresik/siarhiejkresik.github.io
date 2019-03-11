import OpenedCardsQueue from './CardsQueue.js';
import CardsDeck from './CardsDeck.js';
import Observable from '../Observable.js';
import { ANIMATION_SPEED } from '../constants.js';

export default class GameModel {
  constructor(level) {
    this.cardsToPlay = level.cards;
    this.openedCards = new OpenedCardsQueue(level.sequence);
    this.deck = new CardsDeck(level.cards, level.types, level.sequence);

    this.endGameSubscibers = new Observable();
  }

  selectCard(cardId) {
    const card = this.deck.getCardById(cardId);

    if (!this.isSelectableCard(card)) {
      return;
    }

    if (this.openedCards.process(card)) {
      this.cardsToPlay -= this.openedCards.size;
      this.isGameEnd();
    }
  }

  isSelectableCard(card) {
    return card.isClosed && !this.openedCards.blocked;
  }

  isGameEnd() {
    if (this.cardsToPlay === 0) {
      setTimeout(() => this.endGameSubscibers.notify(), ANIMATION_SPEED * 2);
    }
  }
}
