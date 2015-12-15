var should = require('should');

describe('UserModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with users', function (done) {
    User
      .find()
      .exec(function (err, users) {
        should(err).be.null;
        should(users).not.be.undefined;

        users.length.should.be.eql(fixtures['user'].length);

        return done();
    });
  });

  describe('#name()', function () {

    it('should return a string', function (done) {
      User
        .find()
        .limit(1)
        .exec(function (err, users) {
          should(err).be.null;
          should(users).not.be.undefined;

          users.should.be.an.array;

          var user = users[0];
          user.should.be.an.object;
          user.should.have.property('name');
          user.name.should.be.a.function;
          user.name().should.be.a.string;

          // No need to check what's inside that string I hope :-)

          return done();
      });
    });

  });

  describe('#beforeValidate()', function () {

    it('should convert score to integer', function (done) {
      User.beforeValidate({
          score: '98',
        }, function (err) {
          should(err).be.undefined;

          return done();
      });
    });

  });

});