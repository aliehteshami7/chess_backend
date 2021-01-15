import Parse from 'parse/node.js';

Parse.initialize('alaki', 'alaki');

Parse.serverURL = 'http://192.168.1.9/parse_server/';
Parse.liveQueryServerURL = 'ws://localhost/ws/'

async function alaki() {
  const sessionId = '0G6vN0vzT8';
  const sessionQuery = new Parse.Query('Sessions');
  sessionQuery.equalTo('objectId', sessionId);

  const session = await sessionQuery.find(sessionId);

  let gameQuery = new Parse.Query('Games');
  gameQuery.matchesKeyInQuery('session', 'objectId', sessionQuery);
  let game = await gameQuery.find();
 
  console.log(game, session);

  let subscription = await gameQuery.subscribe();
  subscription.on('open', () => {
    console.log('subscription opened');
  });
  
  subscription.on('create', (game) => {
    console.log('salam2');
    console.log(game.get('session'));
  });
  
  subscription.on('update', (game) => {
    console.log('salam2');
    console.log(game.get('move'));
  });
  console.log(subscription);
}

alaki();
