import Parse from "parse/node.js";
import chess from "chess.js";

const getGame = async (gameId) => {
  const query = new Parse.Query("Game");
  query.equalTo("objectId", gameId);
  const game = await query.first();
  const moves = game.get("moves");
  const logic = runMoves(moves);
  return { game, logic, turn: moves.length % 2 };
};

const runMoves = (moves) => {
  const logic = new chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  moves.forEach((mv) => logic.move(mv));
  return logic;
};

const correctUser = (game, user, turn) => {
  if (turn === 0) return user.id === game.get("user1").id;
  return user.id === game.get("user2").id;
};

const updateGameState = async (logic, game, user, turn) => {
  const anotherUser = turn ? game.get("user1") : game.get("user2");
  if (logic.in_checkmate()) {
    await user.save(
      { current_win_streak: user.get("current_win_streak") + 1 },
      { useMasterKey: true }
    );
    await anotherUser.save({ current_win_streak: 0 }, { useMasterKey: true });
    game.set("state", turn ? "USER2_WON" : "USER1_WON");
  } else if (logic.in_draw()) {
    await user.save({ current_win_streak: 0 }, { useMasterKey: true });
    await anotherUser.save({ current_win_streak: 0 }, { useMasterKey: true });
    game.set("state", "DRAW");
  }
};

Parse.Cloud.define(
  "move",
  async ({ params: { gameId, move }, user }) => {
    const { logic, game, turn } = await getGame(gameId);
    if (!correctUser(game, user, turn) || !logic.move(move)) return false;

    game.add("moves", move);

    await updateGameState(logic, game, user, turn);

    await game.save({}, { useMasterKey: true, cascadeSave: true });
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
  }
);
