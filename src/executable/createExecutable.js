define([
  "qvc/executable/makeHooks",
  "qvc/executable/execute",
  "qvc/validation/applyValidators",
  "qvc/constraints/applyConstraints",
  "qvc/validation/Validator",
  "knockout"
], function(
  makeHooks,
  executeMethod,
  applyValidators,
  applyConstraints,
  Validator,
  ko
){
  return function createExecutable(name, type, parameters, hooks, qvc){
    var hooks = makeHooks(hooks);
    var executable = Object.create(null);
    var execute = function(){
      executeMethod.call(executable, type, name, hooks, qvc);
      return false;
    };

    var validatableFields = applyValidators(parameters, name);

    executable.isBusy = ko.observable(false);
    executable.hasError = ko.observable(false);
    executable.validator = new Validator();
    executable.isValid = function () {
      return validatableFields.every(function(constraint){
        return constraint.validator && constraint.validator.isValid();
      }) && execute.validator.isValid();
    };

    execute.isValid = ko.pureComputed(executable.isValid, executable);
    execute.isBusy = ko.pureComputed(executable.isBusy, executable);
    execute.hasError = ko.pureComputed(executable.hasError, executable);

    execute.onSuccess = function(callback){
      hooks.success = callback;
      return execute;
    };
    execute.onError = function(callback){
      hooks.error = callback;
      return execute;
    };
    execute.onInvalid = function(callback){
      hooks.invalid = callback;
      return execute;
    };
    execute.beforeExecute = function(callback){
      hooks.beforeExecute = callback;
      return execute;
    };
    execute.canExecute = function(callback){
      hooks.canExecute = callback;
      return execute;
    };
    execute.result = function(){
      if(arguments.length == 1){
        hooks.result = arguments[0];
        return execute;
      }
      return executable.result.result;
    };
    execute.onComplete = function(callback){
      hooks.complete = callback;
      return execute;
    };

    execute.validator = executable.validator;
    execute.parameters = Object.seal(parameters);
    execute.validate = executable.validate = function(){
      execute.validator.validate(true);
      if (execute.validator.isValid()) {
        validatableFields.forEach(function(constraint){
          var validator = constraint.validator;
          if (validator) {
            validator.validate(constraint());
          }
        });
      }
    };

    execute.clearValidationMessages = executable.clearValidationMessages = function () {
      execute.validator.reset();
      validatableFields.forEach(function(constraint){
        var validator = constraint.validator;
        if (validator) {
          validator.reset();
        }
      });
    };

    qvc.constraintResolver.resolveConstraints(name)
      .then(function(constraints){
        applyConstraints(name, parameters, constraints, qvc.config.resolveRule);
      });

    return execute;
  }
});
