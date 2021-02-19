import Parse from "parse/node.js";

const getGame = async (gameId) => {
  const query = new Parse.Query("Game");
  query.equalTo("objectId", gameId);
  return await query.first();
};

Parse.Cloud.define(
  "join",
  async ({ params: { gameId }, user }) => {
    const game = await getGame(gameId);
    game.set("user2", user);
    game.set("state", "ON_GOING");
    await game.save({}, { useMasterKey: true });
  },
  {
    fields: {
      gameId: {
        required: true,
      },
    },
    requireUser: true,
  }
);
