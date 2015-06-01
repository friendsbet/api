// Membership.js
//
// @description :: A memberships makes the link between
//                 a User and a Group
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,

  attributes: {

    // Is the User an admin of this Group?
    // e.g true
    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },

    // The User in the Group
    // It's a reference to a User
    user: {
      model: 'user',
      required: true
    },

    // The Groups in which the User participates
    // References to Group objects
    group: {
      model: 'group',
      required: true
    }

  }
};

