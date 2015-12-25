/* global describe, it, Notification, fixtures */

var should = require('should');

describe('NotificationModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with notifications', function (done) {
    Notification
      .find()
      .exec(function (err, notifications) {
        should(err).be.null;
        should(notifications).not.be.undefined;

        notifications.length.should.be.eql(fixtures['notification'].length);

        return done();
      });
  });

});
