// Group.js
//
// @description :: A Group of Users
// @docs        :: http://sailsjs.org/#!documentation/models

module.exports = {

  schema: true,
  tableName: '_grp',

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
      min: 0,
      defaultsTo: 0
    },

    // Everything you need to know about this group
    // e.g 'The group of Friends Bet developers'
    description: {
      type: 'text',
      defaultsTo: ''
    },

    // The first admin of the Group
    // It's a reference to a User
    technicalAdmin: {
      model: 'user',
      required: true
    },

    // The list of members
    // References to Membership objects
    memberships: {
      collection: 'membership',
      via: 'group'
    }

  },

  // Convert strings to correct types
  beforeValidate: function parseParameters(values, cb) {
    values.score = values.score? parseInt(values.score): 0;

    return cb();
  },

  // Create a membership between the technical admin and the new group
  afterCreate: function (record, cb) {
    Membership.create({
      isAdmin: true,
      user: record.technicalAdmin,
      group: record.id
    }).exec(cb);
  },

  // Remove group's memberships
  afterDestroy: function destroyAssociations(instances, cb) {
    async.each(instances, function (instance, next) {
      Membership
        .destroy({ group: instance.id })
        .exec(next);
    }, cb);
  }
  
};
