// Notification.js
//
// @description :: A notification is assigned to a user
// @docs        :: http://sailsjs.org/#!documentation/models
//

module.exports = {

  schema: true,

  attributes: {

    // The user concerned
    // It's a reference to the User object
    user: {
      model: 'user',
      notEmpty: true,
      required: true
    },

    // The type of notification
    // e.g 'website'
    type: {
      type: 'string',
      in: ['website', 'group', 'ranking'],
      required: true
    },

    // The notification's detail
    // e.g 'You won 156 points.'
    description: {
      type: 'text',
      notEmpty: true,
      required: true
    },

    // Has the notification been read by the user?
    // e.g true
    isRead: {
      type: 'boolean',
      defaultsTo: false
    }

  }
};
