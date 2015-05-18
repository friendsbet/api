// Game.js
//
// @description :: A Game between two teams (team A and team B)
//                 at a defined date and time (kickOffAt).
//                 It also has a location, a pool and an
//                 importance coefficient.
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,

  attributes: {

    // The first Team
    // A reference to the Team object
    teamA: {
      model: 'team'
      notEmpty: true,
      required: true
    },

    // The second Team
    // A another reference to the other Team object
    teamB: {
      model: 'team'
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
    // e.g '2015-09-18T20:00:00.000Z'
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
      defaultsTo: 1.0
    },

    // The team A score
    // By default, its value is 0
    // It will be updated during the Game
    // e.g 15
    scoreTeamA: {
      type: 'integer',
      defaultsTo: 0
    },

    // The team B score
    // Same thing as the team A score
    // e.g 7
    scoreTeamB: {
      type: 'integer',
      defaultsTo: 0
    },

    // The pool name during the group stage
    // e.g 'A'
    pool: {
      type: 'text'
    },

  }
};

