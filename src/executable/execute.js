define([
  "qvc/executable/executeOnServer",
  "qvc/validation/applyViolations"
], function(
  executeOnServer,
  applyViolations
){
  return function execute(type, name, hooks, qvc) {
    if (this.isBusy()) {
      return;
    }

    this.hasError(false);

    hooks.beforeExecute();

    this.validate();
    if (!this.isValid()) {
      hooks.onInvalid();
      return;
    }

    if (hooks.canExecute() === false) {
      return;
    }

    this.isBusy(true);

    executeOnServer(type, name, this.parameters, qvc.config)
    .then(function(result){
      if (result.success === true) {
        this.hasError(false);
        this.clearValidationMessages();
        hooks.onSuccess(result);
        if(type === 'query'){
          hooks.result(result.result);
        }
      } else if(result.valid !== true) {
        applyViolations(name, this.parameters, this.validator, result.violations || []);
        hooks.onInvalid();
      }else{
        this.hasError(true);
        hooks.onError(result);
      }
    }.bind(this), function(error){
      this.hasError(true);
      hooks.onError(error);
    }.bind(this))
    .then(function(){
      hooks.onComplete();
      this.isBusy(false);
    }.bind(this), function(e){
      console.error(e.message, e.stack);
      hooks.onComplete();
      this.isBusy(false);
    }.bind(this));
    return;
  };
});