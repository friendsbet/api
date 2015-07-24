// MatchController.js
//
// @description :: Server-side logic for managing matches
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {

  boFind: function (req, res) {
    Match
      .find()
      .populate('teamA')
      .populate('teamB')
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ matches: instances }, 'matches/find');
    });
  },

  boFindOne: function (req, res) {
    var match = {};
    var teams = [];

    async.parallel([

      function getMatch(next) {
        Match
          .findOne(req.param('id'))
          .populate('teamA')
          .populate('teamB')
          .exec(function (err, instance) {
            if(err) return next(err);

            match = instance;

            return next();
        });
      },

      function getTeams(next) {
        Team
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);
            
            teams = instances;

            return next();
        });
      },

    ], function (err) {
      if(err) return res.negotiate(err);
      if(!match) return res.notFound(req.param('id'));

      return res.ok({ match: match, teams: teams }, 'matches/findOne');
    });
  },

  boNew: function (req, res) {
    Team
      .find()
      .limit(0)
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ teams: instances }, 'matches/new');
    });
  }

};
