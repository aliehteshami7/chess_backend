import { hasActiveGame } from '../user';

const Game = Parse.Object.extend('Game');

export const createGame = async ({ user }) => {
  if (await hasActiveGame(user)) {
    throw new Error('You have an active game!');
  }
  return (await new Game().save({ user1: user }, { useMasterKey: true })).id;
};

Parse.Cloud.define('createGame', createGame, {
  requireUser: true,
});
