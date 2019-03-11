import Card from './Card.js';
import { shuffleArray } from '../utils.js';

export default class CardDeck {
  constructor(cards, types, sequence) {
    this.cards = [];
    this.initCards(cards, types, sequence);
    this.shuffle();
  }

  initCards(numberOfCards, numberOfTypes, sequenceSize) {
    if (numberOfCards % 2) {
      throw new Error('The number of cards must be even');
    }

    if (numberOfCards < numberOfTypes * sequenceSize) {
      throw new Error(
        'The number of cards can\'t be less than (number of card types * sequence size)'
      );
    }

    if (numberOfCards % (numberOfTypes * sequenceSize)) {
      throw new Error(
        'The number of cards must be multiple of (number of card types * sequence size)'
      );
    }

    const numberOfCardsOfEachType = numberOfCards / numberOfTypes;
    let id = 0;
    for (let type = 0; type < numberOfTypes; type++) {
      for (let n = 0; n < numberOfCardsOfEachType; n++) {
        this.cards.push(new Card(id, type));
        id += 1;
      }
    }
  }

  getCardById(cardId) {
    for (let card of this.cards) {
      if (card.id === cardId) {
        return card;
      }
    }
    throw new Error(`there is no card with id: ${cardId} in the deck`);
  }

  shuffle() {
    shuffleArray(this.cards);
    this.refillCardIds();
  }

  refillCardIds() {
    this.cards.map((card, i) => (card.id = i));
  }

  addCardStateObserver(observer) {
    this.cards.forEach(card => card.stateObservers.subscribe(observer));
  }
}
