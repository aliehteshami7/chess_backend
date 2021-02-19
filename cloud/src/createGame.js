import { hasActiveGame } from './user';

const Game = Parse.Object.extend('Game');

Parse.Cloud.define(
  'createGame',
  async ({ user }) => {
    if (await hasActiveGame(user)) {
      throw new Error('You have an active game!');
    }
    return (await new Game().save({ user1: user }, { useMasterKey: true })).id;
  },
  {
    requireUser: true,
  },
);
