// GroupController.js
//
// @description :: Server-side logic for managing groups
// @help        :: See http://links.sailsjs.org/docs/controllers

/* global Group, async, BackOffice */

module.exports = {
	
  boFind: function (req, res) {
    Group
      .find()
      .populate('technicalAdmin')
      .exec(function (err, instances) {
        if (err) return res.negotiate(err);

        return res.ok({ groups: instances }, 'groups/find');
      });
  },

  boFindOne: function (req, res) {
    var group = {};
    var users = [];

    async.parallel([

      function getGroup(next) {
        BackOffice
          .getAGroup(req.param('id'), function (err, instance) {
            if (err) return next(err);
            
            group = instance;

            return next();
          });
      },

      function getUsers(next) {
        BackOffice
          .getAllUsers(function (err, instances) {
            if (err) return next(err);

            users = instances;

            return next();
          });
      }

    ], function (err) {
      if (err) return res.negotiate(err);
      if (!group) return res.notFound(req.param('id'));

      return res.ok({ group: group, users: users }, 'groups/findOne');
    });
  },

  boNew: function (req, res) {
    BackOffice
      .getAllUsers(function (err, users) {
        if (err) return res.negotiate(err);

        var data = {
          noUsers: true
        };

        if (users.length) {
          data.users = users;
          data.noUsers = false;
        } else {
          data.somethingIsMissing = true;
        }

        return res.ok(data, 'groups/new');
      });
  }

};
