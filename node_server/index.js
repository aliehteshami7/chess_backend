import Parse from 'parse/node.js';

Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY,
);

Parse.serverURL = process.env.INTERNAL_PARSE_SERVER_URL;

function initGameSchema() {
  const schema = new Parse.Schema('Game')
    .addPointer('user1', '_User', {
      required: true,
    })
    .addPointer('user2', '_User')
    .addArray('moves', {
      required: true,
      defaultValue: [],
    })
    .addString('state', {
      required: true,
      defaultValue: 'NOT_STARTED',
    });
  schema.setCLP({
    get: { '*': true },
    find: { '*': true },
    count: { '*': true },
    create: {},
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  });
  return schema.save();
}

function initRequestSchema() {
  const schema = new Parse.Schema('Request')
    .addPointer('user1', '_User', {
      required: true,
    })
    .addPointer('user2', '_User');

  schema.setCLP({
    get: { requiresAuthentication: true },
    find: { requiresAuthentication: true },
    count: { requiresAuthentication: true },
    create: {},
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  });
  return schema.save();
}

function updateUserSchema() {
  return new Parse.Schema('_User')
    .addNumber('score', {
      required: true,
      defaultValue: 0,
    })
    .addNumber('current_win_streak', {
      required: true,
      defaultValue: 0,
    })
    .addArray('badges', {
      required: true,
      defaultValue: [],
    })
    .update();
}

const errorHandler = (err) => {
  console.log(err);
  if (err.code === 100) {
    initDB();
  }
};

function initDB() {
  setTimeout(() => {
    initGameSchema().catch(errorHandler);
    initRequestSchema().catch(errorHandler);
    updateUserSchema().catch(errorHandler);
  }, 1000);
}

initDB();
