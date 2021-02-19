import {
  correctUser,
  GAME_STATES,
  getFullGame,
  updateGameState,
} from '../game';

Parse.Cloud.define(
  'move',
  async ({ params: { gameId, move }, user }) => {
    const { logic, game, turn } = await getFullGame(gameId);
    if (
      game.get('state') !== GAME_STATES.ON_GOING ||
      !correctUser(game, user, turn) ||
      !logic.move(move)
    )
      throw new Error("You don't have permission!");

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
