/* global before, Sport, after, sails */

var Sails = require('sails');
var Barrels = require('barrels');

before(function(done) {
  this.timeout(10000);

  Sails.lift({
    // configuration for testing purposes
    // check out config/env/test.js
  }, function(err, sails) {
    if (err)
      return done(err);

    // Init the project sport
    Sport.initCurrentSport(sails.config.FriendsBet.currentSport);

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    /* eslint-disable no-undef */
    fixtures = barrels.data;
    /* eslint-enable no-undef */

    // Populate the DB
    barrels.populate(['team', 'user'], function(err) {
      if (err)
        return done(err);

      barrels.populate(['group', 'match', 'notification'], function(err) {
        if (err)
          return done(err);

        barrels.populate(['bet', 'membership'], function(err) {
          if (err)
            return done(err);

          return done(null, sails);
        });
      });
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
