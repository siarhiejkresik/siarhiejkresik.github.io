/* eslint-disable no-underscore-dangle */

const LOCALSTORAGE_KEY = 'NotifierDisabled';
const NAVBAR_INDICATORS_GROUP_NAME = 'indicators';
const INDICATOR_ID_PATTERN = 'id-';
const MESSAGE_ELEMENT_CLASS = 'message';
const KEYS_MAP = {
  PREV: 'Digit1',
  NEXT: 'Digit2',
  CLOSE: 'Digit3',
  DISABLE: 'Digit4',
};

export default class Notifier {
  constructor(id) {
    this.numberOfMessages = null;
    this._activeMessageIndex = null;

    // notifier elements
    this.root = document.getElementById(id);
    this.closeButton = this.root.querySelector('.notification-close');
    this.disableCheckBox = this.root.querySelector('.notification-disable input');
    this.messagesArea = this.root.querySelector('.notification-messages');
    this.navBar = this.root.querySelector('.notification-navigation');
    this.navBarIndicators = this.navBar.querySelector('.notification-indicators');
    this.navBarLeft = this.navBar.querySelector('.notification-left');
    this.navBarRight = this.navBar.querySelector('.notification-right');

    this.eventListeners = {};
    this.eventListenersObj = [
      { target: this.root, event: 'click', fn: this.handleNavBarClickEvent },
      { target: window, event: 'keypress', fn: this.handleKeyPressEvent },
    ];
  }

  set activeMessageIndex(messageIndex) {
    if (messageIndex === this._activeMessageIndex) {
      return;
    }
    const { numberOfMessages } = this;
    if (messageIndex > numberOfMessages - 1) {
      this._activeMessageIndex = 0;
    } else if (messageIndex < 0) {
      this._activeMessageIndex = numberOfMessages - 1;
    } else {
      this._activeMessageIndex = messageIndex;
    }
    // update view on index change
    this.changeActiveMessage();
    this.changeActiveNavBarIndicator();
  }

  get activeMessageIndex() {
    return this._activeMessageIndex;
  }

  init(messages, index = 0) {
    const { length } = messages;
    if (!length || Notifier.isDisabled()) {
      return;
    }
    this.numberOfMessages = length;
    this.renderMessages(messages);
    this.renderNavbarIndicators();
    this.activeMessageIndex = index;
    this.addEventListeners();
    this.show();
  }

  show() {
    if (Notifier.isDisabled()) {
      return;
    }
    this.root.hidden = false;
  }

  close() {
    this.removeEventListeners();
    this.root.hidden = true;
  }

  static isDisabled() {
    return localStorage.getItem(LOCALSTORAGE_KEY) === String(true);
  }

  static toggleDisable(boolFlag) {
    localStorage.setItem(LOCALSTORAGE_KEY, boolFlag);
  }

  changeActiveMessage() {
    const messages = this.messagesArea.querySelectorAll(`.${MESSAGE_ELEMENT_CLASS}`);
    messages.forEach((message) => {
      // eslint-disable-next-line no-param-reassign
      message.hidden = true;
    });
    messages[this.activeMessageIndex].hidden = false;
  }

  changeActiveNavBarIndicator() {
    const indicators = this.navBarIndicators.querySelectorAll('input');
    indicators[this.activeMessageIndex].checked = true;
  }

  renderMessages(messages) {
    const fragment = document.createDocumentFragment();
    messages.forEach((message) => {
      const li = document.createElement('li');
      li.classList.add(`${MESSAGE_ELEMENT_CLASS}`);
      li.innerHTML = message;
      li.hidden = true;
      fragment.appendChild(li);
    });
    this.messagesArea.appendChild(fragment);
  }

  renderNavbarIndicators() {
    const fragment = document.createDocumentFragment();
    Array(this.numberOfMessages)
      .fill()
      .forEach((_, i) => {
        const id = `${INDICATOR_ID_PATTERN}${i}`;
        // create indicator
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', NAVBAR_INDICATORS_GROUP_NAME);
        input.setAttribute('id', id);
        fragment.appendChild(input);
        // create label for indicator
        const label = document.createElement('label');
        label.setAttribute('for', id);
        fragment.appendChild(label);
      });
    this.navBarIndicators.appendChild(fragment);
  }

  addEventListeners() {
    this.eventListenersObj.forEach(({ target, event, fn }) => {
      const bindedFn = fn.bind(this);
      target.addEventListener(event, bindedFn);
      this.eventListeners[fn] = bindedFn;
    });
  }

  removeEventListeners() {
    this.eventListenersObj.forEach(({ target, event, fn }) => {
      const bindedFn = this.eventListeners[fn];
      target.removeEventListener(event, bindedFn);
    });
    this.eventListeners = {};
  }

  handleNavBarClickEvent(e) {
    const { target } = e;
    if (target === this.closeButton) {
      e.stopPropagation();
      this.close();
      return;
    }
    if (target === this.disableCheckBox) {
      e.stopPropagation();
      const { checked } = e.target;
      Notifier.toggleDisable(checked);
      return;
    }
    if (target === this.navBarLeft) {
      e.stopPropagation();
      this.activeMessageIndex -= 1;
      return;
    }
    if (target === this.navBarRight) {
      e.stopPropagation();
      this.activeMessageIndex += 1;
      return;
    }
    if (target.name === NAVBAR_INDICATORS_GROUP_NAME) {
      e.stopPropagation();
      this.activeMessageIndex = Number(target.id.split(INDICATOR_ID_PATTERN).pop());
    }
  }

  handleKeyPressEvent({ code }) {
    switch (code) {
      case KEYS_MAP.PREV:
        this.activeMessageIndex -= 1;
        break;
      case KEYS_MAP.NEXT:
        this.activeMessageIndex += 1;
        break;
      case KEYS_MAP.CLOSE:
        this.close();
        break;
      case KEYS_MAP.DISABLE:
        {
          const value = !this.disableCheckBox.checked;
          this.disableCheckBox.checked = value;
          Notifier.toggleDisable(value);
        }
        break;
      default:
    }
  }
}
