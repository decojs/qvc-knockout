define([
  "qvc/executable/makeHooks",
  "qvc/executable/makeChaining",
  "qvc/executable/executeMethods",
  "qvc/executable/executeOnServer",
  "qvc/validation/applyValidators",
  "qvc/constraints/applyConstraints",
  "qvc/validation/applyViolations",
  "qvc/validation/Validator",
  "knockout"
], function(
  makeHooks,
  makeChaining,
  executeMethods,
  executeOnServer,
  applyValidators,
  applyConstraints,
  applyViolations,
  Validator,
  ko
){
  return function createExecutable(name, type, parameters, hooks, qvc){
    var executable = Object.create(null);
    var hooks = makeHooks(hooks);
    var execute = function(){
      if(!executeMethods.canExecute(hooks, executable)){
        return false;
      }

      executable.isBusy(true);

      executeMethods.doExecute(function(){
        return executeOnServer(type, name, parameters, qvc.config);
      }, function onSuccess(result){
        executable.hasError(false);
        executable.clearValidationMessages();
        hooks.onSuccess();
        if(type === 'query'){
          hooks.result(result);
        }
      }, function onInvalid(violations){
        applyViolations(name, parameters, executable.validator, violations || []);
        hooks.onInvalid();
      }, function onError(error){
        executable.hasError(true);
        hooks.onError(error);
      }, function onFinally(){
        hooks.onComplete();
        executable.isBusy(false);
      });
      return false;
    };

    makeChaining(execute, hooks, type);

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
