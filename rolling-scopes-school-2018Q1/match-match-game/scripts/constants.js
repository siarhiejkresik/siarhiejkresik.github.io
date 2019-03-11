import { EnumFromString } from './utils.js';

const _VIEWS = 'welcome login menu game result';
const _CONTROLS = 'next logout play exit return';
const _LOGIN_FORM = 'login';
const _ELEMENTS = 'card carousel difficulty grid firstname lastname place record timer time';
const _STATES = 'hidden selected';

const _CARD_STATE = 'opened closed disabled';

const _DIFFICULTIES = 'easy normal hard';
const _PLAYER = 'firstname lastname email cardtheme difficulty';
const _CARD_THEMES = 'carbon-fibre frosty-spiral microbial-mat hearts underwater fancy seigaiha';

const VIEWS = EnumFromString(_VIEWS, '.');
const CONTROLS = EnumFromString(_CONTROLS, '.');
const LOGIN_FORM = _LOGIN_FORM;
const ELEMENTS = EnumFromString(_ELEMENTS, '.');
const DIFFICULTY_BUTTONS = EnumFromString(_DIFFICULTIES, '.');
const STATES = EnumFromString(_STATES);

const CARD_STATE = EnumFromString(_CARD_STATE);

const DIFFICULTIES = EnumFromString(_DIFFICULTIES);
const PLAYER = EnumFromString(_PLAYER);
const CARD_THEMES = _CARD_THEMES.trim().split(/ +/);

const CARD_TEMPLATE = cardTheme => {
  return `
<div class="card">
    <div class="content">
        <div class="face back ${cardTheme}"></div>
        <div class="face front"></div>
    </div>
</div>`;
};

const RECORDS_TABLE_SIZE = 10;
const DB_KEY = 'matchmatch';
const DEFAULT_DB = {
  lastPlayerId: null,
  players: []
};

const ANIMATION_SPEED = 1000;

const LEVELS = {
  easy: {
    cards: 16,
    types: 8,
    sequence: 2
  },
  normal: {
    cards: 24,
    types: 12,
    sequence: 2
  },
  hard: {
    cards: 24,
    types: 8,
    sequence: 3
  }
};

export {
  ANIMATION_SPEED,
  CARD_STATE,
  CARD_THEMES,
  CARD_TEMPLATE,
  CONTROLS,
  DB_KEY,
  DEFAULT_DB,
  DIFFICULTIES,
  DIFFICULTY_BUTTONS,
  ELEMENTS,
  LEVELS,
  LOGIN_FORM,
  PLAYER,
  RECORDS_TABLE_SIZE,
  STATES,
  VIEWS
};
