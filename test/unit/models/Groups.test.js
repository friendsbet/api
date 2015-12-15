var should = require('should');

describe('GroupModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with groups', function (done) {
    Group
      .find()
      .exec(function (err, groups) {
        should(err).be.null;
        should(groups).not.be.undefined;

        groups.length.should.be.eql(fixtures['group'].length);

        return done();
    });
  });

  describe('#beforeValidate()', function () {

    it('should convert score to integer', function (done) {
      Group.beforeValidate({
          score: '78'
        }, function (err) {
          should(err).be.undefined;

          return done();
      });
    });

  });

});
