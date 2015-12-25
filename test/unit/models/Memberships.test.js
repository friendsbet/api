/* global describe, it, Membership, fixtures */

var should = require('should');

describe('MembershipModel', function() {
  this.slow(75);
  this.timeout(2000);

  it('should populate the DB with memberships', function (done) {
    Membership
      .find()
      .exec(function (err, memberships) {
        should(err).be.null;
        should(memberships).not.be.undefined;

        memberships.length.should.be.eql(fixtures['membership'].length);

        return done();
      });
  });

});
