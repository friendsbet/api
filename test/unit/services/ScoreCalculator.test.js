var should = require('should');

describe('ScoreCalculator', function() {
  this.slow(5);
  this.timeout(100);

  describe('#betWinnerIsMatchWinner()', function () {

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

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;

      // Bet team B wins
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;
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

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;

      // Bet team A wins
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;
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

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;

      // Bet team B wins
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 0;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.false;
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

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      // Bet equality with a different score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 1;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      //
      // Team A wins
      //
      match.scoreTeamA = 1;
      match.scoreTeamB = 0;

      // Bet same score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 0;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 2;
      bet.scoreTeamB = 0;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 2;
      bet.scoreTeamB = 1;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      //
      // Team B wins
      //
      match.scoreTeamA = 0;
      match.scoreTeamB = 1;

      // Bet same score
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 1;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 0;
      bet.scoreTeamB = 2;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;

      // Bet different score
      bet.scoreTeamA = 1;
      bet.scoreTeamB = 2;

      ScoreCalculator.betWinnerIsMatchWinner(match, bet).should.be.true;
    });

  });

  describe('#computeScoreDifference()', function () {

    it('should throw an error if argument problem', function () {
      var match = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      var bet = {
        scoreTeamA: 0,
        scoreTeamB: 0
      };

      ScoreCalculator
        .computeScoreDifference
        .bind(null, 'C', match, bet)
        .should
        .throw();
    });

    it('should return 0 if betted team score and real team score are equal',
        function () {
      // Scores 0
      var match = {
        scoreTeamA: 0
      };

      var bet = {
        scoreTeamA: 0
      };

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(0);

      // Scores 1
      match.scoreTeamA = 1;
      bet.scoreTeamA = 1;

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(0);
    });

    it('should return 1 if betted team score and real team score is different by 1',
        function () {
      var match = {
        scoreTeamB: 0
      };

      var bet = {
        scoreTeamB: 1
      };

      ScoreCalculator.computeScoreDifference('B', match, bet).should.equal(1);

      match.scoreTeamA = 6;
      bet.scoreTeamA = 5;

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(1);
    });

    it('should return 2 if betted team score and real team score is different by 2',
        function () {
      var match = {
        scoreTeamA: 0
      };

      var bet = {
        scoreTeamA: 2
      };

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(2);

      match.scoreTeamA = 5;
      bet.scoreTeamA = 3;

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(2);
    });

    it('should return 3 if betted team score and real team score is different by 3',
        function () {
      var match = {
        scoreTeamA: 0
      };

      var bet = {
        scoreTeamA: 3
      };

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(3);

      match.scoreTeamA = 4;
      bet.scoreTeamA = 1;

      ScoreCalculator.computeScoreDifference('A', match, bet).should.equal(3);
    });

  });

});