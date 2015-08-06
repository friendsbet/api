// UserController.js
//
// @description :: Server-side logic for managing users
// @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {

  boFind: function (req, res) {
    User
      .find()
      .exec(function (err, instances) {
        if(err) return res.negotiate(err);

        return res.ok({ users: instances }, 'users/find');
    });
  },

  boFindOne: function (req, res) {
    BackOffice
      .getAUser(req.param('id'), function (err, instance) {
        if(err) return res.negotiate(err);
        if(!instance) return res.notFound(req.param('id'));

        return res.ok({ user: instance }, 'users/findOne');
    });
  },

  boNew: function (req, res) {
    return res.ok(null, 'users/new');
  }

};
