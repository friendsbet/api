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

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

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
