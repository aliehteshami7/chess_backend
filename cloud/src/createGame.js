import { hasActiveGame } from './hasActiveGame';

const Game = Parse.Object.extend('Game');

Parse.Cloud.define(
  'createGame',
  async ({ user }) => {
    if (await hasActiveGame(user)) {
      throw new Error('You have an active game!');
    }
    const game = new Game();
    return (await game.save({ user1: user }, { useMasterKey: true })).id;
  },
  {
    requireUser: true,
  },
);
