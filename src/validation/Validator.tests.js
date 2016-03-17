describe("Validator", [
  "qvc/validation/Validator",
  "knockout"
], function(
  Validator,
  ko
){

  var validator,
    constraintValid = {validate: sinon.spy(function(){return true}), message:"valid"};
    constraintInvalid = {validate: sinon.spy(function(){return false}), message:"invalid"};

  afterEach(function(){
    constraintValid.validate.reset();
    constraintInvalid.validate.reset();
  });

  describe("when creating the validator", function(){

    var observable,
      validator;

    beforeEach(function(){
      observable = ko.observable();
      validator = new Validator({name:"name", path:"some.name", executableName:"SomeExecutable"});
    });

    it("should be valid by default", function(){
      expect(validator.isValid()).toBe(true);
    });

    it("should have an empty message", function(){
      expect(validator.message()).toBe("");
    });

    it("should have a name", function(){
      expect(validator.name).toBe("name");
    });

    it("should have a path", function(){
      expect(validator.path).toBe("some.name");
    });

    it("should belong to an executable", function(){
      expect(validator.executableName).toBe("SomeExecutable");
    });
  });

  describe("when reseting the validator", function(){

    var observable,
      validator;

    beforeEach(function(){
      observable = ko.observable();

      validator = new Validator();
      validator.isValid(false);
      validator.message("hello");
      validator.reset();
    });

    it("should be valid by default", function(){
      expect(validator.isValid()).toBe(true);
    });

    it("should have an empty message", function(){
      expect(validator.message()).toBe("");
    });
  });

  describe("when setting constraints", function(){

    var observable,
      validator,
      constraint = {name:"NotEmpty", attributes:{}};

    beforeEach(function(){
      validator = new Validator();
      validator.setConstraints([constraint]);
    });

    it("should add it to the list of constraints", function(){
      expect(validator.constraints.length).toBe(1);
    });

    it("should create a constraint object", function(){
      expect(validator.constraints[0].name).toBe(constraint.name);
      expect(validator.constraints[0].attributes).toBe(constraint.attributes);
    });
  });

  describe("when it has no constraints", function(){

    beforeEach(function(){
      validator = new Validator();
      validator.constraints = [
      ];

      validator.validate()
    });

    it("should be valid", function(){
      expect(validator.isValid()).toBe(true);
    });

    it("should not have a message", function(){
      expect(validator.message()).toBe("");
    });
  });

  describe("when all constraints are valid", function(){

    beforeEach(function(){
      validator = new Validator();
      validator.constraints = [
        constraintValid,
        constraintValid,
        constraintValid
      ];

      validator.validate()
    });

    it("should be valid", function(){
      expect(validator.isValid()).toBe(true);
    });

    it("should not have a message", function(){
      expect(validator.message()).toBe("");
    });
  });

  describe("when the first constraint is invalid", function(){

    beforeEach(function(){
      validator = new Validator();
      validator.constraints = [
        constraintInvalid,
        constraintValid,
        constraintValid
      ];

      validator.validate()
    });

    it("should not be valid", function(){
      expect(validator.isValid()).toBe(false);
    });

    it("should have a message", function(){
      expect(validator.message()).toBe("invalid");
    });

    it("should not validate the other constraints", function(){
      expect(constraintValid.validate.callCount).toBe(0);
    });
  });

  describe("when all constraints are invalid", function(){

    beforeEach(function(){
      validator = new Validator();
      validator.constraints = [
        constraintInvalid,
        constraintInvalid,
        constraintInvalid
      ];

      validator.validate()
    });

    it("should not be valid", function(){
      expect(validator.isValid()).toBe(false);
    });

    it("should have a message", function(){
      expect(validator.message()).toBe("invalid");
    });

    it("should not validate the other constraints", function(){
      expect(constraintInvalid.validate.callCount).toBe(1);
    });
  });
});
