export const hasActiveGame = async (user) => {
  const u1Query = new Parse.Query('Game');
  u1Query.equalTo('user1', user);
  u1Query.containedIn('state', ['NOT_STARTED', 'ON_GOING']);

  const u2Query = new Parse.Query('Game');
  u2Query.equalTo('user2', user);
  u2Query.containedIn('state', ['NOT_STARTED', 'ON_GOING']);

  const query = Parse.Query.or(u1Query, u2Query);

  return (await query.count()) > 0;
};

const updateBadges = (user) => {
  if (user.get('current_win_streak') === 3) {
    user.addUnique('badges', 'THREE_CONSECUTIVE_WINS');
  }

  if (user.get('score') === 5) {
    user.addUnique('badges', 'FIVE_SCORE');
  }
};

export const win = async (user) => {
  const current_win_streak = user.get('current_win_streak') + 1 || 1;
  const score = user.get('score') + 1 || 1;
  user.set('current_win_streak', current_win_streak);
  user.set('score', score);
  updateBadges(user);

  await user.save({}, { useMasterKey: true });
};

export const lose = async (user) => {
  const score = user.get('score') || 0;
  user.set('current_win_streak', 0);
  user.set('score', score);
  await user.save({}, { useMasterKey: true });
};

export const draw = async (user) => {
  const score = user.get('score') + 0.5 || 0.5;
  user.set('current_win_streak', 0);
  user.set('score', score);
  updateBadges(user);

  await user.save({}, { useMasterKey: true });
};
