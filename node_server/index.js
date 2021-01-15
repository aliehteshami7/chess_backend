import Parse from "parse/node.js";

Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);

Parse.serverURL = process.env.INTERNAL_PARSE_SERVER_URL;

async function initGame() {
  const schema = new Parse.Schema("Game");
  schema.addPointer("user1", "_User");
  schema.addPointer("user2", "_User");
  schema.addString("fen", {
    required: true,
    defaultValue: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  });
  schema.save();
}

async function initDB() {
  await initGame();
}

try {
  initDB();
} catch (err) {
  console.log(err);
}
