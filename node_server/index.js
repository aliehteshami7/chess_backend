import Parse from "parse/node.js";

Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);

Parse.serverURL = process.env.INTERNAL_PARSE_SERVER_URL;

function initGame() {
  const schema = new Parse.Schema("Game")
    .addPointer("user1", "_User", {
      required: true,
    })
    .addPointer("user2", "_User")
    .addArray("moves", {
      required: true,
      defaultValue: [],
    })
    .addString("state", {
      required: true,
      defaultValue: "NOT_STARTED", // valid options: NOT_STARTED, ON_GOING, DRAW, USER1_WON, USER2_WON
    });
  schema.setCLP({
    get: { "*": true },
    find: { "*": true },
    count: { "*": true },
    create: { requiresAuthentication: true },
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  });
  schema.save().catch(console.log);
}

function updateUserSchema() {
  new Parse.Schema("_User")
    .addNumber("current_win_streak", {
      required: true,
      defaultValue: 0,
    })
    .addArray("badges", {
      required: true,
      defaultValue: [],
    })
    .update()
    .catch(console.log);
}

function initDB() {
  setTimeout(() => {
    initGame();
    updateUserSchema();
  }, 5000);
}

initDB();
