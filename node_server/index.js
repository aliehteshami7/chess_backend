import Parse from "parse/node.js";

Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);

Parse.serverURL = process.env.SERVER_ADDRESS;

async function initSessions() {
  const schema = new Parse.Schema("Sessions");
  schema.addPointer("user1", "User");
  schema.addPointer("user2", "User");
  schema.save();
}

async function initGame() {
  const schema = new Parse.Schema("Games");
  schema.addPointer("session", "Sessions", { required: true });
  schema.addString("move", { required: true });
  schema.save();
}

async function initDB() {
  await initSessions();
  await initGame();
}

initDB();
