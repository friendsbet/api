// TeamController.js
//
// @description :: Server-side logic for managing teams
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {

  boFind: function (req, res) {
    Team
      .find()
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ teams: instances }, 'teams/find.ejs');
    });
  },

  boFindOne: function (req, res) {
    Team
      .findOne(req.param('id'))
      .exec(function (err, instance) {
        if(err) return res.negotiate(err);
        if(!instance) return res.notFound(req.param('id'));

        return res.ok({ team: instance }, 'teams/findOne');
    });
  },

  boNew: function (req, res) {
    return res.ok(null, 'teams/new');
  }

};
