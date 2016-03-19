define(function(){
  return function(hooks){
    hooks = hooks || {};
    return {
      beforeExecute: hooks.beforeExecute || function () {},
      canExecute: hooks.canExecute || function(){return true;},
      error: hooks.error || function () {},
      success: hooks.success || function () {},
      result: hooks.result || function(){},
      complete: hooks.complete || function () {},
      invalid: hooks.invalid || function() {}
    };
  };
});