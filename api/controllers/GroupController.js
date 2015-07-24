// GroupController.js
//
// @description :: Server-side logic for managing groups
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {
	
  boFind: function (req, res) {
    Group
      .find()
      .populate('technicalAdmin')
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ groups: instances }, 'groups/find');
    });
  },

  boFindOne: function (req, res) {
    var group = {};
    var users = [];

    async.parallel([

      function getGroup(next) {
        Group
          .findOne(req.param('id'))
          .populate('technicalAdmin')
          .exec(function (err, instance) {
            if(err) return next(err);
            
            group = instance;

            return next();
        });
      },

      function getUsers(next) {
        User
          .find()
          .limit(0)
          .exec(function (err, instances) {
            if(err) return next(err);

            users = instances;

            return next();
        });
      }

    ], function (err) {
      if(err) return res.negotiate(err);
      if(!group) return res.notFound(req.param('id'));

      return res.ok({ group: group, users: users }, 'groups/findOne');
    });
  },

  boNew: function (req, res) {
    User
      .find()
      .limit(0)
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ users: instances }, 'groups/new');
    });
  }

};
