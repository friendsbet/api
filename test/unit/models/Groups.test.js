var should = require('should');

describe('GroupModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should not be empty', function (done) {
    Group
      .find()
      .exec(function (err, groups) {
        should(err).be.null;
        should(groups).not.be.undefined;

        groups.length.should.be.eql(fixtures['group'].length);

        return done();
    });
  });

  describe('#afterDestroy()', function () {

  });

});
