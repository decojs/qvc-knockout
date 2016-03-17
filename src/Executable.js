define([
  "qvc/ExecutableResult",
  "qvc/validation/Validatable",
  "qvc/utils/inheritsFrom",
  "qvc/execute",
  "knockout"
], function(
  ExecutableResult,
  Validatable,
  inheritsFrom,
  execute,
  ko){

  function Executable(name, type, parameters, hooks, qvc){
    Validatable.call(this, name, parameters, qvc.constraintResolver, qvc.config.resolveRule)

    this.name = name;
    this.type = type;
    this.qvc = qvc;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);

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
  }

  Executable.prototype = inheritsFrom(Validatable);

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
      if (result.success === true) {
        this.hasError(false);
        this.clearValidationMessages();
        this.hooks.success(result);
        if(this.type === Executable.Query){
          this.hooks.result(result.result);
        }
      } else if(result.valid !== true) {
        this.applyViolations(result.violations || [], this.name);
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
    }.bind(this), function(){
      this.hooks.complete();
      this.isBusy(false);
    }.bind(this));
    return false;
  };

  Executable.Command = "command";
  Executable.Query = "query";

  return Executable;
});