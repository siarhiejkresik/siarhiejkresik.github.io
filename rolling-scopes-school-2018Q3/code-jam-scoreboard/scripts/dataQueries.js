import { MAX_TIME } from './constants.js';

export const puzzlesNames = session => session.puzzles.map(puzzle => puzzle.name);

// eslint-disable-next-line no-undef
export const isCorrectCode = round => _.has(round, 'correct') && round.correct === 'Correct';

export const userRounds = (session, uid) => session.rounds.map(round => round.solutions[uid]);

export const userRoundTime = (round) => {
  if (isCorrectCode(round)) {
    const time = Number(round.time.$numberLong);
    if (time <= MAX_TIME) {
      return time;
    }
  }
  return MAX_TIME;
};

export const userSumTime = rounds => rounds.reduce((acc, round) => acc + userRoundTime(round), 0);

export function* getUsersData({ users, session }) {
  // eslint-disable-next-line no-undef
  for (const user of _.sortBy(users, ['displayName'])) {
    const rounds = userRounds(session, user.uid);
    yield {
      name: user.displayName,
      rounds,
      sumtime: userSumTime(rounds),
    };
  }
}

export const providerIdIntersection = (data) => {
  const arrs = Object.values(data)
    .map(o => o.users)
    .map(userInfo => userInfo.map(o => o.providerId));
  // eslint-disable-next-line no-undef
  return _.intersection(...arrs);
};

export const getUserUidByProviderId = (users, providerId) => {
  const uid = users
    .filter(userInfo => userInfo.providerId === providerId)
    .map(userInfo => userInfo.uid);
  if (uid.lenght > 1) {
    throw new Error(`duplicated providerId ${providerId}`);
  }
  return uid[0];
};

export const getUserNameByUserUid = (users, uid) => {
  const name = users.filter(userInfo => userInfo.uid === uid).map(userInfo => userInfo.displayName);
  return name[0];
};

export const getCompTableData = (data, sessionName) => {
  const result = {};

  const dupProviderIds = providerIdIntersection(data);
  const dates = Object.keys(data);

  dates.forEach((date) => {
    const { users } = data[date];
    const session = data[date].session[sessionName];
    const uids = dupProviderIds.map(uid => getUserUidByProviderId(users, uid));

    uids.forEach((uid) => {
      const rounds = userRounds(session, uid);
      const userName = getUserNameByUserUid(users, uid);
      const sumTime = userSumTime(rounds);
      // eslint-disable-next-line no-undef
      _.set(result, [userName, date], sumTime);
    });
  });

  return result;
};
