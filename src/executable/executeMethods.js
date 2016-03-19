define({
  canExecute: function(hooks, self){
    if (self.isBusy()) {
      return false;
    }

    self.hasError(false);

    hooks.beforeExecute();

    self.validate();
    if (!self.isValid()) {
      hooks.onInvalid();
      return false;
    }

    if (hooks.canExecute() === false) {
      return false;
    }

    return true;
  },
  doExecute: function(execute, onSuccess, onInvalid, onError, onComplete){
    execute()
    .then(function(result){
      if (result.success === true) {
        onSuccess(result.result)
      } else if(result.valid !== true) {
        onInvalid();
      }else{
        onError(result);
      }
    }, onError)
    .then(onComplete, onComplete);
  }
});