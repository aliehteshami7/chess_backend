import { getGame, loseGame } from '../game';

Parse.Cloud.define(
  'resignGame',
  async ({ params: { gameId }, user }) => {
    const game = await getGame(gameId);
    if (user.id !== game.get('user1').id && user.id !== game.get('user2').id)
      throw new Error("You don't have permission!");

    const moves = game.get('moves') || [];
    await loseGame(game, user, moves.length % 2);
    await game.save({}, { useMasterKey: true });
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
