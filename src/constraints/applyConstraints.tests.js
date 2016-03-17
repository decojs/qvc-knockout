describe("applyConstraints", [
  "knockout",
  "qvc/constraints/applyConstraints",
  "qvc/constraints/Constraint",
  "Given/a_Rule",
  "qvc/koExtensions"
], function(
  ko,
  applyConstraints,
  Constraint,
  aRule
){

  var constraintRules,
    setConstraintSpy,
    constraintss;

  describe("to an validatable with one field", function(){

    beforeEach(function(done){
      var parameters = {
        name: ko.observable("deco")
      }

      setConstraintSpy = sinon.spy();

      parameters.name.validator = {
        setConstraints: setConstraintSpy
      };

      constraints = [{name: "NotEmpty", attributes:{}}];

      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];

      applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised).then(done, done.fail);
    });

    it("should set the constraintss of the field", function(){
      expect(setConstraintSpy.called).toBe(true);
      expect(setConstraintSpy.callCount).toBe(1);
    });
  });


  describe("to an validatable with nested fields", function(){

    beforeEach(function(done){
      var parameters = {
        address: {
          street: ko.observable("street")
        },
        name: ko.observable("name")
      };

      setConstraintSpy = sinon.spy();

      parameters.name.validator = {
        setConstraints: setConstraintSpy
      };
      parameters.address.street.validator = {
        setConstraints: setConstraintSpy
      };

      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        },
        {
          name:"address.street",
          constraints:constraints
        }
      ];

      applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised).then(done, done.fail);
    });

    it("should set the constraintss of the field", function(){
      expect(setConstraintSpy.called).toBe(true);
      expect(setConstraintSpy.callCount).toBe(2);
    });
  });


  describe("to an validatable with nested fields inside observables", function(){

    beforeEach(function(done){
      var parameters = {
        address: ko.observable({
          street: ko.observable("street")
        }),
        name: ko.observable("name")
      };

      setConstraintSpy = sinon.spy();

      parameters.name.validator = {
        setConstraints: setConstraintSpy
      };
      parameters.address().street.validator = {
        setConstraints: setConstraintSpy
      };

      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        },
        {
          name:"address.street",
          constraints:constraints
        }
      ];

      applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised).then(done, done.fail);
    });

    it("should set the constraintss of the field", function(){
      expect(setConstraintSpy.called).toBe(true);
      expect(setConstraintSpy.callCount).toBe(2);
    });
  });


  describe("to an validatable without the field required", function(){

    beforeEach(function(){
      parameters = {
        name: ko.observable("name")
      };

      parameters.name.validator = {
        setConstraints: function(){}
      };

      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"address",
          constraints:constraints
        }
      ];

    });

    it("to trow an exception", function(){
      expect(function(){
        applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised);
      }).toThrow(new Error("Error applying constraints to field: address\naddress is not a member of SomeExecutable\nSomeExecutable = `{\"name\":\"name\"}`"));
    });
  });

  describe("to an validatable where the field is not an observable", function(){

    beforeEach(function(){
      parameters = {
        name: "name"
      };

      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];

    });

    it("to trow an exception", function(){
      expect(function(){
        applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised);
      }).toThrow(new Error("Error applying constraints to field: name\nIt is not an observable or is not extended with a validator. \nname=`\"name\"`"));
    });
  });

  describe("to an validatable where the field is not an observable, but the constraint list is empty", function(){

    beforeEach(function(){
      parameters = {
        name: "name"
      };

      constraints = [];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];

    });

    it("to trow an exception", function(){
      expect(function(){
        applyConstraints("SomeExecutable", parameters, constraintRules, aRule.asPromised);
      }).not.toThrow();
    });
  });
});