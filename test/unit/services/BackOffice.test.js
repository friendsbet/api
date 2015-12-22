var should = require('should');

describe('BackOffice', function() {

  describe('#getATeam(nonExistingId, cb)', function () {
    it('should be alright if the id doesn\'t exist', function (done) {
      BackOffice.getATeam('1', function (err, team) {
        should(err).be.null;
        should(team).be.undefined;

        return done();
      });
    });
  });

  describe('#getATeam(id, cb)', function () {
    var teamId;

    before(function (done) {
      Team
        .findOne({
          name: fixtures['team'][0].name
        })
        .exec(function (err, team) {
          should(err).be.null;
          should(team).not.be.undefined;

          team.should.be.an.object;
          team.should.have.property('id');
          team.should.property('id').not.be.null;
          teamId = team.id;

          return done();
      });
    });

    it('should return an instance if it exists', function (done) {
      BackOffice.getATeam(teamId, function (err, team) {
        should(err).be.null;
        should(team).not.be.undefined;

        team.should.be.an.object;
        team.should.have.property('name');

        return done();
      });
    });
  });

});