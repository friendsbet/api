var should = require('should'),
    bootstrap = require('../../../config/bootstrap').bootstrap;

describe('bootstrapConfig', function() {

  it('should call the callback', function (done) {

    bootstrap(function () {
      return done();
    });

  });

});