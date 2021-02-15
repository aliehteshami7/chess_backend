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
  schema.addString("last_valid_fen", {
    required: true,
    defaultValue: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  });
  schema.addArray("user1_moves"); // in order
  schema.addArray("user2_moves"); // in order
  schema.addString("state"); //valid options: not_started, on_going, draw, user1_won, user2_won
  schema.save();
  // 
  var schemas = await Parse.Schema.all();
  user_schema = schemas["_User"];
  user_schema.addNumber("current_win_streak", {
    required: true,
    defaultValue: 0
  });
  user_schema.addArray("badges");
  user_schema.save();
}

async function initDB() {
  await initGame();
}

try {
  initDB();
} catch (err) {
  console.log(err);
}
