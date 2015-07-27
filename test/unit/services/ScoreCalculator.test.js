var should = require('should');

describe('ScoreCalculator', function() {
  this.slow(5);
  this.timeout(100);

  describe('#isGoodWinner()', function () {

    it('should return false if match has equality and bet doesn\'t', function () {
      //
      // Equal scores
      //
      var match = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      // Bet team A wins
      var bet = {
        scoreTeamA: 1,
        scoreTeamB: 0
      };

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;

      // Bet team B wins
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;
    });

    it('should return false if teamA won and bet doesn\'t', function () {
      //
      // Team A wins
      //
      var match = {
        scoreTeamA: 1,
        scoreTeamB: 0
      };

      // Bet equal scores
      var bet = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;

      // Bet team A wins
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;
    });

    it('should return false if teamB won and bet doesn\'t', function () {
      //
      // Team B wins
      //
      var match = {
        scoreTeamA: 0,
        scoreTeamB: 1
      };

      // Bet equal scores
      var bet = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;

      // Bet team B wins
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 0;

      ScoreCalculator.isGoodWinner(match, bet).should.be.false;
    });

    it('should return true if selected team won', function () {
      //
      // Equal scores
      //
      var match = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      // Bet equality
      var bet = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      // Bet equality with a different score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 1;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      //
      // Team A wins
      //
      match.scoreTeamA = 1;
      match.scoreTeamB = 0;

      // Bet same score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 0;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 2;
      bet.scoreTeamB = 0;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 2;
      bet.scoreTeamB = 1;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      //
      // Team B wins
      //
      match.scoreTeamA = 0;
      match.scoreTeamB = 1;

      // Bet same score
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 2;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 2;

      ScoreCalculator.isGoodWinner(match, bet).should.be.true;
    });

  });

});