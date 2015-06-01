// Match.js
//
// @description :: A Match between two teams (team A and team B)
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
    // It will be updated during the Match
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

    bets: {
      collection: 'bet',
      via: 'match'
    }

  },

  afterUpdate: function updateScores(values, cb) {
    // The Match just has updated non-score related informations
    if(values.scoreTeamA === 0 && values.scoreTeamB === 0)
      return cb();

    Bet
      .find({ match: values.id })
      .exec(function (err, instances) {
        if(err) return cb(err);
        if(!instances) return cb(new Error('Error trying to find bets with match id "' + values.id + '"'));

        var scoreA = values.scoreTeamA,
            scoreB = values.scoreTeamB,
            importance = values.importance,
            score = 0;

        // Update score of each bet
        async.each(instances, function calculateBet(instance, next) {
          score = Score.calculate(importance, instance.scoreTeamA, instance.scoreTeamB, scoreA, scoreB);

          if(score !== instance.score) return next();

          Bet
            .update(instance.id, { score: score })
            .exec(function (err, newInstance) {
              if(err) return next(err);
              if(!newInstance) return next(new Error('Error trying to update bet "' + instance.id + '" with score value "' + score + '"'));
          
              return next();
          });
        }, function (err) {
          return cb((err)? err: null);
        });
    });
  }
};
