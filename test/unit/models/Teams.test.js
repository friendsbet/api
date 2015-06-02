var should = require('should');

describe('TeamModel', function() {
  this.slow(75);
  this.timeout(2000);

  var id = '';

  describe('#find()', function() {

    it('should return an empty array', function (done) {

      Team
        .find()
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

      Team
        .create({ })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.have.property('name');
          err.invalidAttributes.should.have.property('slug');

          done();
      });

    });

    it('should return an error when only name is provided', function (done) {

      Team
        .create({
          name: 'England'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.not.have.property('name');
          err.invalidAttributes.should.have.property('slug');

          done();
      });

    });

    it('should return an error when only slug is provided', function (done) {

      Team
        .create({
          slug: 'eng'
        })
        .exec(function(err) {
          should(err).not.be.null;

          err.should.have.property('code');
          err.code.should.equal('E_VALIDATION');

          err.should.have.property('invalidAttributes');
          err.invalidAttributes.should.be.an.Object;
          err.invalidAttributes.should.have.property('name');
          err.invalidAttributes.should.not.have.property('slug');

          done();
      });

    });

    it('should succeed when all fields are well fullfilled', function (done) {

      Team
        .create({
          name: 'England',
          slug: 'eng'
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

    it('should return an array containing the team', function (done) {

      Team
        .find()
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

      Team
        .findOne(123)
        .exec(function(err, result) {
          should(err).be.null;

          should(result).be.undefined;

          done();
      });

    });

    it('should return undefined result when giving an unnexisting attribute value', function (done) {

      Team
        .findOne({
          name: 'Fake'
        })
        .exec(function(err, result) {
          should(err).be.null;

          should(result).be.undefined;

          done();
      });

    });

    it('should succeed when giving a real team id', function (done) {

      Team
        .findOne(id)
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

      Team
        .update(123, { description: '...muspI meroL' })
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

      Team
        .update(id, { description: newDescription })
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

      Team
        .destroy(123)
        .exec(function(err, results) {
          should(err).be.null;

          should(results).not.be.undefined;
          results.should.be.an.Array;
          results.should.have.lengthOf(0);

          done();
      });

    });

    it('should destroy the user when giving a real id', function (done) {

      Team
        .destroy(id)
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