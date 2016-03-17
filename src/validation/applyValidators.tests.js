describe("applyValidators", [
  "qvc/validation/applyValidators",
  "knockout"
], function (
  applyValidators,
  ko
) {
  describe("with non-observables", function(){
    beforeEach(function(){
      this.parameters = {
        non: 'test'
      };
    });

    it("should return an empty list", function(){
      expect(applyValidators(this.parameters, 'SomeExecutable')).toEqual([]);
    });

    it("should not extend the value", function(){
      expect(this.parameters.non.validator).toBeUndefined();
    });
  });

  describe("of observable", function(){
    beforeEach(function(){
      this.ob = ko.observable('test');
      this.result = applyValidators({obs: this.ob}, 'SomeExecutable');
    });

    it("should include the observable in the list", function(){
      expect(this.result).toEqual([this.ob]);
    });

    it("should add a validator to the observable", function(){
      expect(this.ob.validator).toBeDefined();
    });

    it("should set the right name on the validator", function(){
      expect(this.ob.validator.name).toBe("obs");
    });

    it("should set the right path on the validator", function(){
      expect(this.ob.validator.path).toBe("obs");
    });

    it("should set the right executable on the validator", function(){
      expect(this.ob.validator.executableName).toBe("SomeExecutable");
    });

    it("should make it easy to see if the observable is valid", function(){
      expect(this.ob.isValid).toBeA(Function);
    });
  });

  describe("with nested fields inside an observable", function(){

    beforeEach(function(){
      this.parameters = {
        address: ko.observable({
          street: ko.observable("street"),
          postCode: ko.observable("postcode")
        }),
        name: ko.observable("name")
      };
      this.result = applyValidators(this.parameters, "SomeExecutable");

    });

    it("should add all the field to validatableFields", function(){
      expect(this.result.length).toBe(4);
    });

    it("should extend the observable with validator", function(){
      expect(this.parameters.address().street.validator).toBeDefined();
      expect(this.parameters.address().postCode.validator).toBeDefined();
      expect(this.parameters.address.validator).toBeDefined();
      expect(this.parameters.name.validator).toBeDefined();
    });

    it("should set the correct name on the validator", function(){
      expect(this.parameters.address().street.validator.name).toBe("street");
    });

    it("should set the correct path on the validator", function(){
      expect(this.parameters.address().street.validator.path).toBe("address.street");
    });

    it("should set the correct ExecutableName on the validator", function(){
      expect(this.parameters.address().street.validator.executableName).toBe("SomeExecutable");
    });
  });

  describe("with nested fields", function(){

    beforeEach(function(){
      this.parameters = {
        address: {
          street: ko.observable("street"),
          postCode: ko.observable("postcode")
        },
        name: ko.observable("name")
      };
      this.result = applyValidators(this.parameters, "SomeExecutable");

    });

    it("should add all the field to validatableFields", function(){
      expect(this.result.length).toBe(3);
    });

    it("should extend the observable with validator", function(){
      expect(this.parameters.address.street.validator).toBeDefined();
      expect(this.parameters.address.postCode.validator).toBeDefined();
      expect(this.parameters.name.validator).toBeDefined();
    });

    it("should set the correct name on the validator", function(){
      expect(this.parameters.address.street.validator.name).toBe("street");
    });

    it("should set the correct path on the validator", function(){
      expect(this.parameters.address.street.validator.path).toBe("address.street");
    });

    it("should set the correct ExecutableName on the validator", function(){
      expect(this.parameters.address.street.validator.executableName).toBe("SomeExecutable");
    });
  });
});