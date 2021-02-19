import { GAME_STATES } from './game';
import { hasActiveGame } from './user';

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
    await game.save(
      { user2: user, state: GAME_STATES.ON_GOING },
      { useMasterKey: true },
    );
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
