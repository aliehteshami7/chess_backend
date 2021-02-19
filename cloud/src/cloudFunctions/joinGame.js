import { GAME_STATES, getGame } from '../game';
import { hasActiveGame } from '../user';

export const joinGame = async ({ params: { gameId }, user }) => {
  if (await hasActiveGame(user)) {
    throw new Error('You have an active game!');
  }

  const game = await getGame(gameId);
  await game.save(
    { user2: user, state: GAME_STATES.ON_GOING },
    { useMasterKey: true },
  );
};

Parse.Cloud.define('joinGame', joinGame, {
  fields: {
    gameId: {
      required: true,
    },
  },
  requireUser: true,
});
