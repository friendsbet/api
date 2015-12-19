var should = require('should'),
    Rugby = require('../../../api/services/sports/Rugby.js'),
    Football = require('../../../api/services/sports/Football.js');
var Sport = require('../../../api/services/Sport.js');

describe('SportService', function() {
  this.slow(5);
  this.timeout(100);

  describe('#initCurrentSport(NonExistingSport)', function () {

    after(function (done) {
      Sport.initCurrentSport(sails.config.FriendsBet.currentSport);
      return done();
    });

    it('should throw an error if the current sport does not exist', function (done) {
      should(Sport).be.an.Object;
      should(Sport.initCurrentSport).be.a.function;
      Sport.initCurrentSport.bind(null, 'Yolo').should.throw();

      return done();
    });

  });

  describe('#checkTeamScore()', function () {

    before(function (done) {
      Sport.initCurrentSport.bind(null, 'Swag').should.throw();
      return done();
    });

    after(function (done) {
      Sport.initCurrentSport(sails.config.FriendsBet.currentSport);
      return done();
    });

    it('should throw an error if the current sport is not set', function (done) {
      should(Sport).be.an.Object;
      should(Sport.checkTeamScore).be.a.function;
      Sport.checkTeamScore.bind().should.throw();

      return done();
    });

  });

  describe('Rugby', function () {

    describe('#checkTeamScore()', function () {

      it('should return false if score is not a Rugby team score', function () {
        Rugby.checkTeamScore(-1).should.be.false;
        Rugby.checkTeamScore(1).should.be.false;
        Rugby.checkTeamScore(2).should.be.false;
        Rugby.checkTeamScore(4).should.be.false;
      });

      it('should return true if score is a Rugby team score', function () {
        Rugby.checkTeamScore(0).should.be.true;
        Rugby.checkTeamScore(3).should.be.true;
        Rugby.checkTeamScore(5).should.be.true;
        Rugby.checkTeamScore(6).should.be.true;
        Rugby.checkTeamScore(7).should.be.true;
      });

    });

  });

  describe('Football', function () {

    describe('#checkTeamScore()', function () {

      it('should return false if score is not a Football team score', function () {
        Football.checkTeamScore(-1).should.be.false;
      });

      it('should return true if score is a Football team score', function () {
        Football.checkTeamScore(0).should.be.true;
        Football.checkTeamScore(1).should.be.true;
        Football.checkTeamScore(2).should.be.true;
        Football.checkTeamScore(3).should.be.true;
        Football.checkTeamScore(4).should.be.true;
      });

    });

  });

});