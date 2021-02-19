const Game = Parse.Object.extend("Game");

const hasActiveGame = async (user) => {
  const u1Query = new Parse.Query("Game");
  u1Query.equalTo("user1", user);
  u1Query.containedIn("state", ["NOT_STARTED", "ON_GOING"]);

  const u2Query = new Parse.Query("Game");
  u2Query.equalTo("user2", user);
  u2Query.containedIn("state", ["NOT_STARTED", "ON_GOING"]);

  const query = Parse.Query.or(u1Query, u2Query);

  return (await query.count()) > 0;
};

Parse.Cloud.define(
  "createGame",
  async ({ user }) => {
    if (await hasActiveGame(user)) {
      throw new Error("You have a active game!");
    }
    const game = new Game();
    return (await game.save({ user1: user }, { useMasterKey: true })).id;
  },
  {
    requireUser: true,
  }
);
