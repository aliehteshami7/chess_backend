import chess from 'chess.js';
import { draw, lose, win } from './user';

export const getGame = async (gameId) => {
  const query = new Parse.Query('Game');
  query.equalTo('objectId', gameId);
  const game = await query.first();
  const moves = game.get('moves') || [];
  const logic = runMoves(moves);
  return { game, logic, turn: moves.length % 2 };
};

export const runMoves = (moves = []) => {
  const logic = new chess(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  );
  moves.forEach((mv) => logic.move(mv));
  return logic;
};

export const correctUser = (game, user, turn) => {
  if (turn === 0) return user.id === game.get('user1').id;
  return user.id === game.get('user2').id;
};

export const updateGameState = async (logic, game, user, turn) => {
  const anotherUser = turn ? game.get('user1') : game.get('user2');
  if (logic.in_checkmate()) {
    await win(user);
    await lose(anotherUser);
    game.set('state', turn ? GAME_STATES.USER2_WON : GAME_STATES.USER1_WON);
  } else if (logic.in_draw()) {
    await draw(user);
    await draw(anotherUser);
    game.set('state', GAME_STATES.DRAW);
  }
};

export const GAME_STATES = {
  NOT_STARTED: 'NOT_STARTED', // DO NOT CHANGE IT!
  ON_GOING: 'ON_GOING',
  DRAW: 'DRAW',
  USER1_WON: 'USER1_WON',
  USER2_WON: 'USER2_WON',
};
