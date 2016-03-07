describe("when applying a validation constraint", {
  'qvc/loadConstraints': function(){
    return sinon.stub().returns(Promise.resolve([]))
  }
}, [
  "qvc/ConstraintResolver",
  "qvc/loadConstraints"
], function(
  ConstraintResolver,
  loadSpy
){

  var cr;

  beforeEach(function(){
    cr = new ConstraintResolver({
      baseUrl: 'qvc'
    });
  });

  afterEach(function(){
    loadSpy.reset();
  })

  describe("for the first time", function(){
    var result;

    beforeEach(function(){

      because: {
        result = cr.resolveConstraints("name");
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
        result1 = cr.resolveConstraints("name");
        result2 = result1.then(function(){
          cr.resolveConstraints("name");
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
      result1 = cr.resolveConstraints("name");

      because: {
        result2 = cr.resolveConstraints("name");
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