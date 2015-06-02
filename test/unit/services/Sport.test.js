var should = require('should'),
    Rugby = require('../../../api/services/sports/Rugby.js'),
    Football = require('../../../api/services/sports/Football.js');

describe('SportService', function() {
  this.slow(5);
  this.timeout(100);

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