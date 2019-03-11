import {
  rsschool as rsschool2018Q1,
  rsschoolDemo as rsschoolDemo2018Q1,
} from '../data/2018Q1/sessions.js';
import users2018Q1 from '../data/2018Q1/users.js';

import data2018Q3 from '../data/2018Q3/sessions.js';
import users2018Q3 from '../data/2018Q3/users.js';

const GAME_NAME = 'CSSQuickDraw';
const SESSION_NAME = 'rsschool';
const DEMO_SESSION_SUFFICS = 'demo';
const DEMO_SESSION_NAME = `${SESSION_NAME}-${DEMO_SESSION_SUFFICS}`;

const buildData = (session, demoSession, users) => ({
  session: {
    [DEMO_SESSION_NAME]: demoSession,
    [SESSION_NAME]: session,
  },
  users,
});

let rsschool2018Q3;
let rsschoolDemo2018Q3;
data2018Q3.forEach((session) => {
  const { game, alias } = session;
  if (game === GAME_NAME) {
    if (alias === DEMO_SESSION_NAME) {
      rsschoolDemo2018Q3 = session;
    } else if (alias === SESSION_NAME) {
      rsschool2018Q3 = session;
    }
  }
});

const data = {};

data['2018Q1'] = buildData(rsschool2018Q1, rsschoolDemo2018Q1, users2018Q1);
data['2018Q3'] = buildData(rsschool2018Q3, rsschoolDemo2018Q3, users2018Q3);

export default data;
