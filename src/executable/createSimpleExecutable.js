define([
  "qvc/executable/makeHooks",
  "qvc/executable/makeChaining",
  "qvc/executable/executeMethods",
  "qvc/validation/applyValidators",
  "qvc/validation/Validator",
  "knockout"
], function(
  makeHooks,
  makeChaining,
  executeMethods,
  applyValidators,
  Validator,
  ko
){
  return function createSimpleExecutable(name, type, parameters, hooks, qvc){
    var executable = Object.create(null);
    var hooks = makeHooks(hooks);
    var result = Object.create(null);
    var execute = function(){
      executable.isBusy(true);

      executeMethods.doExecute(function(){
        return executeOnServer(type, name, parameters, qvc.config);
      }, function onSuccess(result){
        executable.hasError(false);
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
      return result;
    };

    makeChaining(result, hooks, type);
    applyValidators(parameters, name);

    executable.isBusy = ko.observable(false);
    executable.hasError = ko.observable(false);
    executable.validator = new Validator();

    result.isBusy = ko.pureComputed(executable.isBusy, executable);
    result.hasError = ko.pureComputed(executable.hasError, executable);

    result.validator = executable.validator;
    result.parameters = Object.seal(parameters);

    return execute;
  }
});
