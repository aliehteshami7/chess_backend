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
