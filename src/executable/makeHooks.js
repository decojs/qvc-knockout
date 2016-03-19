define(function(){
  return function(hooks){
    hooks = hooks || {};
    return {
      beforeExecute: hooks.beforeExecute || function () {},
      canExecute: hooks.canExecute || function(){return true;},
      onError: hooks.onError || function () {},
      onSuccess: hooks.onSuccess || function () {},
      onInvalid: hooks.onInvalid || function() {},
      result: hooks.onResult || function(){},
      onComplete: hooks.onComplete || function () {}
    };
  };
});