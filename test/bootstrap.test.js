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
    
    sails.log(sails.config.models);

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    barrels.populate(function(err) {
      return done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
