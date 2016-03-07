describe("when creating a new validator", {
  "qvc/Constraint": "Mocks/ConstraintMock"
},["knockout", "qvc/Validator"], function(ko, Validator){

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

  describe("when reseting the validator", function(){

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

    var constraint = {name:"NotEmpty", attributes:{}};

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
});