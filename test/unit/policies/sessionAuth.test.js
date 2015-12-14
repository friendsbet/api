var should = require('should'),
    sessionAuth = require('../../../api/policies/sessionAuth');

describe('sessionAuthPolicy', function() {
  this.slow(75);
  this.timeout(2000);

  it('should call the forbidden function if the user is not authenticated', function (done) {

    sessionAuth({
      session: { authenticated: false }
    }, {
      forbidden: function (msg) {
        should(msg).not.be.null;

        msg.should.have.length;

        return done();
      }
    });

  });

  it('should call the next function if the user is authenticated', function (done) {

    sessionAuth({
      session: { authenticated: true }
    }, null, function () {
      return done();
    });

  });

});