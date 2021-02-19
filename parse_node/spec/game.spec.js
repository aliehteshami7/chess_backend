// Hook into your testing server
var Parse = require('parse/node');
var constants = require('./constants');
// head over to your Parse dash board for your test server, and grab your keys. Swap out the strings with the place holders below
Parse.initialize(constants.APPLICATION_KEY, null, constants.MASTER_KEY);
// if you are running a localhost Parse server, set the serverUrl accordingly
Parse.serverURL = 'https://localhost:8082';
var purgeTable = require('./utils/purge-parse-table')(Parse);
var ResponseStub = require('./utils/response-stub');

describe('Game', () => {
  beforeEach(done => {
    /// purge the game and profile tables, and then proceed
    Promise.all([purgeTable('Game'), purgeTable('Profile')])
      .catch(e => fail(e))
      .then(() => done());
  });
  it('should reject a request to  that does not contain all the parameters', done => {
    var responseStub = new ResponseStub();
    responseStub
      .onComplete()
      .then(() => fail('Should have failed due to invalid parameters'))
      .catch(e => {})
      .then(() => done());

    Game({ params: {} }, responseStub.getStub());
  });

  it('should  a Game, and also create a Profile that contains a reference to the game', done => {
    var responseStub = new ResponseStub();
    var stub = responseStub.getStub();
    Game(
      {
        params: {
          firstname: 'John',
          lastname: 'Smith',
          email: 'jsmith@example.com',
          gamename: 'jsmith1',
          password: 'SecretCatchphrase1',
        },
      },
      stub,
    );
    responseStub
      .onComplete()
      .then(resp => {
        var profileQ = new Parse.Query('Profile');
        profileQ.equalTo('lastname', 'Smith');
        return profileQ.find({ useMasterKey: true });
      })
      // Check to make sure the profile we retrieve is valid
      .then(profiles => {
        if (profiles.length === 0) throw new Error("No profile's found");
        expect(profiles[0].get('firstname')).toBe('John');
        // get the corresponding game
        return profiles[0].get('game').fetch({ useMasterKey: true });
      })
      // Check to make sure the game is what we expect
      .then(game => {
        expect(game.getGamename()).toBe('jsmith1');
      })
      .catch(e => {
        console.log(e);
        fail(e);
      })
      .then(() => done());
  });
});
