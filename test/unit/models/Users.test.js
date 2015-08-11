var should = require('should');

describe('UserModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should not be empty', function (done) {
    User
      .find()
      .exec(function (err, users) {
        should(err).be.null;
        should(users).not.be.undefined;

        users.length.should.be.eql(fixtures['user'].length);

        return done();
    });
  });

});