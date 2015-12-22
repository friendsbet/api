var should = require('should');

describe('BackOffice', function() {

  function checkResultIfUnnexistingId(method, cb) {
    method('1', function (err, team) {
      should(err).be.null;
      should(team).be.undefined;

      return cb();
    });
  }

  function findAnInstanceWithExistingId(Model, field, fixtures, cb) {
    var query = {};
    query[field] = fixtures[0][field];

    Model
      .findOne(query)
      .exec(function (err, instance) {
        should(err).be.null;
        should(instance).not.be.undefined;

        instance.should.be.an.object;
        instance.should.have.property('id');
        instance.should.property('id').not.be.null;

        return cb(instance.id);
    });
  }

  function checkResultIfIdExists(method, instanceId, requiredProperty, cb) {
    method(instanceId, function (err, instance) {
      should(err).be.null;
      should(instance).not.be.undefined;

      instance.should.be.an.object;
      instance.should.have.property(requiredProperty);

      return cb();
    });
  }

  describe('#getATeam', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getATeam, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Team, 'name', fixtures['team'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getATeam, instanceId, 'name', done);
      });
    });
  });

  describe('#getAMatch', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getAMatch, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Match, 'kickOffAt', fixtures['match'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getAMatch, instanceId, 'teamA', done);
      });
    });
  });

  describe('#getABet', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getABet, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Bet, 'scoreTeamA', fixtures['bet'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getABet, instanceId, 'scoreTeamA', done);
      });
    });
  });

  describe('#getAUser', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getAUser, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(User, 'email', fixtures['user'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getAUser, instanceId, 'email', done);
      });
    });
  });

  describe('#getANotification', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getANotification, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Notification, 'description', fixtures['notification'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getANotification, instanceId, 'description', done);
      });
    });
  });

  describe('#getAMembership', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getAMembership, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Membership, 'isAdmin', fixtures['membership'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getAMembership, instanceId, 'isAdmin', done);
      });
    });
  });

  describe('#getAGroup', function () {
    describe('(nonExistingId, cb)', function () {
      it('should be alright if the id doesn\'t exist', function (done) {
        checkResultIfUnnexistingId(BackOffice.getAGroup, done);
      });
    });

    describe('(id, cb)', function () {
      var instanceId;

      before(function (done) {
        findAnInstanceWithExistingId(Group, 'name', fixtures['group'], function (_instanceId) {
          instanceId = _instanceId;

          return done();
        });
      });

      it('should return an instance if it exists', function (done) {
        checkResultIfIdExists(BackOffice.getAGroup, instanceId, 'name', done);
      });
    });
  });

});