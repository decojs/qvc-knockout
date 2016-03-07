define([
  "qvc/validation",
  "qvc/Validator",
  "knockout",
  "qvc/koExtensions"
], function(
  validation,
  Validator,
  Constraint,
  ko
){

  function Validatable(name, parameters, constraintResolver, resolveRule){
    var self = this;

    this.validator = new Validator();
    this.validatableFields = [];
    this.validatableParameters = parameters;

    init: {
      this.validatableFields = validation.recursivelyExtendParameters(parameters, name);
      if(constraintResolver){
        constraintResolver.resolveConstraints(name)
          .then(function(constraints){
            validation.applyConstraints(name, parameters, constraints, resolveRule);
          });
      }
    }
  }

  Validatable.prototype.isValid = function () {
    return this.validatableFields.every(function(constraint){
      return constraint.validator && constraint.validator.isValid();
    }) && this.validator.isValid();
  };

  Validatable.prototype.applyViolations = function(violations, executableName){
    validation.applyViolations(executableName, this.validatableParameters, this.validator, violations);
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