// Group.js
//
// @description :: A Group of Users
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,

  attributes: {

    // The Group name
    // e.g 'Friends Bet Group'
    name: {
      type: 'text',
      notEmpty: true,
      required: true,
      unique: true,
    },

    // The cumulative score of this Group
    // Updated at the end of a Match
    // e.g 1024
    score: {
      type: 'integer',
      defaultsTo: 0
    },

    // Everything you need to know about this group
    // e.g 'The group of Friends Bet developers'
    description: {
      type: 'text'
    },

    // The admin of the Group
    // It's a reference to a User
    admin: {
      model: 'user'
    },

    // The list of members
    // References to User objects
    members: {
      collection: 'user',
      via: 'groups'
    }

  }
};

