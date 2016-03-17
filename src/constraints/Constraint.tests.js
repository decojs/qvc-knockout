describe("Constraint", ["qvc/constraints/Constraint"], function(Constraint){

  var constraint,
    attributes;
  beforeEach(function(){

    attributes = {message: "hello"};

    constraint = new Constraint("Dummy", attributes, function(){this.isValid = function(){return true;}});
  });

  it("should have a name", function(){
    expect(constraint.type).toBe("Dummy");
  });

  it("should have a message", function(){
    expect(constraint.message).toBe("hello");
  });

  it("should have attributes", function(){
    expect(constraint.attributes).toBe(attributes);
  });

  it("should have a validate method", function(){
    expect(constraint.validate).toBeDefined();
  });

  it("should validate to true", function(){
    expect(constraint.validate()).toBe(true);
  });
});