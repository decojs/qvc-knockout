describe("when applying violations", {
  "qvc/validation/Validator": "Mocks/ValidatorMock"
},["knockout", "qvc/validation/validation", "qvc/validation/Validator"], function(ko, validation, Validator){

  describe("to an validatable with one field", function(){

    beforeEach(function(){

      this.observable = ko.observable();
      this.observable.validator = new Validator();

      var parameters = {
        name: this.observable
      };

      var violations = [
        {
          fieldName:"name",
          message:"not ok"
        }
      ];

      validation.applyViolations("SomeExecutable", parameters, null, violations);
    });

    it("should set isValid to false", function(){
      expect(this.observable.validator.isValid.called).toBe(true);
      expect(this.observable.validator.isValid.firstCall.args[0]).toBe(false);
    });

    it("should set the correct message", function(){
      expect(this.observable.validator.message.called).toBe(true);
      expect(this.observable.validator.message.firstCall.args[0]).toBe("not ok");
    });
  });

  describe("to an validatable with nested fields", function(){

    beforeEach(function(){
      this.observable = ko.observable();
      this.observable.validator = new Validator();

      var parameters = {
        address: {
          street: this.observable
        }
      };

      var violations = [
        {
          fieldName:"address.street",
          message:"not ok"
        }
      ];

      validation.applyViolations("SomeExecutable", parameters, null, violations);
    });

    it("should set isValid to false", function(){
      expect(this.observable.validator.isValid.called).toBe(true);
      expect(this.observable.validator.isValid.firstCall.args[0]).toBe(false);
    });

    it("should set the correct message", function(){
      expect(this.observable.validator.message.called).toBe(true);
      expect(this.observable.validator.message.firstCall.args[0]).toBe("not ok");
    });
  });

  describe("to an validatable with nested observable fields", function(){

    beforeEach(function(){
      this.observable = ko.observable();
      this.observable.validator = new Validator();

      var parameters = {
        address: ko.observable({
          street: this.observable
        })
      };

      var violations = [
        {
          fieldName:"address.street",
          message:"not ok"
        }
      ];

      validation.applyViolations("SomeExecutable", parameters, null, violations);
    });

    it("should set isValid to false", function(){
      expect(this.observable.validator.isValid.called).toBe(true);
      expect(this.observable.validator.isValid.firstCall.args[0]).toBe(false);
    });

    it("should set the correct message", function(){
      expect(this.observable.validator.message.called).toBe(true);
      expect(this.observable.validator.message.firstCall.args[0]).toBe("not ok");
    });
  });

  describe("to an validatable without the fields", function(){
    it("should throw an exception", function(){

      var parameters = {
        name: 'Test Testerson'
      };

      var violations = [
        {
          fieldName:"address",
          message:"not ok"
        }
      ];

      expect(function(){
        validation.applyViolations("SomeExecutable", parameters, null, violations);
      }).toThrow(new Error("Error applying violation: address\naddress is not a member of SomeExecutable\nSomeExecutable = `{\"name\":\"Test Testerson\"}`"));
    });
  });

  describe("to an validatable where the field is not an observable", function(){
    it("should throw an exception", function(){

      var parameters = {
        name: 'Test Testerson'
      };

      var violations = [
        {
          fieldName:"name",
          message:"not ok"
        }
      ];

      expect(function(){
        validation.applyViolations("SomeExecutable", parameters, null, violations);
      }).toThrow(new Error("Error applying violation\nname is not validatable\nit should be an observable"));
    });
  });

  describe("to the validatable", function(){

    beforeEach(function(){

      this.validator = new Validator();
      var parameters = {};

      var violations = [
        {
          fieldName:"",
          message:"not ok"
        }
      ];

      validation.applyViolations("SomeExecutable", parameters, this.validator, violations);

    });

    it("should set isValid to false", function(){
      expect(this.validator.isValid.called).toBe(true);
      expect(this.validator.isValid.firstCall.args[0]).toBe(false);
    });

    it("should set the correct message", function(){
      expect(this.validator.message.calledTwice).toBe(true);
      expect(this.validator.message.secondCall.args[0]).toBe("not ok");
    });
  });
});