import { correctUser, GAME_STATES, getGame, updateGameState } from './game';

Parse.Cloud.define(
  'move',
  async ({ params: { gameId, move }, user }) => {
    const { logic, game, turn } = await getGame(gameId);
    if (
      game.get('state') !== GAME_STATES.ON_GOING ||
      !correctUser(game, user, turn) ||
      !logic.move(move)
    )
      return false;

    game.add('moves', move);

    await updateGameState(logic, game, user, turn);

    await game.save({}, { useMasterKey: true });
  },
  {
    fields: {
      gameId: {
        required: true,
      },
      move: {
        required: true,
        options: (val) => !!(val.from && val.to),
      },
    },
    requireUser: true,
  },
);
