import { hasActiveGame } from './hasActiveGame';

const getGame = async (gameId) => {
  const query = new Parse.Query('Game');
  query.equalTo('objectId', gameId);
  return await query.first();
};

Parse.Cloud.define(
  'joinGame',
  async ({ params: { gameId }, user }) => {
    if (hasActiveGame(user)) {
      throw new Error('You have an active game!');
    }
    const game = await getGame(gameId);
    game.set('user2', user);
    game.set('state', 'ON_GOING');
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
