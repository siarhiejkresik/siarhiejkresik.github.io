import Observable from './Observable.js';

export default class Timer {
  constructor(interval = 1000) {
    this.interval = interval;
    this.delta = 0;
    this._timer = null;

    this.timeSubscribers = new Observable();
  }

  start() {
    const startTime = Date.now();
    this.timeSubscribers.notify(this.delta);

    this._timer = setInterval(() => {
      this.delta = Date.now() - startTime;
      this.timeSubscribers.notify(this.delta);
    }, this.interval);
  }

  stop() {
    if (this._timer === null) {
      throw new Error('you must start timer first before trying to stop');
    }
    clearInterval(this._timer);
    return this.delta;
  }
}
