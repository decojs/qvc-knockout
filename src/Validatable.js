define([
  "qvc/validation",
  "qvc/Validator",
  "knockout",
  "qvc/koExtensions"
], function(
  validation,
  Validator,
  ko
){

  function Validatable(name, parameters, constraintResolver){
    var self = this;

    this.validator = new Validator();
    this.validatableFields = [];
    this.validatableParameters = parameters;


    init: {
      this.validatableFields = validation.recursivelyExtendParameters(self.validatableParameters, name);
      if(constraintResolver)
        constraintResolver.applyValidationConstraints(name).then(self.applyConstraints.bind(this, name));
    }
  }

  Validatable.prototype.isValid = function () {
    return this.validatableFields.every(function(constraint){
      return constraint.validator && constraint.validator.isValid();
    }) && this.validator.isValid();
  };

  Validatable.prototype.applyViolations = function(violations, executableName){
    violations.forEach(function(violation){
      var message = violation.message;
      var fieldName = violation.fieldName;
      if (fieldName && fieldName.length > 0) {
        //one of the fields violates a constraint
        validation.applyViolationMessageToField(this.validatableParameters, fieldName, executableName, message);
      } else {
        //the validatable violates a constraint
        validation.applyViolationMessageToValidatable(this, message);
      }
    }.bind(this));
  };

  Validatable.prototype.applyConstraints = function(executableName, fields){
    var parameters = this.validatableParameters;

    fields.forEach(function(field){
      var fieldName = field.name;
      var constraints = field.constraints;

      if(constraints == null || constraints.length == 0)
        return;

      var object = validation.findField(fieldName, parameters, executableName, "Error applying constraints to field");

      if (ko.isObservable(object) && "validator" in object) {
        object.validator.setConstraints(constraints);
      } else {
        throw new Error("Error applying constraints to field: " + fieldName + "\n" +
          "It is not an observable or is not extended with a validator. \n" +
          fieldName + "=`" + ko.toJSON(object) + "`");
      }
    });
  };

  Validatable.prototype.validate = function(){
    this.validator.validate(true);
    if (this.validator.isValid()) {
      this.validatableFields.forEach(function(constraint){
        var validator = constraint.validator;
        if (validator) {
          validator.validate(constraint());
        }
      });
    }
  };

  Validatable.prototype.clearValidationMessages = function () {
    this.validator.reset();
    this.validatableFields.forEach(function(constraint){
      var validator = constraint.validator;
      if (validator) {
        validator.reset();
      }
    });
  };

  return Validatable;
});