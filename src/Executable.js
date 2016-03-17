define([
  "qvc/ExecutableResult",
  "qvc/validation/Validator",
  "qvc/validation/applyValidators",
  "qvc/constraints/applyConstraints",
  "qvc/validation/applyViolations",
  "qvc/execute",
  "knockout"
], function(
  ExecutableResult,
  Validator,
  applyValidators,
  applyConstraints,
  applyViolations,
  execute,
  ko
){

  function Executable(name, type, parameters, hooks, qvc){
    this.name = name;
    this.type = type;
    this.qvc = qvc;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);
    this.validator = new Validator();
    this.validatableFields = applyValidators(parameters, name);
    this.parameters = Object.seal(parameters);

    hooks = hooks || {};
    this.hooks = {
      beforeExecute: hooks.beforeExecute || function () {},
      canExecute: hooks.canExecute || function(){return true;},
      error: hooks.error || function () {},
      success: hooks.success || function () {},
      result: hooks.result || function(){},
      complete: hooks.complete || function () {},
      invalid: hooks.invalid || function() {}
    };

    if(qvc.constraintResolver){
      qvc.constraintResolver.resolveConstraints(name)
        .then(function(constraints){
          applyConstraints(name, parameters, constraints, qvc.config.resolveRule);
        });
    }
  }

  Executable.prototype.execute = function () {
    if (this.isBusy()) {
      return false;
    }

    this.hasError(false);

    this.hooks.beforeExecute();

    this.validate();
    if (!this.isValid()) {
      this.hooks.invalid();
      return false;
    }

    if (this.hooks.canExecute() === false) {
      return false;
    }
    this.isBusy(true);

    execute(this.type, this.name, this.parameters, this.qvc.config)
    .then(function(result){
      console.log
      if (result.success === true) {
        this.hasError(false);
        this.clearValidationMessages();
        this.hooks.success(result);
        if(this.type === Executable.Query){
          this.hooks.result(result.result);
        }
      } else if(result.valid !== true) {
        applyViolations(this.name, this.parameters, this.validator, result.violations || []);
        this.hooks.invalid();
      }else{
        this.hasError(true);
        this.hooks.error(result);
      }
    }.bind(this), function(error){
      this.hasError(true);
      this.hooks.error(error);
    }.bind(this))
    .then(function(){
      this.hooks.complete();
      this.isBusy(false);
    }.bind(this), function(e){
      console.error(e.message, e.stack);
      this.hooks.complete();
      this.isBusy(false);
    }.bind(this));
    return false;
  };

  Executable.prototype.isValid = function () {
    return this.validatableFields.every(function(constraint){
      return constraint.validator && constraint.validator.isValid();
    }) && this.validator.isValid();
  };

  Executable.prototype.validate = function(){
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

  Executable.prototype.clearValidationMessages = function () {
    this.validator.reset();
    this.validatableFields.forEach(function(constraint){
      var validator = constraint.validator;
      if (validator) {
        validator.reset();
      }
    });
  };

  Executable.Command = "command";
  Executable.Query = "query";

  return Executable;
});