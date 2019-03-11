export default class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(observer_ => observer_ !== observer);
  }

  notify(...args) {
    this.observers.forEach(observer => observer(...args));
  }
}
