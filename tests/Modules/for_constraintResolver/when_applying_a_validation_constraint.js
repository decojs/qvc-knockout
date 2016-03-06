describe("when applying a validation constraint", ["qvc/ConstraintResolver"], function(ConstraintResolver){


  var cr,
    loadSpy;

  beforeEach(function(){
    loadSpy = sinon.stub().returns(Promise.resolve([]));

    cr = new ConstraintResolver({
      loadConstraints: loadSpy
    });
  });

  describe("for the first time", function(){
    var result;

    beforeEach(function(){

      because: {
        result = cr.applyValidationConstraints("name");
      }
    });

    it("should ask qvc for the constraint", function(){
      expect(loadSpy.callCount).toBe(1);
    });

    it("should apply the constraint to the validatable", function(done){
      result.then(done);
    });
  });

  describe("more than once", function(){
    var result1, result2;

    beforeEach(function(done){

      because: {
        result1 = cr.applyValidationConstraints("name");
        result2 = result1.then(function(){
          cr.applyValidationConstraints("name");
        }).then(done);
      }

    });

    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy.callCount).toBe(1);
    });

    it("should apply the constraint to all the validatables", function(done){
      Promise.all([result1, result2]).then(done);
    });
  });

  describe("while waiting for the constraints to load", function(){

    var result1, result2;

    beforeEach(function(){
      loadSpy = sinon.stub().returns(Promise.resolve([]));

      cr = new ConstraintResolver({
        loadConstraints: loadSpy
      });

      result1 = cr.applyValidationConstraints("name");

      because: {
        result2 = cr.applyValidationConstraints("name");
      }
    });

    it("should ask qvc for the constraint only once", function(){
      expect(loadSpy.callCount).toBe(1);
    });


    it("should apply the constraint to all the validatables", function(done){
      Promise.all([result1, result2]).then(done);
    });
  });
});