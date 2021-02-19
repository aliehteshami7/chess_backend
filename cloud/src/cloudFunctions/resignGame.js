import { getGame, loseGame } from '../game';

Parse.Cloud.define(
  'resignGame',
  async ({ params: { gameId }, user }) => {
    const game = await getGame(gameId);
    if (user !== game.get('user1') && user !== game.get('user2'))
      throw new Error("You don't have permission!");

    const moves = game.get('moves') || [];
    await loseGame(game, user, moves.length % 2);
    await game.save();
  },
  {
    fields: {
      gameId: {
        required: true,
      },
    },
    requireUser: true,
  },
);
