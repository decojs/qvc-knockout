define(function(){
  return function(chainable, hooks, type){
    var methods = type === 'query'
      ? ['beforeExecute', 'canExecute', 'onSuccess', 'onError', 'onInvalid', 'result', 'onComplete']
      : ['beforeExecute', 'canExecute', 'onSuccess', 'onError', 'onInvalid', 'onComplete'];

    methods.forEach(function(method){
      chainable[method] = function(callback){
        hooks[method] = callback;
        return chainable;
      };
    });
  };
});