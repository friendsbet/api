var should = require('should');

describe('UserModel', function() {
  this.slow(75);
  this.timeout(2000);

  var id = '';

  describe('#find()', function() {

    it('should return an empty array', function (done) {

      User.find()
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(0);

          done();
      });

    });

  });



  describe('#create()', function() {

    it('should return an error when no field is provided', function (done) {

      User.create({ })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.have.property('email');
          err.invalidAttributes.should.have.property('firstName');
          err.invalidAttributes.should.have.property('lastName');

          done();
      });

    });

    it('should return an error when only email is provided', function (done) {

      User.create({
          email: 'demo@demo.com'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.not.have.property('email');
          err.invalidAttributes.should.have.property('firstName');
          err.invalidAttributes.should.have.property('lastName');

          done();
      });

    });

    it('should return an error when only first name is provided', function (done) {

      User.create({
          firstName: 'Demo'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.have.property('email');
          err.invalidAttributes.should.not.have.property('firstName');
          err.invalidAttributes.should.have.property('lastName');

          done();
      });

    });

    it('should return an error when only last name is provided', function (done) {

      User.create({
          lastName: 'User'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.have.property('email');
          err.invalidAttributes.should.have.property('firstName');
          err.invalidAttributes.should.not.have.property('lastName');

          done();
      });

    });

    it('should return an error when email and first name are provided', function (done) {

      User.create({
          email: 'demo@demo.com',
          firstName: 'Demo'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.not.have.property('email');
          err.invalidAttributes.should.not.have.property('firstName');
          err.invalidAttributes.should.have.property('lastName');

          done();
      });

    });

    it('should return an error when email and last name are provided', function (done) {

      User.create({
          email: 'demo@demo.com',
          lastName: 'User'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.not.have.property('email');
          err.invalidAttributes.should.property('firstName');
          err.invalidAttributes.should.not.have.have.property('lastName');

          done();
      });

    });

    it('should return an error when first and last names are provided', function (done) {

      User.create({
          firstName: 'Demo',
          lastName: 'User'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.property('email');
          err.invalidAttributes.should.not.have.property('firstName');
          err.invalidAttributes.should.not.have.have.property('lastName');

          done();
      });

    });

    it('should succeed when all fields are well fullfilled', function (done) {

      User.create({
          email: 'demo@demo.com',
          firstName: 'Demo',
          lastName: 'User',
          description: 'Lorem Ipsum...'
        })
        .exec(function(err, result) {
          should(err).be.null;

          should(result).not.be.undefined;
          result.should.be.an.Object;
          result.should.have.property('id');

          id = result.id;

          done();
      });

    });

  });



  describe('#find()', function() {

    it('should return an array containing the user', function (done) {

      User.find()
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(1);

          var result = results[0];

          result.should.be.an.Object;
          result.should.have.property('id');

          done();
      });

    });

  });



  describe('#findOne()', function() {

    it('should return an undefined result when giving an unnexisting id', function (done) {

      User.findOne(123)
        .exec(function(err, result) {
          should(err).be.null;

          should(result).be.undefined;

          done();
      });

    });

    it('should return undefined result when giving an unnexisting attribute value', function (done) {

      User.findOne({
          firstName: 'Fake'
        })
        .exec(function(err, result) {
          should(err).be.null;

          should(result).be.undefined;

          done();
      });

    });

    it('should succeed when giving a real user id', function (done) {

      User.findOne(id)
        .exec(function(err, result) {
          should(err).be.null;

          should(result).not.be.undefined;
          result.should.be.an.Object;
          result.should.have.property('id');

          done();
      });

    });

  });



  describe('#update()', function() {

    it('should return an empty array when providing an unnexisting id', function (done) {

      User.update(123, { description: '...muspI meroL' })
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(0);

          done();
      });

    });

    it('should succeed when giving real informations', function (done) {

      var newDescription = '...muspI meroL';

      User.update(id, { description: newDescription })
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(1);

          var result = results[0];
          
          result.should.be.an.Object;
          result.should.have.property('id', id);
          result.should.have.property('description', newDescription);

          done();
      });

    });

  });



  describe('#destroy()', function() {
    it('should return an empty array when providing an unknown id', function (done) {

      User.destroy(123)
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(0);

          done();
      });

    });

    it('should destroy the user when giving a real id', function (done) {

      User.destroy(id)
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(1);

          var result = results[0];

          result.should.be.an.Object;
          result.should.have.property('id', id);

          done();
      });
        
    });
  });

});