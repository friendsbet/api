// Match.js
//
// @description :: A Match between two teams (team A and team B)
//                 at a defined date and time (kickOffAt).
//                 It also has a location, a pool and an
//                 importance coefficient.
// @docs        :: http://sailsjs.org/#!documentation/models

/* global Match, ScoreCalculator, async, Bet */

module.exports = {

  schema: true,

  attributes: {

    // The first Team
    // A reference to the Team object
    teamA: {
      model: 'team',
      notEmpty: true,
      required: true
    },

    // The second Team
    // A another reference to the other Team object
    teamB: {
      model: 'team',
      notEmpty: true,
      required: true
    },

    // The kick off
    // It's defined as a UTC datetime object
    // See http://stackoverflow.com/a/15952652/3215167
    // For explanations about the format
    // e.g '2015-09-18T20:00:00.000Z'
    kickOffAt: {
      type: 'datetime',
      notEmpty: true,
      required: true
    },

    // When the User can't bet anymore
    // It's also an UTC datetime object
    // e.g '2015-09-18T19:30:00.000Z'
    stopBetsAt: {
      type: 'datetime',
      notEmpty: true,
      required: true
    },

    // The location
    // e.g 'Twickenham, London'
    venue: {
      type: 'text',
      notEmpty: true,
      required: true
    },

    // The importance coefficient
    // e.g 1.5
    importance: {
      type: 'float',
      min: 1.0,
      max: 2.0,
      defaultsTo: 1.0
    },

    // The team A score
    // By default, its value is 0
    // It will be updated during the Match
    // e.g 15
    scoreTeamA: {
      type: 'integer',
      min: 0,
      defaultsTo: 0
    },

    // The team B score
    // Same thing as the team A score
    // e.g 7
    scoreTeamB: {
      type: 'integer',
      min: 0,
      defaultsTo: 0
    },

    // The pool name during the group stage
    // e.g 'A'
    pool: {
      type: 'text',
      defaultsTo: ''
    },

    // Is the match ended?
    // e.g false
    isEnded: {
      type: 'boolean',
      defaultsTo: false
    },

    // The Bets associated to this Match
    // References to Bet objects
    bets: {
      collection: 'bet',
      via: 'match'
    },

    name: function () {
      if (typeof this.teamA === 'object' &&
         typeof this.teamB === 'object') {
        return this.teamA.name + ' vs. ' + this.teamB.name;
      }

      return new Error('The `teamA` and `teamB` attributes should be populated to call this method');
    }

  },

  // Convert strings to correct types
  beforeValidate: function parseParameters(values, cb) {
    values.importance = values.importance? parseFloat(values.importance): 1.0;

    values.scoreTeamA = values.scoreTeamA? parseInt(values.scoreTeamA): 0;
    values.scoreTeamB = values.scoreTeamB? parseInt(values.scoreTeamB): 0;

    return cb();
  },

  // Update all the bets made on this match
  beforeUpdate: function updateScores(values, cb) {
    if (!values.isEnded) return cb(new Error('The match is not ended'));

    Match
      .findOne(values.id)
      .exec(function (err, instance) {
        if (err) return cb(err);
        if (!instance)
          return cb(new Error('This match does not exist'));

        if (instance.isEnded)
          return cb(new Error('The match was already ended'));

        return ScoreCalculator.computeAllScoresFromMatch(values.id, cb);
      });
  },

  // Remove match's bets
  afterDestroy: function destroyAssociations(instances, cb) {
    async.each(instances, function (instance, next) {
      Bet
        .destroy({ match: instance.id })
        .exec(next);
    }, cb);
  }
  
};
