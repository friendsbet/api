var should = require('should');

describe('TeamModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should not be empty', function (done) {
    Team
      .find()
      .exec(function (err, teams) {
        should(err).be.null;
        should(teams).not.be.undefined;

        teams.length.should.be.eql(fixtures['team'].length);

        return done();
    });
  });

});
